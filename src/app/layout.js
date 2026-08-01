'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import './globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  // Keep /signup in auth pages so it renders without sidebar
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  // Determine active tab for sidebar
  const getActiveTab = () => {
    if (pathname === '/') return 'dashboard';
    if (pathname === '/profile') return 'profile';
    if (pathname.startsWith('/tasks')) return 'tasks';
    if (pathname.startsWith('/calendar')) return 'calendar';
    if (pathname.startsWith('/progress')) return 'progress';
    if (pathname.startsWith('/timer')) return 'timer';
    return 'dashboard';
  };

  if (isAuthPage) {
    return (
      <html lang="en">
        <body>
          <AuthProvider>
            {children}
          </AuthProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen">
        <AuthProvider>
          <div className="flex min-h-screen">
            <Sidebar activeTab={getActiveTab()} />
            <div className="flex-1 min-h-screen ml-72">
              <Header />
              <main className="p-6 max-w-7xl mx-auto">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}