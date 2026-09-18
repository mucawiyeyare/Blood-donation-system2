import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    bio: { type: String, default: "", trim: true },
    photo: { type: String, default: "" }, // base64 data URL, same pattern as User.profileImage
    whatsapp: { type: String, default: "", trim: true }, // international format, digits only, for click-to-chat
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
