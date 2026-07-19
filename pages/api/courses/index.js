import { connectDB } from "../../../lib/mongodb";
import Course from "../../../models/Course";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const courses = await Course.find({});
    return res.status(200).json(courses);
  }

  if (req.method === "POST") {
    try {
      const newCourse = new Course(req.body);
      await newCourse.save();
      return res.status(201).json(newCourse);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
