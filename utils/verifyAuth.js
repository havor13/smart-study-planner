import { adminAuth } from '@/lib/firebaseAdmin';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

/**
 * Server-side Request Guard for API Routes
 * @param {import('next').NextApiRequest} req - Next.js API Request
 * @param {import('next').NextApiResponse} res - Next.js API Response
 * @returns {Promise<{ user: object, decodedToken: object } | null>}
 */
export async function verifyAuth(req, res) {
  try {
    // Extract Bearer Token from Authorization Header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
      return null;
    }

    const token = authHeader.split(' ')[1];

    // Verify Token via Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(token);
    if (!decodedToken || !decodedToken.uid) {
      res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
      return null;
    }

    // Ensure MongoDB Database Connection
    await connectDB();

    // Fetch MongoDB User via firebaseUid
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      res
        .status(404)
        .json({ error: 'User profile not found in database. Please sync user first.' });
      return null;
    }

    return {
      authUser: user,
      decodedToken,
    };
  } catch (err) {
    console.error('❌ Auth Error in verifyAuth:', err.message);
    res.status(401).json({ error: 'Unauthorized: Authentication failed' });
    return null;
  }
}
