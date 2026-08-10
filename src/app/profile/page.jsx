'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useProfile } from '@/lib/useProfile';
import ProfileCard from '@/app/components/profile/ProfileCard';
import ProfileForm from '@/app/components/profile/ProfileForm';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { profile, loading: profileLoading, updateProfile } = useProfile();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || profileLoading) {
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="bg-linear-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-xl">
            👤
          </span>
          My Profile
        </h1>
        <p className="text-gray-500 mt-1 ml-12">View and manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProfileCard user={user} profile={profile} />
        </div>
        <div className="lg:col-span-2">
          <ProfileForm user={user} profile={profile} updateProfile={updateProfile} />
        </div>
      </div>
    </div>
  );
}
