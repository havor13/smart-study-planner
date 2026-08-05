import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyAuth } from "@utils/verifyAuth";
import mongoose from "mongoose";

export default async function handler(req, res) {
  // Protect route, derive authenticated user from token
 const auth = await verifyAuth(req, res);
  if (!auth) return;

  const { authUser } = auth;

  await connectDB();

  const { id } = req.query;

  // Validate ID format (ObjectId or Firebase UID)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid User ID format" });
  }

  // Ensure strict authorization
  // Users can only view or modify their OWN account
  if (authUser._id.toString() !== id) {
    return res.status(403).json({ error: "Forbidden: You cannot manage another user's account" });
  }

  switch (req.method) {
    case "GET":
      try {
        const profile = await User.findById(id).select("-__v");
        if (!profile) {
          return res.status(404).json({ error: "User profile not found" });
        }
        return res.status(200).json(profile);
      } catch (err) {
        return res.status(500).json({ error: "Failed to fetch user profile" });
      }

    case "PUT":
      try {
        const { name, avatar } = req.body;

        // Explicit field selection
        // Prevent field poisoning/overwriting firebaseUid or email
        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (avatar !== undefined) updateData.avatar = avatar;

        const updatedProfile = await User.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true }
        ).select("-__v");

        if (!updatedProfile) {
          return res.status(404).json({ error: "User profile not found" });
        }

        return res.status(200).json(updatedProfile);
      } catch (err) {
        return res.status(400).json({ error: err.message || "Failed to update profile" });
      }

    case "DELETE":
      try {
        // Allow user to delete their account record if necessary
        await User.findByIdAndDelete(id);
        return res.status(200).json({ message: "User profile deleted successfully" });
      } catch (err) {
        return res.status(500).json({ error: "Failed to delete user profile" });
      }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
