// import dns from "node:dns";
// dns.setServers(["1.1.1.1", "8.8.8.8"]);
// Added this to bypass local DNS blocks to check the connection

import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    // No need for useNewUrlParser or useUnifiedTopology in Mongoose v6+
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ Connected to MongoDB Atlas Cluster0");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
}
