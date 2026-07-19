'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const MODES = {
  work: { label: 'Study Session', duration: 25, emoji: '📚' },
  shortBreak: { label: 'Short Break', duration: 5, emoji: '☕' },
  longBreak: { label: 'Long Break', duration: 15, emoji: '🌿' },
};

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work');
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timerRef.current);
            setIsActive(false);
            if (mode === 'work') {
              const newCycles = cycles + 1;
              setCycles(newCycles);
              if (newCycles % 4 === 0) {
                setMode('longBreak');
                setMinutes(MODES.longBreak.duration);
              } else {
                setMode('shortBreak');
                setMinutes(MODES.shortBreak.duration);
              }
            } else {
              setMode('work');
              setMinutes(MODES.work.duration);
            }
            setSeconds(0);
            return;
          }
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, minutes, seconds, mode, cycles]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setMinutes(MODES.work.duration);
    setSeconds(0);
    setCycles(0);
  };

  const formatTime = (min, sec) => {
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const progress = () => {
    const total = MODES[mode].duration * 60;
    const remaining = minutes * 60 + seconds;
    return ((total - remaining) / total) * 100;
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-lg mx-auto">
      <div className="text-center">
        <div className="text-4xl mb-2">{MODES[mode].emoji}</div>
        <h2 className="text-lg font-semibold text-gray-800">{MODES[mode].label}</h2>
        <p className="text-sm text-gray-500 mt-1">Cycles completed: {cycles}</p>
      </div>

      <div className="relative my-8">
        <div className="w-48 h-48 mx-auto relative">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="8"
              strokeDasharray={553}
              strokeDashoffset={553 - (progress() / 100) * 553}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold text-gray-800">
              {formatTime(minutes, seconds)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={toggleTimer}
          className={`p-4 rounded-full ${
            isActive ? 'bg-yellow-100 hover:bg-yellow-200' : 'bg-primary-100 hover:bg-primary-200'
          } transition-colors`}
        >
          {isActive ? <Pause size={24} className="text-yellow-600" /> : <Play size={24} className="text-primary-600" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <RotateCcw size={24} className="text-gray-600" />
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-sm text-gray-600">
          {mode === 'work' 
            ? 'Focus on your task! After this, take a break 🎯' 
            : mode === 'shortBreak' 
            ? 'Relax for 5 minutes! You earned it 😊' 
            : 'Time for a longer break! 🌟'}
        </p>
      </div>
    </div>
  );
};

export default PomodoroTimer;