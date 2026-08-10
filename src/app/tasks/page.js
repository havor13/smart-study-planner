'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  // Helper to get a fresh Firebase ID Token dynamically (no localStorage required)
  const getAuthHeaders = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated Firebase user found');

    const token = await user.getIdToken(); // Get fresh ID Token from Firebase SDK
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/tasks', { headers });

      if (!res.ok) {
        const rawText = await res.text();
        console.error(`[API Error ${res.status}]:`, rawText);
        throw new Error(`Failed to fetch tasks (Status: ${res.status})`);
      }

      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Fetch tasks error:', error);
    }
  }, [getAuthHeaders]);

  const fetchCourses = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/courses', { headers });

      if (!res.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error('Fetch courses error:', error);
    }
  }, [getAuthHeaders]);

  // Wait for Firebase Auth state to resolve on initial load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await Promise.all([fetchTasks(), fetchCourses()]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchTasks, fetchCourses]);

  const handleAddTask = async (taskData) => {
    try {
      const headers = await getAuthHeaders();

      const normalizedCode = taskData.course.toUpperCase().replace(/\s+/g, '');

      let course = courses.find(
        (c) => c.courseCode.toUpperCase().replace(/\s+/g, '') === normalizedCode,
      );

      if (!course) {
        const courseRes = await fetch('/api/courses', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            courseCode: normalizedCode,
          }),
        });

        if (!courseRes.ok) {
          throw new Error('Failed to create course');
        }

        course = await courseRes.json();

        setCourses((prev) => [...prev, course]);
      }

      const payload = {
        ...taskData,
        courseId: course._id,
      };

      delete payload.course;

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create task');

      const data = await res.json();

      const enrichedTask = { ...data.task, courseId: course };

      setTasks((prev) => [enrichedTask, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Add task error:', error);
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      const taskId = editingTask.id || editingTask._id;
      const headers = await getAuthHeaders();

      const normalizedCode = taskData.course.toUpperCase().replace(/\s+/g, '');

      let course = courses.find(
        (c) => c.courseCode.toUpperCase().replace(/\s+/g, '') === normalizedCode,
      );

      if (!course) {
        const courseRes = await fetch('/api/courses', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            courseCode: normalizedCode,
          }),
        });

        if (!courseRes.ok) {
          throw new Error('Failed to create course');
        }

        course = await courseRes.json();

        setCourses((prev) => [...prev, course]);
      }

      const payload = {
        ...taskData,
        courseId: course._id,
      };

      delete payload.course;

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update task');

      const data = await res.json();

      const enrichedTask = { ...data.task, courseId: course };

      setTasks((prev) =>
        prev.map((task) => ((task.id || task._id) === taskId ? enrichedTask : task)),
      );

      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      console.error('Edit task error:', error);
    }
  };

  const handleToggleTask = async (id, status) => {
    if (!id) {
      console.error('Toggle task error: Missing task ID');
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error(`[Toggle Task Error ${res.status}]:`, errData);
        throw new Error(errData.error || errData.message || 'Failed to toggle task');
      }

      const data = await res.json();
      const updatedTask = data.task || data;

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id || task.id === id ? { ...task, ...updatedTask } : task,
        ),
      );
    } catch (error) {
      console.error('Toggle task error:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    // Confirmation is handled by the ConfirmModal in TaskItem
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) throw new Error('Failed to delete task');

      setTasks((prev) => prev.filter((task) => (task.id || task._id) !== id));
    } catch (error) {
      console.error('Delete task error:', error);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  if (loading) {
    return <div className="p-4 text-gray-500">Loading tasks...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📋 Tasks</h1>
          <p className="text-gray-500 mt-1">Manage your study tasks and assignments</p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-200 cursor-pointer"
        >
          <span className="text-white text-xl font-bold">+</span>
          <span className="text-white">New Task</span>
        </button>
      </div>

      <TaskList
        tasks={tasks}
        onAddTask={() => {
          setEditingTask(null);
          setShowForm(true);
        }}
        onToggle={handleToggleTask}
        onEdit={handleEditClick}
        onDelete={handleDeleteTask}
      />

      {showForm && (
        <TaskForm
          task={editingTask}
          courses={courses}
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </>
  );
}
