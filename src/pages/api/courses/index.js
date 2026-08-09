import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import { verifyAuth } from "@utils/verifyAuth";

export default async function handler(req, res) {
  // Authenticate user and ensure DB connection
  const auth = await verifyAuth(req, res);
  if (!auth) return;

  const { authUser } = auth;

  await connectDB();

  // GET: Fetch only authenticated user's courses
  if (req.method === "GET") {
    try {
      console.log("authUser (GET):", authUser);

      const courses = await Course.find({ userId: authUser._id });
      return res.status(200).json(courses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      return res.status(500).json({ error: "Failed to fetch courses" });
    }
  }

  // POST: Create a new course for authenticated user
  if (req.method === "POST") {
    try {
      // Debug logs
      console.log("authUser (POST):", authUser);
      console.log("Payload (POST):", req.body);

      let { courseCode } = req.body;

      courseCode = courseCode
        .toUpperCase()
        .replace(/\s+/g, "");

      if (!courseCode) {
        return res.status(400).json({ error: "Course code is required" });
      }

      const newCourse = new Course({
        userId: authUser._id,
        courseCode,
      });

      await newCourse.save();
      return res.status(201).json(newCourse);
    } catch (error) {
      console.error("Course creation failed:", error);

      if (error.code === 11000) {
        return res
          .status(409)
          .json({ error: "You already have a course with this course code." });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  // Fallback for unsupported HTTP methods
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
