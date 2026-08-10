'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

const LogoutButton = ({
  className = '',
  iconClassName = '',
  showLabel = true,
  label = 'Logout',
  iconSize = 20,
  title = 'Logout',
  children,
  onClick,
}) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async (e) => {
    // Prevent triggering parent container onClick handlers
    e.stopPropagation();

    if (onClick) {
      onClick(e);
    }

    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button onClick={handleLogout} className={className} title={title} type="button">
      {children ? (
        children
      ) : (
        <>
          <LogOut size={iconSize} className={iconClassName} />
          {showLabel && <span>{label}</span>}
        </>
      )}
    </button>
  );
};

export default LogoutButton;
