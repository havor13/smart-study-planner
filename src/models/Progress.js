import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  completedPomodoros: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite on hot reloads
export default mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
