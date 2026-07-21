// KEEP FOR NOW
// For future implementation of reminders for tasks

import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  reminderTime: { type: Date, required: true },
  method: { type: String, enum: ["popup", "email"], default: "popup" }
});

export default mongoose.models.Reminder || mongoose.model("Reminder", ReminderSchema);
