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
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // mobile drawer open state

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, href: '/tasks' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/calendar' },
    { id: 'progress', label: 'Progress', icon: BarChart3, href: '/progress' },
    { id: 'timer', label: 'Timer', icon: Timer, href: '/timer' },
    { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
  ];

  // Detect mobile vs desktop and keep the two modes in sync.
  // Only resets states when actually CROSSING the 768px breakpoint, so a
  // manually collapsed sidebar isn't re-expanded by unrelated resize events.
  useEffect(() => {
    let prevMobile = window.innerWidth < 768;
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile !== prevMobile) {
        if (mobile) {
          setIsOpen(false); // desktop collapse state doesn't apply on mobile
        } else {
          setIsCollapsed(false);
        }
        prevMobile = mobile;
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-close the drawer when navigating on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const collapsed = !isMobile && isCollapsed;

  return (
    <>
      {/* Mobile overlay - always mounted so its fade transition can play */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile toggle button (only when the drawer is closed) */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
      )}

      <aside
        className={`relative bg-white border-r border-gray-100 flex flex-col
          ${
            isMobile
              ? `fixed left-0 top-0 z-50 h-full w-[260px] shadow-2xl shadow-gray-900/20 transition-transform duration-300 ease-in-out ${
                  isOpen ? 'translate-x-0' : '-translate-x-full'
                }`
              : `sticky top-0 h-screen transition-[width] duration-300 ease-in-out ${
                  isCollapsed ? 'w-[76px]' : 'w-[250px]'
                }`
          }`}
      >
        {/* Desktop collapse toggle - floats on the sidebar's right edge */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="absolute top-16 -right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md hover:border-blue-200 hover:text-blue-600 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft
              size={16}
              className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        )}
        {/* Logo */}
        <div
          className={`flex items-center h-16 px-4 border-b border-gray-100 shrink-0 ${
            collapsed ? 'justify-center px-0' : 'gap-3'
          }`}
        >
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/60 group-hover:scale-105 group-hover:rotate-6 transition-transform duration-300">
              <span className="text-white text-base font-bold">📚</span>
            </div>
            <span
              className={`text-lg font-bold text-gray-800 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                collapsed ? 'max-w-0 opacity-0' : 'max-w-[180px] opacity-100'
              }`}
            >
              StudyPlanner
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Menu
            </p>
          )}

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`group relative flex items-center rounded-xl transition-all duration-200 ${
                    collapsed ? 'justify-center px-0' : 'px-2'
                  } ${isActive ? 'bg-blue-50/80' : 'hover:bg-gray-100'}`}
                  style={{ height: '46px' }}
                >
                  {/* Active indicator bar */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-blue-600 transition-all duration-300 ${
                      isActive && !collapsed ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* Icon */}
                  <span
                    className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-400 group-hover:bg-white group-hover:text-gray-700'
                    } ${collapsed ? 'group-hover:scale-110' : ''}`}
                  >
                    <Icon size={20} />
                  </span>

                  {/* Label */}
                  <span
                    className={`ml-1 text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                      collapsed ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100'
                    } ${isActive ? 'text-blue-700' : 'text-gray-600 group-hover:text-gray-900'}`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom - Logout */}
        <div className={`p-3 border-t border-gray-100 shrink-0 ${collapsed ? 'flex justify-center' : ''}`}>
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Account
            </p>
          )}
          <LogoutButton
            showLabel={!collapsed}
            label="Logout"
            iconSize={20}
            title={collapsed ? 'Logout' : undefined}
            className={`group flex items-center rounded-xl text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 w-full ${
              collapsed ? 'justify-center px-0' : 'px-3'
            }`}
            iconClassName="text-red-400 group-hover:text-red-500 transition-colors"
          />
        </div>

        {/* Mobile drawer close button */}
        {isMobile && (
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
