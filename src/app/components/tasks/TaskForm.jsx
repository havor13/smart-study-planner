'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskForm = ({ task, courses = [], onSubmit, onClose, readOnly = false }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    priority: task?.priority || 'medium',
    course: task?.course || task?.courseCode || task?.courseId?.courseCode || '', // Changed from 'category' to 'course'
    status: task?.status || 'pending',
  });

  useEffect(() => {
    // Allow form to be closed with `ESC` key
    // Clean up listener on unmount
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Normalize entered course code
    // Spacing and letter cose do not affect course lookup
    const normalizedCode = formData.course.toUpperCase().replace(/\s+/g, '');

    // Find matching course from user's existing courses
    const selectedCourse = courses.find(
      (c) => c.courseCode.toUpperCase().replace(/\s+/g, '') === normalizedCode,
    );

    onSubmit({
      ...formData,
      dueDate: new Date(formData.dueDate),
      courseId: selectedCourse?._id || null,
    });
  };

  const inputClass = (disabled = readOnly) =>
    `w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
      disabled
        ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
        : 'border-gray-200 bg-white'
    }`;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {readOnly ? 'Task Details' : task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={inputClass()}
              placeholder="Enter task title..."
              required
              disabled={readOnly}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className={inputClass()}
              placeholder="Add task details..."
              disabled={readOnly}
            />
          </div>

          {/* Due Date + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={inputClass()}
                required
                disabled={readOnly}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className={inputClass()}
                disabled={readOnly}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Course (replaces Category) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>

            <input
              list="course-list"
              value={formData.course}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  course: e.target.value.toUpperCase().replace(/\s+/g, ''),
                })
              }
              className={inputClass()}
              placeholder="Select or type a course"
              disabled={readOnly}
            />

            <datalist id="course-list">
              {courses.map((course) => (
                <option key={course._id} value={course.courseCode} />
              ))}
            </datalist>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={inputClass()}
              disabled={readOnly}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            {readOnly ? (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold transition-all"
              >
                Close
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-200 cursor-pointer"
                >
                  {task ? 'Update Task' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
