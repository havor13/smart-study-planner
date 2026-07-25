'use client';

import React, { useState } from 'react';
import TaskItem from './TaskItem';
import { Filter } from 'lucide-react';

const TaskList = ({ tasks = [], compact = false, onAddTask, onToggle, onEdit, onDelete }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === 'course') {
      return (a.course || '').localeCompare(b.course || '');
    }
    return 0;
  });

  if (compact) {
    return (
      <div className="space-y-1">
        {tasks.slice(0, 5).map(task => (
          <TaskItem key={task.id} task={task} compact />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center flex-wrap gap-2">
        <Filter size={18} className="text-gray-400" />
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="doing">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="course">Sort by Course</option>
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No tasks found</p>
            <button 
              onClick={onAddTask}
              className="mt-2 text-blue-600 font-medium hover:underline"
            >
              Create a new task →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;