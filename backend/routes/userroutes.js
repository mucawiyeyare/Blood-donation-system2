import express from "express";
import { registerDonor, loginUser, getAllUsers, getProfile, getDonors } from "../controllers/usercontrollers.js";
import { adminOnly, protect, adminOrHospital, adminOrHealthInstitution, adminOrHospitalOrHealthInstitution } from "../middleware/authMiddleware.js";
import User from "../models/usermodel.js";
import Doctor from "../models/doctorModel.js";
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

// Update profile (donor, doctor, hospital, admin, health institution — anyone editing themselves)
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone, location, bloodType, nationalId, gender, age, profileImage, allowPublicLeaderboard } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate before touching anything, so a bad field can't leave a half-saved profile.
    // The edit form always resends every field, changed or not, so a field is only checked
    // against these (new, stricter) rules when its value is actually different from what's
    // already saved — an old record that predates a rule (e.g. a placeholder phone number)
    // can otherwise never be edited again for anything else.
    const isChanged = (incoming, current) => incoming !== undefined && incoming.trim() !== (current || "").trim();

    if (isChanged(name, user.name)) {
      const trimmed = name.trim();
      if (trimmed.length < 2 || trimmed.length > 100) {
        return res.status(400).json({ message: "Name must be between 2 and 100 characters." });
      }
    }

    if (isChanged(phone, user.phone)) {
      const trimmed = phone.trim();
      if (!/^\+?[0-9\s-]{6,20}$/.test(trimmed)) {
        return res.status(400).json({ message: "Please enter a valid phone number." });
      }
      const phoneOwner = await User.findOne({ phone: trimmed, _id: { $ne: user._id } });
      if (phoneOwner) {
        return res.status(400).json({ message: "That phone number is already registered to another account." });
      }
    }

    if (isChanged(location, user.location) && location.trim().length < 2) {
      return res.status(400).json({ message: "Please enter a valid location." });
    }

    if (bloodType !== undefined && !["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(bloodType)) {
      return res.status(400).json({ message: "Please select a valid blood type." });
    }

    if (gender !== undefined && gender !== "" && !["Male", "Female", "Other"].includes(gender)) {
      return res.status(400).json({ message: "Please select a valid gender." });
    }

    if (age !== undefined && age !== "" && age !== null) {
      const ageNum = Number(age);
      if (!Number.isFinite(ageNum) || ageNum < 16 || ageNum > 100) {
        return res.status(400).json({ message: "Age must be a number between 16 and 100." });
      }
    }

    if (nationalId !== undefined && nationalId.trim()) {
      const idOwner = await User.findOne({ nationalId: nationalId.trim(), _id: { $ne: user._id } });
      if (idOwner) {
        return res.status(400).json({ message: "That Government ID is already registered to another account." });
      }
    }

    // Update fields
    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (location !== undefined) user.location = location.trim();
    if (bloodType !== undefined) user.bloodType = bloodType;
    if (nationalId !== undefined) user.nationalId = nationalId.trim();
    if (gender !== undefined && gender !== "") user.gender = gender;
    if (age !== undefined && age !== "" && age !== null) user.age = Number(age);
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (allowPublicLeaderboard !== undefined) user.allowPublicLeaderboard = Boolean(allowPublicLeaderboard);

    await user.save();

    // A doctor's public card (the Doctor collection, shown on the Doctors page) carries its own
    // copy of the name — keep it in sync so an edit here doesn't go stale on the public site.
    if (user.role === "doctor" && name !== undefined) {
      await Doctor.updateOne({ user: user._id }, { $set: { name: user.name } });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        nationalId: user.nationalId,
        gender: user.gender,
        age: user.age,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        bloodType: user.bloodType,
        role: user.role,
        isAvailable: user.isAvailable,
        lastDonationDate: user.lastDonationDate,
        profileImage: user.profileImage,
        allowPublicLeaderboard: user.allowPublicLeaderboard,
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

// Public analytics report (for Home page & statistics)
router.get("/public-report", async (req, res) => {
  try {
    const donors = await User.find({ role: "donor" });
    const allUsers = await User.find();

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const bloodTypeCount = {};
    const totalDonors = donors.length;

    bloodTypes.forEach((type) => {
      const count = donors.filter((d) => d.bloodType === type).length;
      bloodTypeCount[type] = {
        count: count,
        percentage: totalDonors > 0 ? ((count / totalDonors) * 100).toFixed(1) : 0,
      };
    });

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthDonors = donors.filter((d) => {
      const createdDate = new Date(d.createdAt);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    });

    const lastMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthDonors = donors.filter((d) => {
      const createdDate = new Date(d.createdAt);
      return createdDate.getMonth() === lastMonth.getMonth() && createdDate.getFullYear() === lastMonth.getFullYear();
    });

    const percentageChange =
      lastMonthDonors.length > 0
        ? (((thisMonthDonors.length - lastMonthDonors.length) / lastMonthDonors.length) * 100).toFixed(1)
        : 100;

    // Count unique regions from donor location strings (format: "District, Region")
    const regionSet = new Set();
    donors.forEach((d) => {
      if (d.location && d.location.includes(",")) {
        const region = d.location.split(",").pop().trim();
        if (region) regionSet.add(region);
      }
    });
    const regionsCovered = regionSet.size || 0;

    res.json({
      bloodTypeStats: bloodTypeCount,
      monthlyStats: {
        totalDonationsThisMonth: thisMonthDonors.length,
        newDonorsThisMonth: thisMonthDonors.length,
        percentageChange: Number(percentageChange),
      },
      activityStats: {
        totalDonors: donors.length,
        totalHospitals: allUsers.filter((u) => u.role === "hospital").length,
        totalUsers: allUsers.length,
        regionsCovered,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
