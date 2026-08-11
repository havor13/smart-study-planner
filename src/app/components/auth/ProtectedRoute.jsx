'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading, loggingOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect unauthenticated users after complete initial auth check
    if (!loading && !user && !loggingOut) {
      router.replace('/login');
    }
  }, [user, loading, loggingOut, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return children;
}
