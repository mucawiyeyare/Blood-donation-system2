import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String,
       required: true },

    email: { 
      type: String,
       required: true, unique: true },

    password: { 
      type: String,
       required: true },

    nationalId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    phone: { 
      type: String,
       required: true },
    location: {
       type: String, 
      type: String,
       required: true },
    location: {
       type: String, 
       required: true }, // Text location (city/area)
    bloodType: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    role: {
      type: String,
      enum: ["donor", "hospital", "admin", "health_institution"],
      default: "donor",
    },
    age: {
      type: Number,
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    // Hospital specific fields
    hospitalLicense: {
      type: String,
      required: false,
    },
    // Donor-specific fields
    lastDonationDate: {
      type: Date,
      required: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);



export default mongoose.model("User", userSchema);
