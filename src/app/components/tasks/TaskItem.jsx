'use client';

import React, { useState } from 'react';
import { Edit2, Trash2, CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';

const TaskItem = ({ task, onToggle, onEdit, onDelete, compact }) => {
  const [isHovered, setIsHovered] = useState(false);

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };

  const statusIcons = {
    completed: <CheckCircle className="text-green-600" size={20} />,
    doing: <Clock className="text-yellow-600" size={20} />,
    pending: <Circle className="text-gray-400" size={20} />,
  };

  const handleStatusToggle = () => {
    const statusMap = {
      pending: 'doing',
      doing: 'completed',
      completed: 'pending',
    };
    onToggle(task.id, statusMap[task.status]);
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
        <div className="flex items-center gap-2">
          <button onClick={handleStatusToggle} className="hover:scale-110 transition-transform">
            {statusIcons[task.status]}
          </button>
          <span className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
            {task.title}
          </span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <button onClick={handleStatusToggle} className="mt-1 hover:scale-110 transition-transform">
            {statusIcons[task.status]}
          </button>
          <div className="flex-1">
            <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-500 mt-1">{task.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              {task.category && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {task.category}
                </span>
              )}
              <span className="text-xs text-gray-400">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        {isHovered && (
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onEdit(task)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit2 size={16} className="text-gray-500" />
            </button>
            <button 
              onClick={() => onDelete(task.id)}
              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;