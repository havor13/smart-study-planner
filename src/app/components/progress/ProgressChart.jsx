'use client';

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ProgressChart = ({ tasks = [] }) => {
  // Calculate status distribution stats matching model enum
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;

  const pieData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [completed, inProgress, pending],
        backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  // Aggregate tasks dynamically by populated courseCode (or fallback)
  const courseCounts = {};

  tasks.forEach((task) => {
    // Get course code from populated object or fallback label
    const courseCode =
      typeof task.courseId === 'object' && task.courseId?.courseCode
        ? task.courseId.courseCode
        : 'General';

    if (!courseCounts[courseCode]) {
      courseCounts[courseCode] = { total: 0, completed: 0 };
    }

    courseCounts[courseCode].total += 1;
    if (task.status === 'completed') {
      courseCounts[courseCode].completed += 1;
    }
  });

  const categories = Object.keys(courseCounts);
  const categoryData = categories.map((cat) => courseCounts[cat].completed);

  const barData = {
    labels: categories.length > 0 ? categories : ['No Courses'],
    datasets: [
      {
        label: 'Completed Tasks',
        data: categoryData.length > 0 ? categoryData : [0],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'],
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const course = categories[context.dataIndex];
            const stats = courseCounts[course];
            return stats
              ? `Completed: ${stats.completed} of ${stats.total}`
              : 'No tasks';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  if (total === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg font-medium">No tasks found</p>
        <p className="text-sm">Create some tasks to start tracking your progress!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-xl border border-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Task Status Distribution
        </h3>
        <div className="h-[220px] relative flex items-center justify-center">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Completed Tasks by Course
        </h3>
        <div className="h-[220px] relative">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;