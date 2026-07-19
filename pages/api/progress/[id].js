import { connectDB } from "../../../lib/mongodb";
import Progress from "../../../models/Progress";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const progress = await Progress.findById(id);
    return progress ? res.status(200).json(progress) : res.status(404).json({ message: "Not found" });
  }

  if (req.method === "PUT") {
    const updatedProgress = await Progress.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updatedProgress);
  }

  if (req.method === "DELETE") {
    await Progress.findByIdAndDelete(id);
    return res.status(204).end();
  }

  res.status(405).json({ message: "Method not allowed" });
}
