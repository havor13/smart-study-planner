import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("smart_study_planner");
  const tasks = db.collection("tasks");
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const task = await tasks.findOne({ _id: new ObjectId(id) });
        res.status(200).json(task);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch task" });
      }
      break;

    case "PUT":
      try {
        const updatedTask = req.body;
        const result = await tasks.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedTask }
        );
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json({ error: "Failed to update task" });
      }
      break;

    case "DELETE":
      try {
        const result = await tasks.deleteOne({ _id: new ObjectId(id) });
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
