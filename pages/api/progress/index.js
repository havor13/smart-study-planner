import { connectDB } from "../../../lib/mongodb";
import Progress from "../../../models/Progress";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const progress = await Progress.find({});
    return res.status(200).json(progress);
  }

  if (req.method === "POST") {
    try {
      const newProgress = new Progress(req.body);
      await newProgress.save();
      return res.status(201).json(newProgress);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
