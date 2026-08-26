import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import User from "../models/usermodel.js";
import DonorRequest from "../models/donorRequestModel.js";
import Donation from "../models/donationModel.js";
import bcrypt from "bcryptjs";
import { createLog } from "../controllers/activityLogController.js";

const router = express.Router();

// 1. Get all users (Admin only)
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Get user by ID
router.get("/users/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user.role !== "admin" && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this profile" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Admin registers a new user (Donor, Hospital, Admin, Health Institution)
router.post("/register-user", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, phone, location, bloodType, role, nationalId, gender, age, hospitalLicense } = req.body;

    if (!name || !email || !password || !phone || !location) {
      return res.status(400).json({ message: "Name, email, password, phone, and location are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const existingPhone = await User.findOne({ phone: phone.trim() });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number is already registered" });
    }

    if (nationalId) {
      const existingId = await User.findOne({ nationalId: nationalId.trim() });
      if (existingId) {
        return res.status(400).json({ message: "Government / National ID is already registered" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone.trim(),
      location: location.trim(),
      bloodType: bloodType || "O+",
      role: role || "donor",
      nationalId: nationalId ? nationalId.trim() : undefined,
      gender: gender || "Male",
      age: age ? Number(age) : undefined,
      hospitalLicense,
      isAvailable: true,
    });

    await newUser.save();

    await createLog(req.user._id, "Admin created user", "user", "success", `Created ${newUser.role}: ${newUser.name}`);

    res.status(201).json({
      message: `${role || "User"} registered successfully by admin`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        location: newUser.location,
        phone: newUser.phone,
        bloodType: newUser.bloodType,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Admin updates user profile (Generic Edit)
router.put("/update-user/:id", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, phone, location, bloodType, role, isAvailable, lastDonationDate, nationalId, gender, age, hospitalLicense } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (phone) user.phone = phone.trim();
    if (location) user.location = location.trim();
    if (bloodType) user.bloodType = bloodType;
    if (role && ["donor", "hospital", "admin", "health_institution"].includes(role)) user.role = role;
    if (nationalId !== undefined) user.nationalId = nationalId.trim();
    if (gender) user.gender = gender;
    if (age !== undefined) user.age = Number(age);
    if (hospitalLicense !== undefined) user.hospitalLicense = hospitalLicense;
    if (typeof isAvailable !== "undefined") user.isAvailable = isAvailable;
    if (lastDonationDate !== undefined) user.lastDonationDate = lastDonationDate ? new Date(lastDonationDate) : null;

    await user.save();

    await createLog(req.user._id, "Admin updated user", "user", "success", `Updated: ${user.name} (${user.role})`);

    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        bloodType: user.bloodType,
        role: user.role,
        isAvailable: user.isAvailable,
        lastDonationDate: user.lastDonationDate,
        nationalId: user.nationalId,
        gender: user.gender,
        age: user.age,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. Admin deletes a user
router.delete("/delete-user/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own admin account" });
    }

    await User.findByIdAndDelete(req.params.id);

    await createLog(req.user._id, "Admin deleted user", "user", "warning", `Deleted: ${user.name} (${user.role})`);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. Admin Hospital Management: Get all hospitals with donation & request statistics
router.get("/hospitals", protect, adminOnly, async (req, res) => {
  try {
    const hospitals = await User.find({ role: "hospital" }).select("-password").sort({ name: 1 });

    const hospitalsWithStats = await Promise.all(
      hospitals.map(async (hospital) => {
        const totalRequests = await DonorRequest.countDocuments({ hospitalId: hospital._id });
        const completedDonations = await Donation.countDocuments({ hospitalId: hospital._id });
        const activeRequests = await DonorRequest.countDocuments({
          hospitalId: hospital._id,
          status: { $in: ["Pending", "Arrived"] },
        });

        return {
          ...hospital.toObject(),
          totalRequests,
          completedDonations,
          activeRequests,
        };
      })
    );

    res.json(hospitalsWithStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 7. System Stats & Overview
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalDonors = await User.countDocuments({ role: "donor" });
    const totalHospitals = await User.countDocuments({ role: "hospital" });
    const totalDonations = await Donation.countDocuments({ status: "Completed" });
    const activeRequests = await DonorRequest.countDocuments({ status: { $in: ["Pending", "Arrived"] } });

    // Blood type distribution of registered donors
    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const bloodTypeCounts = {};
    for (const bt of bloodTypes) {
      bloodTypeCounts[bt] = await User.countDocuments({ role: "donor", bloodType: bt });
    }

    res.json({
      totalUsers,
      totalDonors,
      totalHospitals,
      totalDonations,
      activeRequests,
      bloodTypeCounts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
