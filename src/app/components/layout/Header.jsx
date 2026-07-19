'use client';

import React from 'react';
import { Bell, Search, User, ChevronDown } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 ml-64 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search tasks, events..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="relative p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-4 py-2 rounded-xl transition-colors border border-transparent hover:border-gray-200">
            <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
              JD
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">John Doe</p>
              <p className="text-xs text-gray-400">Student</p>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;