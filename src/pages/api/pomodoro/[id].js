import { connectDB } from '@/lib/mongodb';
import PomodoroSession from '@/models/PomodoroSession';
import { verifyAuth } from '@utils/verifyAuth';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  // Authenticate request and identify current app user
  const auth = await verifyAuth(req, res);
  if (!auth) return;

  const { authUser } = auth;

  await connectDB();

  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: 'Invalid Pomodoro Session ID',
    });
  }

  switch (req.method) {
    // GET: Fetch only sessions belonging to authenticated user
    case 'GET':
      try {
        const session = await PomodoroSession.findOne({
          _id: id,
          userId: authUser._id,
        });

        if (!session) {
          return res.status(404).json({
            error: 'Pomodoro session not found',
          });
        }

        return res.status(200).json(session);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          error: 'Failed to fetch pomodoro session',
        });
      }

    // PUT: Update only sessions belonging to authenticated user
    case 'PUT':
      try {
        const { taskId, startTime, endTime, durationMinutes, type, completed } = req.body;

        const updateData = {};

        if (taskId !== undefined) updateData.taskId = taskId || null;
        if (startTime !== undefined) updateData.startTime = startTime;
        if (endTime !== undefined) updateData.endTime = endTime;
        if (durationMinutes !== undefined) updateData.durationMinutes = durationMinutes;
        if (type !== undefined) updateData.type = type;
        if (completed !== undefined) updateData.completed = completed;

        const updatedSession = await PomodoroSession.findOneAndUpdate(
          {
            _id: id,
            userId: authUser._id,
          },
          { $set: updateData },
          {
            new: true,
            runValidators: true,
          },
        );

        if (!updatedSession) {
          return res.status(404).json({
            error: 'Pomodoro session not found',
          });
        }

        return res.status(200).json(updatedSession);
      } catch (error) {
        return res.status(400).json({
          error: error.message,
        });
      }

    // TODO: Future feature implementation
    // DELETE: Delete a session only belonging to authenticated user
    case 'DELETE':
      try {
        const deletedSession = await PomodoroSession.findOneAndDelete({
          _id: id,
          userId: authUser._id,
        });

        if (!deletedSession) {
          return res.status(404).json({
            error: 'Pomodoro session not found',
          });
        }

        return res.status(200).json({
          message: 'Pomodoro session deleted successfully',
        });
      } catch (error) {
        return res.status(500).json({
          error: 'Failed to delete pomodoro session',
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({
        error: `Method ${req.method} Not Allowed`,
      });
  }
}
