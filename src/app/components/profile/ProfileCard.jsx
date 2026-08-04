'use client';

import { useState, useEffect } from 'react';
import { UserCircle, Calendar } from 'lucide-react';

export default function ProfileCard({ user, profile }) {
  const [avatarError, setAvatarError] = useState(false);

  // Reset the broken-image fallback whenever the avatar URL itself changes
  useEffect(() => {
    setAvatarError(false);
  }, [profile?.avatar]);

  const memberSince = new Date(
    profile?.createdAt || user?.metadata?.creationTime || Date.now()
  );
  const formattedDate = memberSince.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const avatar = profile?.avatar || user?.photoURL || '';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
      <div className="h-32 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white"></div>
          <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full bg-white"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white"></div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col items-center -mt-8">
          <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
            {avatar && !avatarError ? (
              <img
                src={avatar}
                alt="Avatar"
                width={80}
                height={80}
                className="w-20 h-20 object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <UserCircle size={48} className="text-blue-500" />
            )}
          </div>

          <div className="text-center mt-3">
            <h2 className="text-xl font-bold text-gray-800">
              {profile?.name || user?.displayName || 'User'}
            </h2>
            <p className="text-sm text-gray-500">{profile?.email || user?.email}</p>

            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-400">
              <Calendar size={14} />
              <span>Member since {formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}