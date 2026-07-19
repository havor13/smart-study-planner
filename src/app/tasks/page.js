'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import { mockTasks } from '@/lib/mockData';

export default function TasksPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      dueDate: new Date(taskData.dueDate)
    };
    setTasks([newTask, ...tasks]);
    setShowForm(false);
  };

  const handleEditTask = (taskData) => {
    setTasks(tasks.map(t => 
      t.id === editingTask.id ? { ...taskData, id: t.id, dueDate: new Date(taskData.dueDate) } : t
    ));
    setEditingTask(null);
    setShowForm(false);
  };

  const handleToggleTask = (id, status) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

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
          className="bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-md"
        >
          <Plus size={20} />
          New Task
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