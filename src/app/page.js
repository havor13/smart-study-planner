'use client';

import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import Dashboard from '@/app/components/dashboard/Dashboard';

export default function Home() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}