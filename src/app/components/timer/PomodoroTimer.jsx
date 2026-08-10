'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

const MODES = {
  work: { label: 'Study Session', duration: 25, emoji: '📚', type: 'focus' },
  shortBreak: { label: 'Short Break', duration: 5, emoji: '☕', type: 'short_break' },
  longBreak: { label: 'Long Break', duration: 15, emoji: '🌿', type: 'long_break' },
};

const PomodoroTimer = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [startTime, setStartTime] = useState(null);

  const timerRef = useRef(null);
  const audioCtxRef = useRef(null);

  const playChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      [0, 0.22].forEach((offset, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = i === 0 ? 880 : 1046.5;
        gain.gain.setValueAtTime(0, now + offset);
        gain.gain.linearRampToValueAtTime(0.3, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.22);
      });
    } catch (err) {
      console.error('Unable to play completion sound:', err);
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const pendingTasks = (Array.isArray(data) ? data : data.tasks || []).filter(
            (t) => t.status !== 'completed'
          );
          setTasks(pendingTasks);
        }
      } catch (err) {
        console.error('Failed to fetch tasks for Pomodoro:', err);
      }
    };

    fetchTasks();
  }, [user]);

  const saveSessionToDB = useCallback(
    async (sessionData) => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        await fetch('/api/pomodoro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(sessionData),
        });
      } catch (error) {
        console.error('Failed to log pomodoro session:', error);
      }
    },
    [user]
  );

  const switchMode = useCallback((newMode) => {
    setIsActive(false);
    setStartTime(null);
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration * 60);
  }, []);

  // Declared before the countdown effect so it can be referenced there
  // without a use-before-define error, and memoized so it's a stable
  // effect dependency.
  const handleSessionComplete = useCallback(async () => {
    const sessionEndTime = new Date();
    const sessionStartTime =
      startTime || new Date(sessionEndTime.getTime() - MODES[mode].duration * 60000);

    await saveSessionToDB({
      taskId: selectedTaskId || null,
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      durationMinutes: MODES[mode].duration,
      type: MODES[mode].type,
      completed: true,
    });

    setStartTime(null);

    if (mode === 'work') {
      const nextCycles = cycles + 1;
      setCycles(nextCycles);
      switchMode(nextCycles % 4 === 0 ? 'longBreak' : 'shortBreak');
    } else {
      switchMode('work');
    }
  }, [startTime, mode, selectedTaskId, cycles, saveSessionToDB, switchMode]);

  // Countdown loop. Completion (reaching 0) is now handled inside the
  // setInterval callback itself — the tick is the external event, so
  // setState calls here happen in response to it, not synchronously
  // in the effect body.
  useEffect(() => {
    if (!isActive) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsActive(false);
          playChime();
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isActive, playChime, handleSessionComplete]);

  const toggleTimer = () => {
    if (!isActive && !startTime) {
      setStartTime(new Date());
    }
    setIsActive((prev) => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setStartTime(null);
    setTimeLeft(MODES[mode].duration * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-lg mx-auto w-full">
      {/* Mode Switcher Tabs */}
      <div className="flex justify-center gap-2 mb-6 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
        {Object.keys(MODES).map((key) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              mode === key
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {MODES[key].emoji} {MODES[key].label}
          </button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-gray-500">Cycles Completed: {cycles}</p>
      </div>

      {/* Task Selector (Optional) */}
      {mode === 'work' && tasks.length > 0 && (
        <div className="mt-4 text-center">
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            FOCUSING ON
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 max-w-xs w-full cursor-pointer"
          >
            <option value="">-- General Study --</option>
            {tasks.map((task) => (
              <option key={task._id} value={task._id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Digital Timer Display — no SVG, no absolute positioning */}
      <div className="my-10 text-center">
        <div className="text-6xl font-bold tracking-tight tabular-nums text-gray-800">
          {formatTime(timeLeft)}
        </div>
        <div className="text-xs text-gray-400 mt-2 uppercase tracking-wider font-semibold">
          {MODES[mode].label}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={toggleTimer}
          className={`p-4 rounded-full text-white shadow-md transition-all cursor-pointer ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-600'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          title={isActive ? 'Pause' : 'Start'}
        >
          {isActive ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
        </button>

        <button
          onClick={resetTimer}
          className="p-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors cursor-pointer"
          title="Reset Timer"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      {/* Motivational Subtext */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg text-center border border-gray-100">
        <p className="text-xs text-gray-600 font-medium">
          {mode === 'work'
            ? 'Stay locked in! Finishing session logs your daily focus time 🎯'
            : mode === 'shortBreak'
            ? 'Take a short breath! Step away from the screen 😊'
            : 'Great job completing 4 cycles! Take a longer rest 🌟'}
        </p>
      </div>
    </div>
  );
};

export default PomodoroTimer;