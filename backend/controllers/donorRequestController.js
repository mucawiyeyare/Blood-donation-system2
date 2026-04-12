import DonorRequest from "../models/donorRequestModel.js";
import User from "../models/usermodel.js";
import { createLog } from "./activityLogController.js";

// Hospital creates a request to a donor
export const createRequest = async (req, res) => {
  try {
    const { donorId, bloodType, urgency, message } = req.body;

    // Verify requester is a hospital
    if (req.user.role !== "hospital") {
      return res.status(403).json({ message: "Only hospitals can create donor requests" });
    }

    // Verify donor exists and is a donor
    const donor = await User.findById(donorId);
    if (!donor || donor.role !== "donor") {
      return res.status(404).json({ message: "Donor not found" });
    }

    // Check if donor has donated in last 6 months
    if (donor.lastDonationDate) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      if (donor.lastDonationDate > sixMonthsAgo) {
        return res.status(400).json({ 
          message: "Donor has donated within the last 6 months and is in cooldown period" 
        });
      }
    }

    // Check if there's already a pending request for this donor from this hospital
    const existingRequest = await DonorRequest.findOne({
      hospitalId: req.user._id,
      donorId: donorId,
      status: "Pending"
    });

    if (existingRequest) {
      return res.status(400).json({ 
        message: "You already have a pending request for this donor" 
      });
    }

    // Create the request
    const donorRequest = new DonorRequest({
      hospitalId: req.user._id,
      donorId,
      bloodType,
      urgency: urgency || "Routine",
      message,
    });

    await donorRequest.save();

    // Populate hospital and donor details
    await donorRequest.populate("hospitalId", "name email phone location");
    await donorRequest.populate("donorId", "name email phone bloodType location");

    // Log activity
    await createLog(req.user._id, "Donation request created", "donation", "success", `To: ${donor.name}`);

    res.status(201).json({
      message: "Donor request created successfully",
      request: donorRequest,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all requests made by a hospital
export const getHospitalRequests = async (req, res) => {
  try {
    if (req.user.role !== "hospital") {
      return res.status(403).json({ message: "Only hospitals can view their requests" });
    }

    const { status } = req.query;
    const filter = { hospitalId: req.user._id };
    
    if (status) {
      filter.status = status;
    }

    const requests = await DonorRequest.find(filter)
      .populate("donorId", "name email phone bloodType location")
      .sort({ requestDate: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all requests received by a donor
export const getDonorRequests = async (req, res) => {
  try {
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

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Donor responds to a request (accept or decline)
export const respondToRequest = async (req, res) => {
  try {
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

    // Verify this request is for the logged-in donor
    if (donorRequest.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only respond to your own requests" });
    }

    // Check if request is still pending
    if (donorRequest.status !== "Pending") {
      return res.status(400).json({ message: "This request has already been responded to" });
    }

    // Update request based on response
    if (response === "accept") {
      if (!availabilityTime) {
        return res.status(400).json({ message: "Please provide your availability time" });
      }
      
      donorRequest.status = "Accepted";
      donorRequest.availabilityTime = availabilityTime;
    } else {
      donorRequest.status = "Declined";
      donorRequest.declineReason = declineReason;
    }

    donorRequest.responseDate = new Date();
    await donorRequest.save();

    await donorRequest.populate("hospitalId", "name email phone location");
    await donorRequest.populate("donorId", "name email phone bloodType location");

    res.json({
      message: `Request ${response}ed successfully`,
      request: donorRequest,
    });

    // Log activity
    await createLog(req.user._id, `Donation request ${response}ed`, "donation", "success", `From: ${req.user.name}`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hospital marks donation as completed
export const markCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "hospital") {
      return res.status(403).json({ message: "Only hospitals can mark donations as completed" });
    }

    const donorRequest = await DonorRequest.findById(id);
    
    if (!donorRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Verify this request belongs to the logged-in hospital
    if (donorRequest.hospitalId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only complete your own requests" });
    }

    // Check if request was accepted
    if (donorRequest.status !== "Accepted") {
      return res.status(400).json({ message: "Only accepted requests can be marked as completed" });
    }

    // Update request status
    donorRequest.status = "Completed";
    donorRequest.completionDate = new Date();
    await donorRequest.save();

    // Update donor's last donation date
    await User.findByIdAndUpdate(donorRequest.donorId, {
      lastDonationDate: new Date(),
    });

    await donorRequest.populate("hospitalId", "name email phone location");
    await donorRequest.populate("donorId", "name email phone bloodType location");

    res.json({
      message: "Donation marked as completed successfully",
      request: donorRequest,
    });

    // Log activity
    await createLog(req.user._id, "Blood donation completed", "donation", "success", `Donor: ${donorRequest.donorId.name}`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hospital cancels a pending request
export const cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "hospital") {
      return res.status(403).json({ message: "Only hospitals can cancel requests" });
    }

    const donorRequest = await DonorRequest.findById(id);
    
    if (!donorRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Verify this request belongs to the logged-in hospital
    if (donorRequest.hospitalId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only cancel your own requests" });
    }

    // Only pending requests can be cancelled
    if (donorRequest.status !== "Pending") {
      return res.status(400).json({ message: "Only pending requests can be cancelled" });
    }

    donorRequest.status = "Cancelled";
    await donorRequest.save();

    res.json({
      message: "Request cancelled successfully",
      request: donorRequest,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get donor status (for hospitals to see availability)
export const getDonorStatus = async (req, res) => {
  try {
    const { donorId } = req.params;

    const donor = await User.findById(donorId);
    if (!donor || donor.role !== "donor") {
      return res.status(404).json({ message: "Donor not found" });
    }

    let status = "Available";
    let cooldownEndsAt = null;

    // Check if donor donated in last 6 months
    if (donor.lastDonationDate) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      if (donor.lastDonationDate > sixMonthsAgo) {
        status = "Donated Recently";
        cooldownEndsAt = new Date(donor.lastDonationDate);
        cooldownEndsAt.setMonth(cooldownEndsAt.getMonth() + 6);
      }
    }

    // Check if donor has pending requests
    if (status === "Available") {
      const pendingRequest = await DonorRequest.findOne({
        donorId: donorId,
        status: "Pending"
      });

      if (pendingRequest) {
        status = "Requested";
      }
    }

    // Check manual availability flag
    if (!donor.isAvailable) {
      status = "Unavailable";
    }

    res.json({
      donorId,
      status,
      cooldownEndsAt,
      isAvailable: donor.isAvailable,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
