'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import './globals.css';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login';

  if (isAuthPage) {
    return (
      <html lang="en">
        <body>
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen">
        <AuthProvider>
          <ProtectedRoute>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 min-h-screen transition-all duration-300">
                <Header />
                <main className="p-6 max-w-7xl mx-auto">{children}</main>
              </div>
            </div>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
