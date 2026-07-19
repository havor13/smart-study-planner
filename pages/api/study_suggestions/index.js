import { connectDB } from "../../../lib/mongodb";
import StudySuggestion from "../../../models/StudySuggestion";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const suggestions = await StudySuggestion.find({});
    return res.status(200).json(suggestions);
  }

  if (req.method === "POST") {
    try {
      const newSuggestion = new StudySuggestion(req.body);
      await newSuggestion.save();
      return res.status(201).json(newSuggestion);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
