'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '@/app/context/AuthContext'; // Adjust path if needed

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = await user?.getIdToken();
        
        const res = await fetch('/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch tasks: ${res.statusText}`);
        }

        const data = await res.json();

        // Extract tasks array
        const rawTasks = Array.isArray(data) ? data : data.tasks || data.data || [];

        // Format tasks into react-big-calendar event structure
        const formattedEvents = rawTasks
          .filter((task) => task.dueDate) // Only include tasks that have a due date
          .map((task) => {
            const dueDate = new Date(task.dueDate);
            return {
              id: task._id,
              title: task.title,
              start: dueDate,
              end: dueDate,
              allDay: true,
              priority: task.priority, // Passed for custom eventPropGetter styling
              status: task.status,     // Passed for completion line-through styling
            };
          });

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error loading calendar:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Dynamic styling based on task priority and completion status
  const eventStyleGetter = (event) => {
    let backgroundColor = '#3b82f6'; // default blue (low)

    if (event.priority === 'high') {
      backgroundColor = '#ef4444'; // red
    } else if (event.priority === 'medium') {
      backgroundColor = '#f59e0b'; // amber/yellow
    }

    // Indicate completed tasks with muted styling
    const isCompleted = event.status === 'completed';

    return {
      style: {
        backgroundColor: isCompleted ? '#9ca3af' : backgroundColor,
        opacity: isCompleted ? 0.65 : 1,
        textDecoration: isCompleted ? 'line-through' : 'none',
        borderRadius: '6px',
        color: '#ffffff',
        border: 'none',
        padding: '2px 5px',
        fontSize: '0.85rem',
      },
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-center h-[600px]">
        <div className="text-gray-500 font-medium">Loading schedule...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-center h-[600px]">
        <div className="text-red-500 font-medium">Error loading calendar: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">📅 Your Schedule</h2>
        <div className="flex gap-4 text-xs font-medium">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> High Priority</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Medium Priority</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Low Priority</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span> Completed</span>
        </div>
      </div>

      <div className="h-[600px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          views={['month', 'week', 'day']}
          style={{ height: '100%' }}
          className="rounded-lg"
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
};

export default CalendarView;