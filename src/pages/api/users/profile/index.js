import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Task from "@/models/Task";
import { verifyAuth } from "@utils/verifyAuth";

export default async function handler(req, res) {
  // Authenticate user
  const auth = await verifyAuth(req, res);
  if (!auth) {
    return res.headersSent
      ? null
      : res.status(401).json({ error: "Unauthorized" });
  }

  const { authUser } = auth;

  await connectDB();

  // GET: Fetch authenticated user's profile
  if (req.method === "GET") {
    try {
      const totalTasks = await Task.countDocuments({
        userId: authUser._id,
      });

      const completedTasks = await Task.countDocuments({
        userId: authUser._id,
        status: "completed",
      });

      const activeTasks = await Task.countDocuments({
        userId: authUser._id,
        status: "in-progress",
      });

      const completionRate =
        totalTasks === 0
          ? 0
          : Math.round((completedTasks / totalTasks) * 100);

      return res.status(200).json({
        profile: {
          _id: authUser._id,
          firebaseUid: authUser.firebaseUid,
          name: authUser.name,
          email: authUser.email,
          avatar: authUser.avatar,
          createdAt: authUser.createdAt,
          updatedAt: authUser.updatedAt,
          stats: {
            tasksDone: completedTasks,
            completionRate,
            activeTasks,
          },
        },
      });
    } catch (error) {
      console.error("Profile GET Error:", error);
      return res.status(500).json({
        error: "Failed to fetch profile",
      });
    }
  }

  // PATCH: Update authenticated user's profile
  if (req.method === "PATCH") {
    try {
      const { name, email, avatar } = req.body;

      const updateData = {};

      if (name !== undefined) updateData.name = name.trim();

      if (email !== undefined)
        updateData.email = email.trim().toLowerCase();

      if (avatar !== undefined) updateData.avatar = avatar;

      const updatedUser = await User.findByIdAndUpdate(
        authUser._id,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      );

      return res.status(200).json({
        profile: updatedUser,
      });
    } catch (error) {
      console.error("Profile PATCH Error:", error);

      if (error.code === 11000) {
        return res.status(409).json({
          error: "Email already exists",
        });
      }

      return res.status(400).json({
        error: error.message,
      });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH"]);
  return res
    .status(405)
    .json({ message: `Method ${req.method} Not Allowed` });
}