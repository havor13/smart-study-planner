// mongo+srv querysrv ECONNREFUSED issue fix
import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    // No need for useNewUrlParser or useUnifiedTopology in Mongoose v6+
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
    family: 4,
});

    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ Connected to MongoDB Atlas Cluster0");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
}
