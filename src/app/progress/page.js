'use client';

import ProgressChart from '../components/progress/ProgressChart';
import { mockTasks } from '@/lib/mockData';

export default function ProgressPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📊 Progress Tracking</h1>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <ProgressChart tasks={mockTasks} />
      </div>
    </>
  );
}