'use client';

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ProgressChart = ({ tasks }) => {
  // Calculate stats
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const doing = tasks.filter(t => t.status === 'doing').length;
  const pending = tasks.filter(t => t.status === 'pending').length;

  const pieData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [completed, doing, pending],
        backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  // Bar chart data by category
  const categories = ['School', 'Work', 'Personal'];
  const categoryData = categories.map(cat => 
    tasks.filter(t => t.category === cat && t.status === 'completed').length
  );

  const barData = {
    labels: categories,
    datasets: [
      {
        label: 'Completed Tasks by Category',
        data: categoryData,
        backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899'],
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
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
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-xl">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Task Status Distribution</h3>
        <div className="max-h-[200px]">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Completed Tasks by Category</h3>
        <div className="h-[180px]">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;