import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  // Only POST requests are supported for user sync
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    // Connect to DB before creating or updating user recprd
    await connectDB();

    const { firebaseUid, email, displayName, name, photoURL, avatar } = req.body;

    // Firebase UID and email required to identify and create user
    if (!firebaseUid || !email) {
      return res.status(400).json({
        success: false,
        message: 'firebaseUid and email are required.',
      });
    }

    // Use avaiable Firebase/user info to provide fallback values
    const userName = name || displayName || email.split('@')[0];
    const userAvatar = avatar || photoURL || '';

    // Find corresponding DB user using FirebaseUID
    let user = await User.findOne({ firebaseUid });

    // Create DB user record if it's new Firebase user
    if (!user) {
      user = await User.create({
        firebaseUid,
        email,
        name: userName,
        avatar: userAvatar,
      });

      return res.status(201).json({
        success: true,
        message: 'User synchronized successfully.',
        user,
      });
    }

    // Check if exisiting user info has changed in Firebase
    let hasChanges = false;

    if (user.email !== email) {
      user.email = email;
      hasChanges = true;
    }

    if (userName && user.name !== userName) {
      user.name = userName;
      hasChanges = true;
    }

    if (userAvatar && user.avatar !== userAvatar) {
      user.avatar = userAvatar;
      hasChanges = true;
    }

    if (hasChanges) {
      await user.save();
    }

    return res.status(200).json({
      message: hasChanges ? 'User synchronized successfully.' : 'User already up to date.',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
}
