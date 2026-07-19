'use client';

import React from 'react';
import { CheckCircle, Clock, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import StatsCard from './StatsCard';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Tasks',
      value: 5,
      icon: <CalendarIcon size={24} className="text-blue-600" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Completed',
      value: 1,
      icon: <CheckCircle size={24} className="text-green-600" />,
      color: 'text-green-600',
      bg: 'bg-green-50',
      subtitle: '20% completion',
    },
    {
      title: 'In Progress',
      value: 1,
      icon: <Clock size={24} className="text-yellow-600" />,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      title: 'Pending',
      value: 3,
      icon: <AlertCircle size={24} className="text-red-600" />,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-blue-500 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold">👋 Welcome back, John!</h1>
        <p className="text-blue-100 mt-2 text-lg">Here's your study overview for today</p>
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
          <p className="text-sm text-gray-500 mt-1">You have 3 tasks pending</p>
          <button className="mt-4 text-sm text-blue-600 font-medium hover:text-blue-700 hover:underline">
            View all tasks →
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800 text-lg">📅 Upcoming</h3>
          <p className="text-sm text-gray-500 mt-1">2 deadlines this week</p>
          <button className="mt-4 text-sm text-blue-600 font-medium hover:text-blue-700 hover:underline">
            View calendar →
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800 text-lg">⏱️ Focus Time</h3>
          <p className="text-sm text-gray-500 mt-1">0 minutes today</p>
          <button className="mt-4 text-sm text-blue-600 font-medium hover:text-blue-700 hover:underline">
            Start timer →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;