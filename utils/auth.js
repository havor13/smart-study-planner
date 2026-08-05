import { adminAuth } from "@/lib/firebaseAdmin";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

/**
 * Verify Firebase ID token
 * @param {string} token - Firebase ID token from client
 * @returns {Promise<object|null>} Decoded user info (uid, email, etc.) or null if invalid
 */
export async function verifyFirebaseToken(token) {
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded; // contains uid, email, etc.
  } catch (err) {
    console.error("❌ Firebase token verification failed:", err.message);
    return null;
  }
}

/**
 * Sync Firebase user with MongoDB
 * (called after verifying token)
 * @param {string} firebaseUid - Firebase UID
 * @param {string} email - User email
 * @param {string} name - User name (matches User model)
 * @param {string} [avatar] - Optional avatar URL
 * @returns {Promise<object>} MongoDB user document
 */
export async function syncUser(firebaseUid, email, name) {
  await connectDB();
  let user = await User.findOne({ firebaseUid });
  if (!user) {
    user = await User.create({ firebaseUid, email, name, avatar });
  }
  return user;
}
