import { connectDB } from "@/lib/mongodb";
import PomodoroSession from "@/models/PomodoroSession";

export default async function handler(req, res) {
  await connectDB();

  // GET all sessions
  if (req.method === "GET") {
    try {
      const sessions = await PomodoroSession.find({});
      return res.status(200).json(sessions);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch sessions" });
    }
  }

  // POST create new session
  if (req.method === "POST") {
    try {
      const newSession = new PomodoroSession(req.body);
      await newSession.save();
      return res.status(201).json(newSession);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // PUT update existing session
  if (req.method === "PUT") {
    try {
      const { id, ...updateData } = req.body;
      const updatedSession = await PomodoroSession.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      if (!updatedSession) {
        return res.status(404).json({ error: "Session not found" });
      }
      return res.status(200).json(updatedSession);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // DELETE remove a session
  if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      const deletedSession = await PomodoroSession.findByIdAndDelete(id);
      if (!deletedSession) {
        return res.status(404).json({ error: "Session not found" });
      }
      return res.status(200).json({ message: "Session deleted successfully" });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Fallback for unsupported methods
  res.status(405).json({ message: "Method not allowed" });
}
