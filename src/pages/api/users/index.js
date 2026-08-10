import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyAuth } from '@utils/verifyAuth';

export default async function handler(req, res) {
  const auth = await verifyAuth(req, res);
  if (!auth) return;

  const { authUser } = auth;

  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        // Return only current authenticated user's profile
        const profile = await User.findById(authUser._id).select('-__v');
        if (!profile) {
          return res.status(404).json({ error: 'User profile not found' });
        }
        return res.status(200).json(profile);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch user profile' });
      }

    case 'POST':
      try {
        const { name, email, avatar } = req.body;

        // Check if user already exists
        let profile = await User.findOne({ firebaseUid: authUser.firebaseUid });

        if (profile) {
          // User already synced
          return res.status(200).json(profile);
        }

        // Create new user profile tied to authenticated Firebase UID
        profile = new User({
          firebaseUid: authUser.firebaseUid,
          name: name || authUser.name || 'Student',
          email: email || authUser.email,
          avatar: avatar || '',
        });

        await profile.save();
        return res.status(201).json(profile);
      } catch (err) {
        if (err.code === 11000) {
          return res.status(409).json({ error: 'User account or email already exists' });
        }
        return res.status(400).json({ error: err.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
