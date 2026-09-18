import express from "express";
import Doctor from "../models/doctorModel.js";

const router = express.Router();

// GET active doctors for the public homepage and Doctors page
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
