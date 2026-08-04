'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/app/components/auth/LogoutButton';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Timer,
  User,
  Settings,
  Menu
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, href: '/tasks' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/calendar' },
    { id: 'progress', label: 'Progress', icon: BarChart3, href: '/progress' },
    { id: 'timer', label: 'Timer', icon: Timer, href: '/timer' },
    { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ];

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Mobile Toggle Button */}
      {isMobile && isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg shadow-gray-200/50 hover:shadow-gray-300/70 transition-all duration-300 hover:scale-105 active:scale-95 border border-gray-100"
          aria-label="Open sidebar"
        >
          <Menu size={22} className="text-gray-700" />
        </button>
      )}

      <aside 
        className={`
          bg-white border-r border-gray-100 min-h-screen flex flex-col
          transition-all duration-300 ease-in-out
          ${isMobile ? 'fixed left-0 top-0 z-50 h-full shadow-2xl shadow-gray-900/10' : 'sticky top-0 h-screen'}
          ${isCollapsed ? 'w-[72px]' : 'w-[240px]'}
          ${isMobile && !isCollapsed ? 'translate-x-0' : ''}
          ${isMobile && isCollapsed ? '-translate-x-full' : ''}
          ${!isMobile ? 'translate-x-0' : ''}
        `}
      >
        {/* Logo */}
        <div className={`
          flex items-center h-16 px-4 border-b border-gray-100
          ${isCollapsed ? 'justify-center' : 'gap-3'}
        `}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200/50 shrink-0">
            <span className="text-white text-sm font-bold">📚</span>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-gray-800">StudyPlanner</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`
                    group relative flex items-center rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isCollapsed ? 'justify-center px-0' : 'px-3'}
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  style={{ height: '44px' }}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className="flex items-center justify-center w-10">
                    <Icon size={20} className={`
                      transition-colors duration-200
                      ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                    `} />
                  </div>
                  {!isCollapsed && (
                    <span className={`ml-2 transition-colors duration-200 ${isActive ? 'text-blue-700' : ''}`}>
                      {item.label}
                    </span>
                  )}
                  {isActive && !isCollapsed && (
                    <span className="ml-auto w-1 h-6 bg-blue-600 rounded-full"></span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom - Logout Button Component */}
        <div className={`
          p-3 border-t border-gray-100
          ${isCollapsed ? 'flex justify-center' : ''}
        `}>
          <LogoutButton
            showLabel={!isCollapsed}
            label="Logout"
            iconSize={20}
            title={isCollapsed ? 'Logout' : ''}
            className={`
              group flex items-center rounded-lg text-sm font-medium
              text-red-500 hover:text-red-600 hover:bg-red-50
              transition-all duration-200 w-full
              ${isCollapsed ? 'justify-center px-0' : 'px-3'}
            `}
            iconClassName="text-red-400 group-hover:text-red-500 transition-colors"
          />
        </div>

        {/* Collapse Toggle - Desktop */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              absolute bottom-20 left-1/2 -translate-x-1/2
              p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 
              transition-all duration-200 text-gray-400 hover:text-gray-600
              border border-gray-200
            `}
            aria-label="Toggle sidebar"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
      </aside>
    </>
  );
};

export default Sidebar;