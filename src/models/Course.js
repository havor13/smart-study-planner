import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseCode: { type: String, required: true, trim: true },
});

CourseSchema.index(
  { userId: 1, courseCode: 1 },
  { unique: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
