import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }

    try {
        await connectDB();

        const { firebaseUid, email, displayName, name, photoURL, avatar } = req.body;

        if (!firebaseUid || !email ) {
            return res.status(400).json({
                success: false,
                message: "firebaseUid and email are required.",
            });
        }

        const userName = name || displayName || email.split("@")[0];
        const userAvatar = avatar || photoURL || "";

        let user = await User.findOne({ firebaseUid });

        if (!user) {
            user = await User.create({
                firebaseUid,
                email,
                name: userName,
                avatar: userAvatar,
            });

            return res.status(201).json({
                success: true,
                message: "User synchronized successfully.",
                user,
            });
        }

        // Keep name/avatar updated if changed in Firebase
        let hasChanges = false;

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
            success: true,
            message: "Sync endpoint reached.",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error.",
        })
    }
}