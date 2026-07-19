import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  completedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
