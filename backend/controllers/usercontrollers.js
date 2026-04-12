import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createLog } from "./activityLogController.js";
import DonorRequest from "../models/donorRequestModel.js";

/**   Generate JWT Token */
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/**  Register Donor */
export const registerDonor = async (req, res) => {
  try {
    const { name, email, password, phone, location, bloodType } = req.body;

    if (!name || !email || !password || !phone || !location || !bloodType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const donor = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      bloodType,
      role: "donor", // 
    });

    // Log activity
    await createLog(donor._id, "New user registered", "user", "success", `Role: donor`);

    res.status(201).json({
      message: "Donor registered successfully",
      donor: {
        id: donor._id,
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        location: donor.location,
        bloodType: donor.bloodType,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** 🔹 Login User */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        bloodType: user.bloodType,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin view all donors
export const getDonors = async (req, res) => {
  try {
    const { status } = req.query; // Get status filter from query params
    
    const donors = await User.find({ role: "donor" }).select("-password");
    
    
    // Calculate status for each donor
    const donorsWithStatus = await Promise.all(
      donors.map(async (donor) => {
        let donorStatus = "Available";
        let cooldownEndsAt = null;

        // Check if donor donated in last 6 months
        if (donor.lastDonationDate) {
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          
          if (donor.lastDonationDate > sixMonthsAgo) {
            donorStatus = "Donated Recently";
            cooldownEndsAt = new Date(donor.lastDonationDate);
            cooldownEndsAt.setMonth(cooldownEndsAt.getMonth() + 6);
          }
        }

        // Check if donor has pending requests
        if (donorStatus === "Available") {
          const pendingRequest = await DonorRequest.findOne({
            donorId: donor._id,
            status: "Pending"
          });

          if (pendingRequest) {
            donorStatus = "Requested";
          }
        }

        // Check manual availability flag
        if (!donor.isAvailable) {
          donorStatus = "Unavailable";
        }

        return {
          ...donor.toObject(),
          status: donorStatus,
          cooldownEndsAt,
        };
      })
    );

    // Filter by status if provided in query params
    let filteredDonors = donorsWithStatus;
    if (status) {
      filteredDonors = donorsWithStatus.filter(donor => donor.status === status);
    }

    res.json(filteredDonors);
  } catch (err) {
    console.error("Error in getDonors:", err);
    res.status(500).json({ message: "Server Error loading donors: " + err.message });
  }
};

// view own profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
