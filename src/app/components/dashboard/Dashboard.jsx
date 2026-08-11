'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, AlertCircle, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import StatsCard from './StatsCard';

const Dashboard = () => {
  const { user } = useAuth(); // Retrieve current authenticated user
  const [tasks, setTasks] = useState([]);
  const [focusMinutes, setFocusMinutes] = useState(0);
  const [loading, setLoading] = useState(true);
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch Tasks and Pomodoro Sessions concurrently
        const [tasksRes, pomodoroRes] = await Promise.all([
          fetch('/api/tasks', { headers }),
          fetch('/api/pomodoro', { headers }).catch(() => null), // Graceful fallback if endpoint isn't ready
        ]);

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          const list = Array.isArray(tasksData)
            ? tasksData
            : Array.isArray(tasksData?.tasks)
              ? tasksData.tasks
              : Array.isArray(tasksData?.data)
                ? tasksData.data
                : [];
          setTasks(list);
        }

        if (pomodoroRes && pomodoroRes.ok) {
          const pomodoroData = await pomodoroRes.json();

          // Sum completed Pomodoro session recoreded today
          const today = new Date().toDateString();
          const todayMinutes = pomodoroData
            .filter(
              (session) =>
                new Date(session.createdAt).toDateString() === today && session.completed,
            )
            .reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

          setFocusMinutes(todayMinutes);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Calculate task stats used by dashboard cards
  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = safeTasks.filter((t) => t.status === 'in-progress').length;
  const pendingTasks = safeTasks.filter((t) => t.status === 'pending').length;

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Count unifinished tasks due within seven days
  const upcomingDeadlinesCount = safeTasks.filter((t) => {
    if (!t.dueDate || t.status === 'completed') return false;
    const due = new Date(t.dueDate);
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    return due >= now && due <= nextWeek;
  }).length;

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: <CalendarIcon size={24} className="text-blue-600" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: <CheckCircle size={24} className="text-green-600" />,
      color: 'text-green-600',
      bg: 'bg-green-50',
      subtitle: `${completionPercentage}% completion`,
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: <Clock size={24} className="text-yellow-600" />,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: <AlertCircle size={24} className="text-red-600" />,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Student';

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-blue-500 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold">👋 Welcome back, {displayName}!</h1>
        <p className="text-blue-100 mt-2 text-lg">Here&apos;s your study overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800 text-lg">📚 Study Today</h3>
          <p className="text-sm text-gray-500 mt-1">
            You have {pendingTasks + inProgressTasks} tasks pending
          </p>
          <Link
            href="/tasks"
            className="inline-block mt-4 text-sm text-blue-600 font-medium hover:text-blue-700 hover:underline"
          >
            View all tasks →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800 text-lg">📅 Upcoming</h3>
          <p className="text-sm text-gray-500 mt-1">{upcomingDeadlinesCount} deadlines this week</p>
          <Link
            href="/calendar"
            className="inline-block mt-4 text-sm text-blue-600 font-medium hover:text-blue-700 hover:underline"
          >
            View calendar →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800 text-lg">⏱️ Focus Time</h3>
          <p className="text-sm text-gray-500 mt-1">{focusMinutes} minutes today</p>
          <Link
            href="/timer"
            className="inline-block mt-4 text-sm text-blue-600 font-medium hover:text-blue-700 hover:underline"
          >
            Start timer →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
