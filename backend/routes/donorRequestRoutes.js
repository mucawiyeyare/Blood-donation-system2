import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createRequest,
  getHospitalRequests,
  getDonorRequests,
  respondToRequest,
  markCompleted,
  cancelRequest,
  getDonorStatus,
} from "../controllers/donorRequestController.js";

const router = express.Router();

// Hospital creates a request to a donor
router.post("/create", protect, createRequest);

// Get all requests made by a hospital
router.get("/hospital", protect, getHospitalRequests);

// Get all requests received by a donor
router.get("/donor", protect, getDonorRequests);

// Donor responds to a request (accept or decline)
router.put("/:id/respond", protect, respondToRequest);

// Hospital marks donation as completed
router.put("/:id/complete", protect, markCompleted);

// Hospital cancels a pending request
router.delete("/:id", protect, cancelRequest);

// Get donor status
router.get("/status/:donorId", protect, getDonorStatus);

export default router;
