import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const course = await Course.findById(id);
    return course ? res.status(200).json(course) : res.status(404).json({ message: "Not found" });
  }

  if (req.method === "PUT") {
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updatedCourse);
  }

  if (req.method === "DELETE") {
    await Course.findByIdAndDelete(id);
    return res.status(204).end();
  }

  res.status(405).json({ message: "Method not allowed" });
}
