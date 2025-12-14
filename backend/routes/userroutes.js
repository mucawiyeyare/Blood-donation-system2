import express from "express";
import { registerDonor, loginUser, getAllUsers, getProfile, getDonors } from "../controllers/usercontrollers.js";
import { adminOnly, protect, adminOrHospital, adminOrHealthInstitution, adminOrHospitalOrHealthInstitution } from "../middleware/authMiddleware.js";
import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";

// Route to fetch all donors

const router = express.Router();

// Donor Registration
router.post("/register", registerDonor);
// User Login
router.post("/login", loginUser);
router.get("/all", protect, adminOnly, getAllUsers);
router.get("/donors", protect, adminOrHospitalOrHealthInstitution, getDonors); // Admin, Hospital, and Health Institution can view donors

router.get("/profile", protect, getProfile);

// Update profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone, location, bloodType } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (bloodType) user.bloodType = bloodType;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        bloodType: user.bloodType,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change password
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide current and new password" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
