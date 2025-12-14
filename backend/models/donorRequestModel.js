import mongoose from "mongoose";

const donorRequestSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bloodType: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    urgency: {
      type: String,
      enum: ["Routine", "Urgent", "Emergency"],
      default: "Routine",
    },
    message: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Declined", "Completed", "Cancelled"],
      default: "Pending",
    },
    availabilityTime: {
      type: String,
      required: false,
    },
    requestDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    responseDate: {
      type: Date,
      required: false,
    },
    completionDate: {
      type: Date,
      required: false,
    },
    declineReason: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries
donorRequestSchema.index({ hospitalId: 1, status: 1 });
donorRequestSchema.index({ donorId: 1, status: 1 });

export default mongoose.model("DonorRequest", donorRequestSchema);
