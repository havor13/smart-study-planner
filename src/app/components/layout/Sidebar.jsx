'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Timer,
  User,
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
    <aside className="w-72 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 bg-linear-to-r from-blue-50 via-indigo-50 to-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-2xl">📚</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              StudyPlanner
            </h1>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Smart Study Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
        <p className="px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Main Menu
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                group flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                }
              `}
            >
              <div className={`
                p-2 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200' 
                  : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
                }
              `}>
                <Icon size={20} />
              </div>
              <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-2 h-2 bg-blue-600 rounded-full shadow-lg shadow-blue-200 animate-pulse"></span>
              )}
            </Link>
          );
        })}

        {/* Profile Link */}
        <Link
          href="/profile"
          className={`
            group flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300
            ${activeTab === 'profile' 
              ? 'bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
            }
          `}
        >
          <div className={`
            p-2 rounded-xl transition-all duration-300
            ${activeTab === 'profile' 
              ? 'bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200' 
              : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
            }
          `}>
            <User size={20} />
          </div>
          <span>Profile</span>
        </Link>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-1.5 bg-linear-to-b from-white to-gray-50/80">
        <p className="px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Account
        </p>
        <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 group">
          <div className="p-2 rounded-xl bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600 transition-all">
            <Settings size={20} />
          </div>
          Settings
        </button>
        <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-300 group">
          <div className="p-2 rounded-xl bg-red-50 text-red-400 group-hover:bg-red-100 group-hover:text-red-600 transition-all">
            <LogOut size={20} />
          </div>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;