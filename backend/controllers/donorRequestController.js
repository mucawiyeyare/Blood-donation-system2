import DonorRequest from "../models/donorRequestModel.js";
import User from "../models/usermodel.js";
import Donation from "../models/donationModel.js";
import { createLog } from "./activityLogController.js";
import { sendWhatsAppMessage } from "../services/whatsappService.js";

// Helper: Auto-resolve expired requests older than 2 hours
export const resolveExpiredRequests = async () => {
  try {
    const now = new Date();
    const result = await DonorRequest.updateMany(
      {
        status: "Pending",
        pendingUntil: { $lt: now },
      },
      {
        $set: { status: "Expired" },
      }
    );
    if (result.modifiedCount > 0) {
      console.log(`[Auto-Expire] Marked ${result.modifiedCount} requests as Expired (2-hour limit reached)`);
    }
  } catch (err) {
    console.error("Error resolving expired requests:", err);
  }
};

// Helper: Build WhatsApp message & URL
export const buildWhatsAppLink = (phone, hospitalName = "Isbitaalka", hospitalLocation = "Mogadishu", donorName = "Walaal", patientInfo = null) => {
  if (!phone) return { message: "", whatsappUrl: "" };
  let cleanedPhone = phone.toString().replace(/[^0-9]/g, "");
  // Ensure Somalia country code 252
  if (cleanedPhone.startsWith("0")) {
    cleanedPhone = "252" + cleanedPhone.substring(1);
  } else if (!cleanedPhone.startsWith("252") && cleanedPhone.length <= 9) {
    cleanedPhone = "252" + cleanedPhone;
  }
  const hName = hospitalName || "Isbitaalka";
  const hLoc = hospitalLocation || "Mogadishu";
  const dName = donorName || "Walaal";

  let patientSection = "";
  if (patientInfo && patientInfo.name) {
    patientSection = `
📋 *Macluumaadka Bukaanka:*
👤 Magac: ${patientInfo.name}${patientInfo.age ? `\n🎂 Da': ${patientInfo.age} sano` : ""}${patientInfo.diagnosis ? `\n🩺 Xaaladda: ${patientInfo.diagnosis}` : ""}${patientInfo.causeOfInjury ? `\n⚠️ Sababta: ${patientInfo.causeOfInjury}` : ""}
`;
  }

  const message = `Asc Wll,

Waxaan kula soo xiriiraynaa *${hName}* 🏥

🩸 *Waxaa loo baahan yahay dhiig-bixin degdeg ah!*
${patientSection}
Fadlan haddii aad awooddo, kaalay *${hName}*
📍 Goobta: ${hLoc}

Mahadsanid walaal ${dName}.
Caawintaadu waxay badbaadin kartaa nolol. ❤️🩸

— *DhiigKaal System*`;

  return {
    message,
    whatsappUrl: `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`,
  };
};

// 1. Hospital creates a single request (Option A)
export const createRequest = async (req, res) => {
  try {
    await resolveExpiredRequests();
    const { donorId, bloodType, urgency, message, patientInfo } = req.body;

    if (req.user.role !== "hospital" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only hospitals or admins can create donor requests" });
    }

    const donor = await User.findById(donorId);
    if (!donor || donor.role !== "donor") {
      return res.status(404).json({ message: "Donor not found" });
    }

    // Check if donor is in 90-day cooldown period
    if (donor.lastDonationDate) {
      const cooldownPeriod = new Date();
      cooldownPeriod.setDate(cooldownPeriod.getDate() - 90); // 3 months cooldown
      if (donor.lastDonationDate > cooldownPeriod) {
        return res.status(400).json({
          message: "Donor has donated recently and is currently in the cooldown period",
        });
      }
    }

    // Check if there is already an active Pending or Arrived request for this donor
    const activeRequest = await DonorRequest.findOne({
      donorId,
      status: { $in: ["Pending", "Arrived"] },
    });

    if (activeRequest) {
      return res.status(400).json({
        message: "This donor currently has an active pending or in-progress request",
      });
    }

    const hospital = await User.findById(req.user._id);
    const requestedAt = new Date();
    const pendingUntil = new Date(requestedAt.getTime() + 2 * 60 * 60 * 1000); // 2 hours

    const donorRequest = new DonorRequest({
      hospitalId: req.user._id,
      donorId,
      bloodType: bloodType || donor.bloodType,
      urgency: urgency || "Routine",
      message,
      patientInfo: patientInfo || {},
      status: "Pending",
      requestDate: requestedAt,
      pendingUntil,
      whatsappSent: true,
    });

    await donorRequest.save();
    await donorRequest.populate("hospitalId", "name email phone location");
    const wa = buildWhatsAppLink(donor.phone, hospital?.name, hospital?.location, donor.name, patientInfo);
    const waMessageText = message || wa.message;

    // Automatically send real WhatsApp message from sender number (616408886) to donor
    const waResult = await sendWhatsAppMessage(donor.phone, waMessageText);

    await createLog(req.user._id, "Donation request created", "donation", "success", `To: ${donor.name} (Blood: ${bloodType || donor.bloodType}). WhatsApp message dispatched.`);

    res.status(201).json({
      message: "Donor request created successfully. WhatsApp message dispatched and 2-hour arrival window started.",
      request: donorRequest,
      whatsapp: wa,
      whatsappDelivery: waResult,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Hospital creates batch requests for multiple donors (Option B)
export const createBatchRequest = async (req, res) => {
  try {
    await resolveExpiredRequests();
    const { donorIds, bloodType, urgency, message } = req.body;

    if (req.user.role !== "hospital" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only hospitals or admins can send batch requests" });
    }

    if (!Array.isArray(donorIds) || donorIds.length === 0) {
      return res.status(400).json({ message: "Please select at least one donor" });
    }

    const hospital = await User.findById(req.user._id);
    const batchId = "BATCH-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    const requestedAt = new Date();
    const pendingUntil = new Date(requestedAt.getTime() + 2 * 60 * 60 * 1000); // 2 hours

    const createdRequests = [];
    const skippedDonors = [];

    for (const donorId of donorIds) {
      const donor = await User.findById(donorId);
      if (!donor || donor.role !== "donor") {
        skippedDonors.push({ donorId, reason: "Donor not found" });
        continue;
      }

      // Check cooldown
      if (donor.lastDonationDate) {
        const cooldownPeriod = new Date();
        cooldownPeriod.setDate(cooldownPeriod.getDate() - 90);
        if (donor.lastDonationDate > cooldownPeriod) {
          skippedDonors.push({ donorId, name: donor.name, reason: "In cooldown period" });
          continue;
        }
      }

      // Check active request
      const activeRequest = await DonorRequest.findOne({
        donorId,
        status: { $in: ["Pending", "Arrived"] },
      });

      if (activeRequest) {
        skippedDonors.push({ donorId, name: donor.name, reason: "Already has an active request" });
        continue;
      }

      const reqDoc = new DonorRequest({
        hospitalId: req.user._id,
        donorId,
        bloodType: bloodType || donor.bloodType,
        urgency: urgency || "Routine",
        message,
        status: "Pending",
        requestDate: requestedAt,
        pendingUntil,
        batchId,
        whatsappSent: true,
      });

      await reqDoc.save();
      await reqDoc.populate("donorId", "name email phone bloodType location nationalId");

      const wa = buildWhatsAppLink(donor.phone, hospital?.name, hospital?.location, donor.name);
      const waMessageText = message || wa.message;
      
      // Automatically send real WhatsApp message to each donor in batch
      sendWhatsAppMessage(donor.phone, waMessageText).catch((e) =>
        console.error(`Batch WhatsApp send error for ${donor.phone}:`, e)
      );

      createdRequests.push({
        ...reqDoc.toObject(),
        whatsapp: wa,
      });
    }

    await createLog(
      req.user._id,
      "Batch donation requests created",
      "donation",
      "success",
      `Sent ${createdRequests.length} requests (Batch ID: ${batchId})`
    );

    res.status(201).json({
      message: `Successfully created ${createdRequests.length} donor requests with 2-hour arrival window.`,
      batchId,
      createdCount: createdRequests.length,
      requests: createdRequests,
      skipped: skippedDonors,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Get all requests made by a hospital
export const getHospitalRequests = async (req, res) => {
  try {
    await resolveExpiredRequests();

    if (req.user.role !== "hospital" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only hospitals or admins can view their requests" });
    }

    const { status, batchId } = req.query;
    const filter = req.user.role === "admin" ? {} : { hospitalId: req.user._id };

    if (status) {
      filter.status = status;
    }
    if (batchId) {
      filter.batchId = batchId;
    }

    const requests = await DonorRequest.find(filter)
      .populate("donorId", "name email phone bloodType location nationalId gender age")
      .populate("hospitalId", "name email phone location")
      .sort({ requestDate: -1 });

    const requestsWithRemaining = requests.map((r) => {
      const remainingSeconds = r.pendingUntil ? Math.max(0, Math.floor((new Date(r.pendingUntil) - new Date()) / 1000)) : 0;
      const wa = buildWhatsAppLink(r.donorId?.phone, r.hospitalId?.name, r.hospitalId?.location);
      return {
        ...r.toObject(),
        remainingSeconds,
        whatsapp: wa,
      };
    });

    res.json(requestsWithRemaining);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Get all requests received by a donor
export const getDonorRequests = async (req, res) => {
  try {
    await resolveExpiredRequests();

    if (req.user.role !== "donor") {
      return res.status(403).json({ message: "Only donors can view their requests" });
    }

    const { status } = req.query;
    const filter = { donorId: req.user._id };

    if (status) {
      filter.status = status;
    }

    const requests = await DonorRequest.find(filter)
      .populate("hospitalId", "name email phone location")
      .sort({ requestDate: -1 });

    const requestsWithRemaining = requests.map((r) => {
      const remainingSeconds = r.pendingUntil ? Math.max(0, Math.floor((new Date(r.pendingUntil) - new Date()) / 1000)) : 0;
      const wa = buildWhatsAppLink(r.hospitalId?.phone, r.hospitalId?.name, r.hospitalId?.location);
      return {
        ...r.toObject(),
        remainingSeconds,
        hospitalWhatsApp: wa,
      };
    });

    res.json(requestsWithRemaining);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. Donor responds to request (Accept or Decline)
export const respondToRequest = async (req, res) => {
  try {
    await resolveExpiredRequests();
    const { id } = req.params;
    const { response, availabilityTime, declineReason } = req.body;

    if (req.user.role !== "donor") {
      return res.status(403).json({ message: "Only donors can respond to requests" });
    }

    if (!["accept", "decline"].includes(response)) {
      return res.status(400).json({ message: "Response must be 'accept' or 'decline'" });
    }

    const donorRequest = await DonorRequest.findById(id);
    if (!donorRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (donorRequest.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only respond to your own requests" });
    }

    if (donorRequest.status === "Expired") {
      return res.status(400).json({ message: "This request has expired (2-hour window has passed)" });
    }

    if (donorRequest.status !== "Pending") {
      return res.status(400).json({ message: `Request cannot be modified in '${donorRequest.status}' status` });
    }

    if (response === "accept") {
      donorRequest.status = "Accepted";
      donorRequest.availabilityTime = availabilityTime || "En route / Immediate";
    } else {
      donorRequest.status = "Declined";
      donorRequest.declineReason = declineReason || "Unavailable at this time";
    }

    donorRequest.responseDate = new Date();
    await donorRequest.save();

    await donorRequest.populate("hospitalId", "name email phone location");
    await donorRequest.populate("donorId", "name email phone bloodType location");

    res.json({
      message: `Request ${response}ed successfully`,
      request: donorRequest,
    });

    await createLog(req.user._id, `Donation request ${response}ed`, "donation", "success", `By: ${req.user.name}`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6. Hospital marks donor as Arrived
export const markArrived = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "hospital" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only hospitals or admins can mark donors as arrived" });
    }

    const donorRequest = await DonorRequest.findById(id);
    if (!donorRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (req.user.role === "hospital" && donorRequest.hospitalId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only manage your own requests" });
    }

    donorRequest.status = "Arrived";
    donorRequest.arrivedAt = new Date();
    await donorRequest.save();

    await donorRequest.populate("hospitalId", "name email phone location");
    await donorRequest.populate("donorId", "name email phone bloodType location");

    await createLog(req.user._id, "Donor arrived at hospital", "donation", "success", `Donor: ${donorRequest.donorId?.name}`);

    res.json({
      message: "Donor marked as Arrived successfully",
      request: donorRequest,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 7. Hospital marks donation as Completed / Donated
export const markCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const { volume = 450, notes = "", releaseBatch = true } = req.body;

    if (req.user.role !== "hospital" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only hospitals or admins can record completed donations" });
    }

    const donorRequest = await DonorRequest.findById(id);
    if (!donorRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (req.user.role === "hospital" && donorRequest.hospitalId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only complete your own requests" });
    }

    // Complete current request
    donorRequest.status = "Completed";
    donorRequest.completionDate = new Date();
    await donorRequest.save();

    // Update donor's last donation date
    const donationDate = new Date();
    await User.findByIdAndUpdate(donorRequest.donorId, {
      lastDonationDate: donationDate,
    });

    // Record in permanent Donation model
    const hospital = await User.findById(donorRequest.hospitalId);
    const donation = new Donation({
      donorId: donorRequest.donorId,
      hospitalId: donorRequest.hospitalId,
      requestId: donorRequest._id,
      bloodType: donorRequest.bloodType,
      donationDate,
      collectionCenter: hospital?.name || "Hospital Clinic",
      volume: Number(volume) || 450,
      status: "Completed",
      notes: notes || "Blood donation completed successfully",
    });
    await donation.save();

    // If part of a batch request and releaseBatch is requested, auto-release remaining pending requests
    let releasedCount = 0;
    if (releaseBatch && donorRequest.batchId) {
      const releaseResult = await DonorRequest.updateMany(
        {
          batchId: donorRequest.batchId,
          _id: { $ne: donorRequest._id },
          status: "Pending",
        },
        {
          $set: { status: "Cancelled", declineReason: "Batch request fulfilled by another donor" },
        }
      );
      releasedCount = releaseResult.modifiedCount;
    }

    await donorRequest.populate("hospitalId", "name email phone location");
    await donorRequest.populate("donorId", "name email phone bloodType location");

    await createLog(
      req.user._id,
      "Blood donation completed",
      "donation",
      "success",
      `Donor: ${donorRequest.donorId?.name} (Blood: ${donorRequest.bloodType})`
    );

    res.json({
      message: `Donation completed successfully! Donor is now in medical cooldown.${releasedCount > 0 ? ` Released ${releasedCount} other pending requests in batch.` : ""}`,
      request: donorRequest,
      donation,
      releasedBatchCount: releasedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 8. Hospital cancels a request
export const cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "hospital" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only hospitals or admins can cancel requests" });
    }

    const donorRequest = await DonorRequest.findById(id);
    if (!donorRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (req.user.role === "hospital" && donorRequest.hospitalId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only cancel your own requests" });
    }

    if (["Completed"].includes(donorRequest.status)) {
      return res.status(400).json({ message: "Completed donations cannot be cancelled" });
    }

    donorRequest.status = "Cancelled";
    await donorRequest.save();

    await createLog(req.user._id, "Request cancelled", "donation", "warning", `Request ID: ${id}`);

    res.json({
      message: "Request cancelled successfully",
      request: donorRequest,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 9. Cancel / Release an entire batch
export const cancelBatchRequests = async (req, res) => {
  try {
    const { batchId } = req.params;

    if (req.user.role !== "hospital" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only hospitals or admins can cancel batch requests" });
    }

    const filter = req.user.role === "admin" ? { batchId, status: "Pending" } : { batchId, hospitalId: req.user._id, status: "Pending" };

    const result = await DonorRequest.updateMany(filter, {
      $set: { status: "Cancelled", declineReason: "Batch cancelled by hospital" },
    });

    res.json({
      message: `Cancelled ${result.modifiedCount} pending requests in batch ${batchId}`,
      cancelledCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 10. Get live donor status (Real-Time workflow status calculation)
export const getDonorStatus = async (req, res) => {
  try {
    await resolveExpiredRequests();
    const { donorId } = req.params;

    const donor = await User.findById(donorId);
    if (!donor || donor.role !== "donor") {
      return res.status(404).json({ message: "Donor not found" });
    }

    let status = "Available";
    let activeRequest = null;
    let cooldownEndsAt = null;
    let remainingSeconds = 0;

    // 1. Check Cooldown (90 days post-donation)
    if (donor.lastDonationDate) {
      const cooldownDate = new Date(donor.lastDonationDate);
      cooldownDate.setDate(cooldownDate.getDate() + 90);

      if (cooldownDate > new Date()) {
        status = "Donated";
        cooldownEndsAt = cooldownDate;
      }
    }

    // 2. If not in cooldown, check if active Pending or Arrived request exists
    if (status === "Available") {
      const pendingOrArrived = await DonorRequest.findOne({
        donorId,
        status: { $in: ["Pending", "Arrived", "Accepted"] },
      })
        .populate("hospitalId", "name email phone location")
        .sort({ requestDate: -1 });

      if (pendingOrArrived) {
        if (pendingOrArrived.status === "Arrived") {
          status = "Arrived";
        } else {
          status = "Pending";
        }
        activeRequest = pendingOrArrived;
        if (pendingOrArrived.pendingUntil) {
          remainingSeconds = Math.max(0, Math.floor((new Date(pendingOrArrived.pendingUntil) - new Date()) / 1000));
        }
      }
    }

    // 3. Check manual availability toggle
    if (donor.isAvailable === false && status === "Available") {
      status = "Unavailable";
    }

    res.json({
      donorId,
      name: donor.name,
      bloodType: donor.bloodType,
      location: donor.location,
      status, // Available | Pending | Arrived | Donated | Unavailable
      activeRequest,
      cooldownEndsAt,
      remainingSeconds,
      isAvailable: donor.isAvailable,
      lastDonationDate: donor.lastDonationDate,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 11. Hospital-specific fulfilled donations history
export const getHospitalDonationHistory = async (req, res) => {
  try {
    if (req.user.role !== "hospital" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access restricted to hospitals and admins" });
    }

    const filter = req.user.role === "admin" ? {} : { hospitalId: req.user._id };

    const donations = await Donation.find(filter)
      .populate("donorId", "name email phone bloodType location nationalId gender age")
      .populate("hospitalId", "name email phone location")
      .sort({ donationDate: -1 });

    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 12. Donor-specific donation history
export const getDonorDonationHistory = async (req, res) => {
  try {
    if (req.user.role !== "donor") {
      return res.status(403).json({ message: "Access restricted to donors" });
    }

    const donations = await Donation.find({ donorId: req.user._id })
      .populate("hospitalId", "name email phone location")
      .sort({ donationDate: -1 });

    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 13. Public leaderboard — Top 3 donors by completed donations (tie-break: alphabetical by name)
export const getLeaderboard = async (req, res) => {
  try {
    const top = await DonorRequest.aggregate([
      { $match: { status: "Completed" } },
      { $group: { _id: "$donorId", count: { $sum: 1 } } },
      // Primary: most donations DESC. Tie-break: donor _id ASC (stable; real name sort done after lookup)
      { $sort: { count: -1 } },
      // Fetch more than 3 so we can re-sort by name after lookup when counts are tied
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "donor",
        },
      },
      { $unwind: "$donor" },
      {
        $project: {
          _id: 0,
          donorId: "$_id",
          donationCount: "$count",
          donorName: "$donor.name",
          firstName: { $arrayElemAt: [{ $split: ["$donor.name", " "] }, 0] },
          lastInitial: {
            $cond: {
              if: { $gt: [{ $size: { $split: ["$donor.name", " "] } }, 1] },
              then: { $substr: [{ $arrayElemAt: [{ $split: ["$donor.name", " "] }, 1] }, 0, 1] },
              else: "",
            },
          },
          bloodType: "$donor.bloodType",
          location: "$donor.location",
          profileImage: "$donor.profileImage",
        },
      },
      // Secondary sort: same count → alphabetical by donor name
      { $sort: { donationCount: -1, donorName: 1 } },
      { $limit: 3 },
      // Remove helper fields before sending
      { $project: { donorId: 0, donorName: 0 } },
    ]);
    res.json(top);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 14. Donor stats — lives saved counter
export const getDonorStats = async (req, res) => {
  try {
    if (req.user.role !== "donor") {
      return res.status(403).json({ message: "Access restricted to donors" });
    }
    const donorId = req.user._id;
    const totalCompleted = await DonorRequest.countDocuments({ donorId, status: "Completed" });
    const totalPending = await DonorRequest.countDocuments({ donorId, status: "Pending" });
    const totalArrived = await DonorRequest.countDocuments({ donorId, status: "Arrived" });
    const totalDeclined = await DonorRequest.countDocuments({ donorId, status: "Declined" });
    res.json({
      livesHelped: totalCompleted,
      totalCompleted,
      totalPending,
      totalArrived,
      totalDeclined,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
