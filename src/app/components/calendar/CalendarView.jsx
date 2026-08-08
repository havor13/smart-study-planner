'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '@/app/context/AuthContext';
import TaskForm from '@/app/components/tasks/TaskForm';

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
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

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
              task,                    // Full task so it can be viewed on click
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

  // Open the shared TaskForm modal (read-only) when an event is clicked
  const handleSelectEvent = (event) => {
    if (event?.task) {
      setSelectedTask(event.task);
    }
  };

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
        cursor: 'pointer',
      },
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-center h-150">
        <div className="text-gray-500 font-medium">Loading schedule...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-center h-150">
        <div className="text-red-500 font-medium">Error loading calendar: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">📅 Your Schedule</h2>
        </div>

        <div className="h-150">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            views={['month', 'week', 'day']}
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
            style={{ height: '100%' }}
            className="rounded-lg"
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </div>

      {/* View task details in the shared TaskForm modal */}
      {selectedTask && (
        <TaskForm
          task={selectedTask}
          readOnly
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
};

export default CalendarView;