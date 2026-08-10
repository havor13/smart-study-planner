import { connectDB } from '@/lib/mongodb';
import PomodoroSession from '@/models/PomodoroSession';
import { verifyAuth } from '@utils/verifyAuth';

export default async function handler(req, res) {
  const auth = await verifyAuth(req, res);
  if (!auth) return;

  const { authUser } = auth;

  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const sessions = await PomodoroSession.find({
          userId: authUser._id,
        }).sort({ startTime: -1 });

        return res.status(200).json(sessions);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          error: 'Failed to fetch pomodoro sessions',
        });
      }

    case 'POST':
      try {
        const { taskId, startTime, endTime, durationMinutes, type, completed } = req.body;

        if (!startTime || !endTime || durationMinutes === undefined || !type) {
          return res.status(400).json({
            error: 'Missing required fields',
          });
        }

        const session = await PomodoroSession.create({
          userId: authUser._id,
          taskId: taskId || null,
          startTime,
          endTime,
          durationMinutes,
          type,
          completed: completed ?? true,
        });

        return res.status(201).json(session);
      } catch (error) {
        return res.status(400).json({
          error: error.message,
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({
        error: `Method ${req.method} Not Allowed`,
      });
  }
}
