import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import Course from "@/models/Course";
import { verifyAuth } from "@utils/verifyAuth";

export default async function handler(req, res) {
  // Authenticate user
  const auth = await verifyAuth(req, res);
  if (!auth) {
    // Return 401 if verifyAuth didn't send a response already
    return res.headersSent ? null : res.status(401).json({ error: "Unauthorized" });
  }

  const { authUser } = auth;

  await connectDB();

  // GET: Fetch all tasks belonging to authenticated user
  if (req.method === "GET") {
    try {
      const { courseId } = req.query;
      const query = { userId: authUser._id };

      if (courseId) {
        query.courseId = courseId;
      }

      const tasks = await Task.find(query)
      .populate("courseId", "courseCode")
      .sort({ dueDate: 1 });
      
      return res.status(200).json({ tasks }); 
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }

  // POST: Create new task tied to authenticated user
  if (req.method === "POST") {
    try {
      const { courseId, title, description, priority, status, dueDate } = req.body;

      if (!courseId || !title) {
        return res.status(400).json({ error: "Course ID and title are required" });
      }

      const course = await Course.findOne({ _id: courseId, userId: authUser._id });
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      const newTask = new Task({
        userId: authUser._id,
        courseId,
        title,
        description,
        priority,
        status,
        dueDate,
      });

      await newTask.save();
      return res.status(201).json({ task: newTask }); 
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Fallback for unsupported HTTP methods
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}