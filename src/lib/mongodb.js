// mongo+srv querysrv ECONNREFUSED issue fix
import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  // Check env variable exists
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined.");
  }

  // Any caller gets active connection object
  if (isConnected) {
    return mongoose.connections;
  };

  try {
    // No need for useNewUrlParser or useUnifiedTopology in Mongoose v6+
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      family: 4,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ Connected to MongoDB");

    return conn; // Return new connection; makes method reusable for multi calls
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
}

export default connectDB;