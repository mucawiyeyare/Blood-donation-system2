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

    phone: { 
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
      enum: ["donor", "hospital", "admin"],
      default: "donor",
    },
  },
  { timestamps: true }
);



export default mongoose.model("User", userSchema);
