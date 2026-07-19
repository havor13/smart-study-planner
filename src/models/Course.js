import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date
});

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
