import { connectDB } from "../../../lib/mongodb";
import Task from "../../../models/Task";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const tasks = await Task.find({});
    return res.status(200).json(tasks);
  }

  if (req.method === "POST") {
    try {
      const newTask = new Task(req.body);
      await newTask.save();
      return res.status(201).json(newTask);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
