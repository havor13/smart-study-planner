import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./src/lib/mongodb.js";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Define Schemas / Import Models
const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseCode: { type: String, required: true, trim: true, uppercase: true },
    description: { type: String, default: "" },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);
courseSchema.index({ userId: 1, courseCode: 1 }, { unique: true });

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    dueDate: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

const pomodoroSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    type: { type: String, enum: ["focus", "short_break", "long_break"], required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
const PomodoroSession =
  mongoose.models.PomodoroSession || mongoose.model("PomodoroSession", pomodoroSessionSchema);

const FIREBASE_UID = "osqd8oDU1kaEy2LZJs2ikB9Zecj2";

async function seedDatabase() {
  try {
    console.log("🔌 Connecting to database...");
    await connectDB();

    // 1. Find or create the target user
    let user = await User.findOne({ firebaseUid: FIREBASE_UID });

    if (!user) {
      console.log(`👤 User with firebaseUid ${FIREBASE_UID} not found. Creating user document...`);
      user = await User.create({
        firebaseUid: FIREBASE_UID,
        name: "Test Student",
        email: "teststudent@example.com",
        avatar: "",
      });
    } else {
      console.log(`👤 Found existing user: ${user.name} (${user.email})`);
    }

    const userId = user._id;

    // 2. Clear existing user data (Courses, Tasks, Pomodoro Sessions) to keep seed idempotent
    console.log("🧹 Cleaning old sample data for this user...");
    await Course.deleteMany({ userId });
    await Task.deleteMany({ userId });
    await PomodoroSession.deleteMany({ userId });

    // 3. Seed Courses
    console.log("📚 Seeding courses...");
    const createdCourses = await Course.insertMany([
      {
        userId,
        courseCode: "CSE499",
      },
      {
        userId,
        courseCode: "CS310",
      },
      {
        userId,
        courseCode: "MATH201",
      },
    ]);

    const cse499 = createdCourses.find((c) => c.courseCode === "CSE499");
    const cs310 = createdCourses.find((c) => c.courseCode === "CS310");
    const math201 = createdCourses.find((c) => c.courseCode === "MATH201");

    // 4. Seed Tasks
    console.log("📝 Seeding tasks...");
    const createdTasks = await Task.insertMany([
      {
        userId,
        courseId: cse499._id,
        title: "Submit Sprint 2 API Refactoring PR",
        description: "Refactor task & course endpoints with verifyAuth route protection.",
        priority: "high",
        status: "completed",
        dueDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
        completedAt: new Date(Date.now() - 86400000 * 1),
      },
      {
        userId,
        courseId: cse499._id,
        title: "Integrate Gemini AI Study Suggestion Service",
        description: "Set up Gemini API route handler to produce personalized schedule tips.",
        priority: "high",
        status: "in-progress",
        dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
      },
      {
        userId,
        courseId: cs310._id,
        title: "Solve Dynamic Programming Problem Set",
        description: "Complete exercises 4.1 to 4.8 in textbook.",
        priority: "medium",
        status: "pending",
        dueDate: new Date(Date.now() + 86400000 * 5),
      },
      {
        userId,
        courseId: math201._id,
        title: "Review Matrix Transformations for Quiz",
        description: "Study eigenvalues, eigenvectors, and diagonal matrices.",
        priority: "low",
        status: "pending",
        dueDate: new Date(Date.now() + 86400000 * 7),
      },
    ]);

    const completedTask = createdTasks[0];
    const activeTask = createdTasks[1];

    // 5. Seed Pomodoro Sessions
    console.log("⏱️ Seeding pomodoro sessions...");
    const now = Date.now();

    await PomodoroSession.insertMany([
      // Completed Focus Session tied to active task
      {
        userId,
        taskId: activeTask._id,
        startTime: new Date(now - 3600000), // 1 hour ago
        endTime: new Date(now - 2100000),   // 35 mins ago
        durationMinutes: 25,
        type: "focus",
        completed: true,
      },
      // Short Break
      {
        userId,
        taskId: activeTask._id,
        startTime: new Date(now - 2100000),
        endTime: new Date(now - 1800000),
        durationMinutes: 5,
        type: "short_break",
        completed: true,
      },
      // Second Focus Session
      {
        userId,
        taskId: activeTask._id,
        startTime: new Date(now - 1800000),
        endTime: new Date(now - 300000),
        durationMinutes: 25,
        type: "focus",
        completed: true,
      },
      // Long Break Session
      {
        userId,
        taskId: activeTask._id,
        startTime: new Date(now - 300000),
        endTime: new Date(now),
        durationMinutes: 15,
        type: "long_break",
        completed: true,
      },
      // Historical session tied to completed task
      {
        userId,
        taskId: completedTask._id,
        startTime: new Date(now - 86400000 * 2),
        endTime: new Date(now - 86400000 * 2 + 1500000),
        durationMinutes: 25,
        type: "focus",
        completed: true,
      },
    ]);

    console.log("✅ Seed database finished successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();