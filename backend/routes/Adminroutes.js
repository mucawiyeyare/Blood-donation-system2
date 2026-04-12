import express from "express";
import { protect, adminOnly, adminOrHealthInstitution } from "../middleware/authMiddleware.js";
import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Get all users (Admin only)
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID (Admin can see all, users can see only their own)
router.get("/users/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Allow access if user is admin or requesting their own profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this profile' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin registers a new user
router.post("/register-user", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, phone, location, bloodType, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      bloodType,
      role: role || "donor"
    });

    await newUser.save();

    res.status(201).json({
      message: `${role || "donor"} registered successfully by admin`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin updates user role
router.put("/update-role/:id", protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!["donor", "hospital", "admin", "health_institution"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ message: `User role updated to ${role}`, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin updates entire user profile (Generic Edit)
router.put("/update-user/:id", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, phone, location, bloodType, role, isAvailable, lastDonationDate } = req.body;
    
    // Validations (basic)
    if (role && !["donor", "hospital", "admin", "health_institution"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (bloodType) user.bloodType = bloodType;
    if (role) user.role = role;
    if (typeof isAvailable !== 'undefined') user.isAvailable = isAvailable;
    if (lastDonationDate) user.lastDonationDate = lastDonationDate;

    await user.save();

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
            lastDonationDate: user.lastDonationDate
        } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin deletes a user
router.delete("/delete-user/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin promotes another user (legacy route - kept for compatibility)
router.put("/make-admin/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "admin";
    await user.save();

    res.json({ message: "User promoted to admin", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
