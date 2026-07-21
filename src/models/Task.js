import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  dueDate: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
