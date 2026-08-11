'use client';

import React, { useEffect, useState } from 'react';
import ProgressChart from '../components/progress/ProgressChart';
import { useAuth } from '@/app/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProgressPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch authenticated user's tasks
  // Display fetched data as progress analyrics
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Authenticate API requiest using Firebase user's ID token
        const token = await user.getIdToken();

        const res = await fetch('/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await res.json();

        // Support both direct array responses and responses wrapped in a tasks property
        const fetchedTasks = Array.isArray(data) ? data : data.tasks || [];

        setTasks(fetchedTasks);
      } catch (err) {
        console.error('Error loading progress stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
        Error loading analytics: {error}
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📊 Progress Tracking</h1>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <ProgressChart tasks={tasks} />
      </div>
    </>
  );
}
