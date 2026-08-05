import mongoose from "mongoose";

const pomodoroSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  durationMinutes: { type: Number, required: true },
  type: { type: String, enum: ["focus", "short_break", "long_break"], required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.PomodoroSession ||
  mongoose.model("PomodoroSession", pomodoroSessionSchema);
