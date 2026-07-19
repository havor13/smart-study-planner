import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      const users = await User.find({});
      return res.status(200).json(users);

    case "POST":
      try {
        const newUser = new User(req.body);
        await newUser.save();
        return res.status(201).json(newUser);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
