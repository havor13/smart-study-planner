'use client';

import PomodoroTimer from '../components/timer/PomodoroTimer';

export default function TimerPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <PomodoroTimer />
    </div>
  );
}