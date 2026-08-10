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
  const [prevPathname, setPrevPathname] = useState(pathname);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, href: '/tasks' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/calendar' },
    { id: 'progress', label: 'Progress', icon: BarChart3, href: '/progress' },
    { id: 'timer', label: 'Timer', icon: Timer, href: '/timer' },
  ];

  const accountItems = [
    { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
  ];

  // Only used to keep the collapsed (icon-only) look off mobile screens.
  // The drawer itself is positioned with pure CSS below, so it never
  // reserves layout width on mobile regardless of JS state.
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-close the drawer when navigating on mobile.
  // Adjusted during render (not in an effect) to avoid an extra
  // commit/render pass on every navigation.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Close the drawer on Escape and lock body scroll while it is open
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const collapsed = !isMobile && isCollapsed;

  const renderNavLink = (item) => {
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
            collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100'
          } ${isActive ? 'text-blue-700' : 'text-gray-600 group-hover:text-gray-900'}`}
        >
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay - always mounted so its fade transition can play */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile toggle button (only when the drawer is closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 md:hidden"
          aria-label="Open sidebar"
          aria-expanded={isOpen}
          aria-controls="app-sidebar"
        >
          <Menu size={22} />
        </button>
      )}

      {/*
        The aside is `fixed` on mobile and only becomes `sticky` (reserving
        width) at the md breakpoint via CSS. This guarantees the drawer always
        OVERLAPS the content on small screens — it can never push it aside.
      */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-65 bg-white border-r border-gray-100 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:sticky md:top-0 md:h-screen md:bottom-auto
          md:transition-[width] md:duration-300 md:ease-in-out ${
            collapsed ? 'md:w-19' : 'md:w-62.5'
          }`}
      >
        {/* Desktop collapse toggle - floats on the sidebar's right edge */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex absolute top-16 -right-3 z-10 h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md hover:border-blue-200 hover:text-blue-600 transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft
            size={16}
            className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>

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
                collapsed ? 'max-w-0 opacity-0' : 'max-w-45 opacity-100'
              }`}
            >
              StudyPlanner
            </span>
          </Link>
        </div>

        {/* Navigation - MENU section */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Menu
            </p>
          )}

          <div className="space-y-1">
            {menuItems.map(renderNavLink)}
          </div>
        </nav>

        {/* Bottom - ACCOUNT section (Profile + Logout) */}
        <div
          className={`p-3 border-t border-gray-100 shrink-0 ${
            collapsed ? 'flex flex-col items-center gap-1' : ''
          }`}
        >
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Account
            </p>
          )}

          <div className={`space-y-1 ${collapsed ? 'w-full flex flex-col items-center' : ''}`}>
            {accountItems.map(renderNavLink)}
          </div>

          <div className="mt-1">
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
        </div>

        {/* Mobile drawer close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </aside>
    </>
  );
};

export default Sidebar;