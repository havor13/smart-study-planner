import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectDB();
  
  const db = mongoose.connection.db;
  const tasks = db.collection("tasks");
  const { id } = req.query;

  // Validate before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  const queryId = new mongoose.Types.ObjectId(id);

  switch (req.method) {
    case "GET":
      try {
        const task = await tasks.findOne({ _id: queryId });
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.status(200).json(task);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch task" });
      }
      break;

    case "PUT":
      try {
        const updatedTask = req.body;
        delete updatedTask._id; // Prevent change in _id field
        
        const result = await tasks.updateOne(
          { _id: queryId },
          { $set: updatedTask }
        );
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json({ error: "Failed to update task" });
      }
      break;

    case "DELETE":
      try {
        const result = await tasks.deleteOne({ _id: queryId });
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json({ error: "Failed to delete task" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
