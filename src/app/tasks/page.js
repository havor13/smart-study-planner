'use client';

import React, { useState, useEffect } from 'react';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      const parsed = JSON.parse(saved, (key, value) => {
        if (key === 'dueDate') return new Date(value);
        return value;
      });
      setTasks(parsed);
    } else {
      const defaultTasks = [
        {
          id: '1',
          title: 'Complete CSE 499 Project Proposal',
          description: 'Write and submit the project proposal document',
          dueDate: new Date(2026, 6, 10),
          priority: 'high',
          status: 'doing',
          course: 'CSE 499',
        },
        {
          id: '2',
          title: 'Study for Database Exam',
          description: 'Review SQL queries and normalization',
          dueDate: new Date(2026, 6, 15),
          priority: 'high',
          status: 'pending',
          course: 'CSE 333',
        },
      ];
      setTasks(defaultTasks);
      localStorage.setItem('tasks', JSON.stringify(defaultTasks));
    }
  }, []);

  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const handleAddTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      dueDate: new Date(taskData.dueDate)
    };
    saveTasks([newTask, ...tasks]);
    setShowForm(false);
  };

  const handleEditTask = (taskData) => {
    const updated = tasks.map(t => 
      t.id === editingTask.id ? { ...taskData, id: t.id, dueDate: new Date(taskData.dueDate) } : t
    );
    saveTasks(updated);
    setEditingTask(null);
    setShowForm(false);
  };

  const handleToggleTask = (id, status) => {
    const updated = tasks.map(t => t.id === id ? { ...t, status } : t);
    saveTasks(updated);
  };

  const handleDeleteTask = (id) => {
    saveTasks(tasks.filter(t => t.id !== id));
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-200"
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