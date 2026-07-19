import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const task = await Task.findById(id);
    return task ? res.status(200).json(task) : res.status(404).json({ message: "Not found" });
  }

  if (req.method === "PUT") {
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updatedTask);
  }

  if (req.method === "DELETE") {
    await Task.findByIdAndDelete(id);
    return res.status(204).end();
  }

  res.status(405).json({ message: "Method not allowed" });
}
