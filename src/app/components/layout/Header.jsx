'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import LogoutButton from '@/app/components/auth/LogoutButton';
import { useAuth } from '@/app/context/AuthContext';

const Header = () => {
  const { user } = useAuth();
  const [avatarError, setAvatarError] = useState(false);

  // Reset the error flag whenever the photo URL itself changes
  useEffect(() => {
    setAvatarError(false);
  }, [user?.photoURL]);

  // Generate up to two initials from user's display name
  // Or fallback to first letter in their email
  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U'; // "U" for user as last defensive fallback
  };

  // Use display name when avaiable
  // Or derive name from email
  const getUserName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  // Display greeting based on current time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Show users's profile photo when valid photo URL is available
  const showAvatarImage = Boolean(user?.photoURL) && !avatarError;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 px-6 md:px-8 py-4 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section - Welcome */}
        <div className="hidden md:block min-w-0">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {getGreeting()} <span className="hidden lg:inline">👋</span>
          </h2>
          <p className="text-xs text-gray-400 truncate">
            Welcome back, <span className="text-gray-500 font-medium">{getUserName()}</span>
          </p>
        </div>

        {/* Spacer on mobile so the greeting area doesn't crowd the avatar */}
        <div className="md:hidden" />

        {/* Right Section - Profile + Logout */}
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="group flex items-center gap-3 cursor-pointer px-2 py-1.5 rounded-2xl transition-all duration-300 hover:bg-gray-100"
            title="View profile"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-200 overflow-hidden group-hover:scale-105 group-hover:shadow-xl transition-all duration-300">
                {showAvatarImage ? (
                  <img
                    src={user.photoURL}
                    alt={getUserName()}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  getInitials()
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-800">{getUserName()}</p>
              <p className="text-xs text-gray-400">Student</p>
            </div>
          </Link>

          <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

          <LogoutButton
            showLabel={false}
            iconSize={18}
            title="Logout"
            className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
            iconClassName=""
          >
            <LogOut size={18} />
          </LogoutButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
