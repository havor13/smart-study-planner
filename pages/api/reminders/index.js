import { connectDB } from "../../../lib/mongodb";
import Reminder from "../../../models/Reminder";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const reminders = await Reminder.find({});
    return res.status(200).json(reminders);
  }

  if (req.method === "POST") {
    try {
      const newReminder = new Reminder(req.body);
      await newReminder.save();
      return res.status(201).json(newReminder);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}