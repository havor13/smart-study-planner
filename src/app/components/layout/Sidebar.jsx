'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Timer,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = ({ activeTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, href: '/tasks' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/calendar' },
    { id: 'progress', label: 'Progress', icon: BarChart3, href: '/progress' },
    { id: 'timer', label: 'Pomodoro', icon: Timer, href: '/timer' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-white">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <span className="bg-blue-500 text-white p-2 rounded-xl">📚</span>
          StudyPlanner
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-8 bg-blue-600 rounded-full"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-1 bg-gray-50/50">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all">
          <Settings size={20} className="text-gray-400" />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
          <LogOut size={20} className="text-red-400" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;