'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

const MODES = {
  work: { label: 'Study Session', duration: 25, emoji: '📚', type: 'focus' },
  shortBreak: {
    label: 'Short Break',
    duration: 5,
    emoji: '☕',
    type: 'short_break',
  },
  longBreak: {
    label: 'Long Break',
    duration: 15,
    emoji: '🌿',
    type: 'long_break',
  },
};

const PomodoroTimer = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState('work');
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');

  // Store actual start time and elapsed time
  // Timer calculates progress from real system time instead of interval ticks
  const [startTime, setStartTime] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const timerRef = useRef(null);
  const audioCtxRef = useRef(null);

  const totalDurationMs = MODES[mode].duration * 60 * 1000;
  const msLeft = Math.max(0, totalDurationMs - elapsedMs);
  const timeLeftSeconds = Math.ceil(msLeft / 1000);

  // Generate two-tone chime using browser's Web Audio API
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

  // Fetch user's incomplete tasks to associate session with a task
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
            (t) => t.status !== 'completed',
          );

          setTasks(pendingTasks);
        }
      } catch (err) {
        console.error('Failed to fetch tasks for Pomodoro:', err);
      }
    };

    fetchTasks();
  }, [user]);

  // Load today's completed focus sessions from DB to restore cycle count
  useEffect(() => {
    const fetchTodayCycles = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/pomodoro', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const sessions = await res.json();

          const startOfToday = new Date();
          startOfToday.setHours(0, 0, 0, 0);

          const todaysFocusSessions = sessions.filter(
            (s) => s.type === 'focus' && s.completed && new Date(s.startTime) >= startOfToday,
          );

          setCycles(todaysFocusSessions.length);
        }
      } catch (err) {
        console.error('Failed to fetch pomodoro history:', err);
      }
    };

    fetchTodayCycles();
  }, [user]);

  // Save each completed seesion to DB
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
    [user],
  );

  // Reset current timer before switching between study/break modes
  const switchMode = useCallback((newMode) => {
    setIsActive(false);
    setStartTime(null);
    setElapsedMs(0);
    setMode(newMode);
  }, []);

  // Record completed session and auto choose next mode
  const handleSessionComplete = useCallback(async () => {
    const sessionEndTime = new Date();

    // Use recorded start time to store actual session period in DB
    const sessionStartTime = startTime || new Date(sessionEndTime.getTime() - totalDurationMs);

    await saveSessionToDB({
      taskId: selectedTaskId || null,
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      durationMinutes: MODES[mode].duration,
      type: MODES[mode].type,
      completed: true,
    });

    setStartTime(null);
    setElapsedMs(0);

    if (mode === 'work') {
      const nextCycles = cycles + 1;
      setCycles(nextCycles);

      // Long break after every four cycles
      switchMode(nextCycles % 4 === 0 ? 'longBreak' : 'shortBreak');
    } else {
      switchMode('work');
    }
  }, [startTime, mode, selectedTaskId, cycles, totalDurationMs, saveSessionToDB, switchMode]);

  // Update timer from real elapsed time
  // Avoids drift when brwoser throttles or pauses callbacks from inactivity
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalStartTime = Date.now() - elapsedMs;

    timerRef.current = setInterval(() => {
      const currentElapsed = Date.now() - intervalStartTime;

      if (currentElapsed >= totalDurationMs) {
        clearInterval(timerRef.current);
        setIsActive(false);
        setElapsedMs(totalDurationMs);
        playChime();
        handleSessionComplete();
      } else {
        setElapsedMs(currentElapsed);
      }
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [isActive, totalDurationMs, playChime, handleSessionComplete]);

  const toggleTimer = () => {
    if (!isActive) {
      // Preserve original start time when resuming paused session
      if (!startTime) {
        setStartTime(new Date());
      }
    }

    setIsActive((prev) => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setStartTime(null);
    setElapsedMs(0);
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
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer hover:bg-white ${
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
          <label className="block text-xs font-semibold text-gray-400 mb-1">FOCUSING ON</label>
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
          {formatTime(timeLeftSeconds)}
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
            isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
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
              : cycles < 4
                ? `Only ${cycles} cycle${cycles === 1 ? '' : 's'} in — keep going, you've got this! 💪`
                : cycles % 4 === 0
                  ? 'Great job completing 4 cycles! Take a longer rest 🌟'
                  : `You've completed ${cycles} cycles! 🌟`}
        </p>
      </div>
    </div>
  );
};

export default PomodoroTimer;
