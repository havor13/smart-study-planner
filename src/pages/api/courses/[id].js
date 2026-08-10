import { connectDB } from '@/lib/mongodb';
import Course from '@/models/Course';
import { verifyAuth } from '@utils/verifyAuth';

export default async function handler(req, res) {
  // Authenticate request
  const auth = await verifyAuth(req, res);
  if (!auth) return; // verifyAuth will handle the 401 response

  const { authUser } = auth;

  const { id } = req.query;

  // GET: Fetch a course by ID & owner
  if (req.method === 'GET') {
    try {
      const course = await Course.findById({ _id: id, userId: authUser._id });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      return res.status(200).json(course);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching course' });
    }
  }

  // PUT: Update a course by ID & owner
  if (req.method === 'PUT') {
    try {
      const { courseCode } = req.body;

      const updateData = {};
      if (courseCode !== undefined) updateData.courseCode = courseCode;

      const updatedCourse = await Course.findOneAndUpdate(
        { _id: id, userId: authUser._id },
        updateData,
        { new: true, runValidators: true },
      );

      if (!updatedCourse) {
        return res.status(404).json({ message: 'Course not found or unauthorized' });
      }

      return res.status(200).json(updatedCourse);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ error: 'You already have a course with this course code.' });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE: Remove a course by ID & owner
  if (req.method === 'DELETE') {
    try {
      const deletedCourse = await Course.findOneAndDelete({
        _id: id,
        userId: authUser._id,
      });

      if (!deletedCourse) {
        return res.status(404).json({ message: 'Course not found or unauthorized' });
      }
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: 'Error deleting course' });
    }
  }

  // Fallback for unsupported HTTP methods
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
