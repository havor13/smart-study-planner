import { connectDB } from '@/lib/mongodb';
import Task from '@/models/Task';
import Course from '@/models/Course';
import { verifyAuth } from '@utils/verifyAuth';

export default async function handler(req, res) {
  // Authenticate request and identify current app user
  const auth = await verifyAuth(req, res);
  if (!auth) {
    return res.headersSent ? null : res.status(401).json({ error: 'Unauthorized' });
  }

  const { authUser } = auth;

  await connectDB();

  const { id } = req.query;

  // GET: Fetch only tasks belonging to authenticated user
  if (req.method === 'GET') {
    try {
      const task = await Task.findOne({ _id: id, userId: authUser._id });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(200).json({ task });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch task' });
    }
  }

  // PUT / PATCH: Update only tasks belonging to authenticated user
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const { title, description, priority, status, dueDate, courseId } = req.body;

      // If user is reassigning the task to another course, verify course ownership
      if (courseId) {
        const course = await Course.findOne({ _id: courseId, userId: authUser._id });
        if (!course) {
          return res.status(400).json({ error: 'Invalid course assignment' });
        }
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (priority !== undefined) updateData.priority = priority;
      if (status !== undefined) {
        updateData.status = status;
        // Automatically set or clear completedAt timestamp
        updateData.completedAt = status === 'completed' ? new Date() : null;
      }
      if (dueDate !== undefined) updateData.dueDate = dueDate;
      if (courseId !== undefined) updateData.courseId = courseId;

      const updatedTask = await Task.findOneAndUpdate(
        { _id: id, userId: authUser._id },
        { $set: updateData },
        { new: true, runValidators: true },
      ).populate('courseId', 'courseCode');

      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found or unauthorized' });
      }

      return res.status(200).json({ task: updatedTask });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE: Delete a task only belonging to authenticated user
  if (req.method === 'DELETE') {
    try {
      const deletedTask = await Task.findOneAndDelete({ _id: id, userId: authUser._id });

      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found or unauthorized' });
      }

      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete task' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
