'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import './globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  const getActiveTab = () => {
    const path = pathname || '/';
    if (path === '/') return 'dashboard';
    if (path.startsWith('/tasks')) return 'tasks';
    if (path.startsWith('/calendar')) return 'calendar';
    if (path.startsWith('/progress')) return 'progress';
    if (path.startsWith('/timer')) return 'timer';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar activeTab={activeTab} />
          <div className="flex-1 min-h-screen ml-64">
            <Header />
            <main className="p-6 max-w-7xl mx-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}