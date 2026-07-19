import { connectDB } from "@/lib/mongodb";
import StudySuggestion from "@/models/StudySuggestion";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const suggestion = await StudySuggestion.findById(id);
    return suggestion ? res.status(200).json(suggestion) : res.status(404).json({ message: "Not found" });
  }

  if (req.method === "PUT") {
    const updatedSuggestion = await StudySuggestion.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updatedSuggestion);
  }

  if (req.method === "DELETE") {
    await StudySuggestion.findByIdAndDelete(id);
    return res.status(204).end();
  }

  res.status(405).json({ message: "Method not allowed" });
}
