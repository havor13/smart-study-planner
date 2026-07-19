import { connectDB } from "../../../lib/mongodb";
import Reminder from "../../../models/Reminder";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const reminder = await Reminder.findById(id);
    return reminder ? res.status(200).json(reminder) : res.status(404).json({ message: "Not found" });
  }

  if (req.method === "PUT") {
    const updatedReminder = await Reminder.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updatedReminder);
  }

  if (req.method === "DELETE") {
    await Reminder.findByIdAndDelete(id);
    return res.status(204).end();
  }

  res.status(405).json({ message: "Method not allowed" });
}
