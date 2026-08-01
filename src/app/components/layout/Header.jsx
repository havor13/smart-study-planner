'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'JD';
  };

  const getUserName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 px-8 py-4 ml-72 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left Section - Welcome */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold text-gray-800">
              Good Morning! 👋
            </h2>
            <p className="text-xs text-gray-400">Welcome back, {getUserName()}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search tasks, events..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:bg-white group-hover:border-gray-300"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200 hidden sm:block">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-105">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
          </button>

          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200 group">
            <div className="relative">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-200">
                {getInitials()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-800">{getUserName()}</p>
              <p className="text-xs text-gray-400">Student</p>
            </div>
            <div className="flex items-center gap-1">
              <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded-lg"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;