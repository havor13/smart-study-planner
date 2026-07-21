import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  avatar: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
