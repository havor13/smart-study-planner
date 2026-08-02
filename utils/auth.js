import admin from "@/lib/firebase";

/**
 * Verify Firebase ID token
 * @param {string} token - Firebase ID token from client
 * @returns {Promise<object|null>} Decoded user info (uid, email, etc.) or null if invalid
 */
export async function verifyFirebaseToken(token) {
  try {
    const decoded = await admin.auth().verifyIdToken(token);
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
 * @returns {Promise<object>} MongoDB user document
 */
export async function syncUser(firebaseUid, email, name) {
  const User = (await import("@/models/User")).default;
  let user = await User.findOne({ firebaseUid });
  if (!user) {
    user = await User.create({ firebaseUid, email, name });
  }
  return user;
}
