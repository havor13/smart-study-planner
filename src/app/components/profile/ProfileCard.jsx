'use client';

import { useState, useEffect } from 'react';
import { UserCircle, Calendar, GraduationCap, Mail } from 'lucide-react';

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
  const displayName = profile?.name || user?.displayName || 'User';
  const email = profile?.email || user?.email;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/80">
      {/* Banner */}
      <div className="h-28 bg-linear-to-br from-blue-500 to-indigo-600 relative">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white"></div>
          <div className="absolute -bottom-12 right-4 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute top-4 right-1/3 w-16 h-16 rounded-full bg-white/70"></div>
        </div>
        <div className="absolute bottom-3 right-4 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1.5">
          <GraduationCap size={12} />
          Student
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col items-center -mt-10">
          {/* Avatar with gradient ring.
              The photo renders on its own white layer with a higher stacking
              order so the gradient never covers it; the no-photo fallback is
              a WHITE icon so it doesn't blend with the blue gradient. */}
          <div className="relative z-10 p-1.5 rounded-3xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200/60">
            {avatar && !avatarError ? (
              <div className="w-20 h-20 rounded-2xl bg-white overflow-hidden">
                <img
                  src={avatar}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover relative z-10"
                  onError={() => setAvatarError(true)}
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <UserCircle size={44} className="text-white/95" />
              </div>
            )}
          </div>

          <div className="text-center mt-3 w-full">
            <h2 className="text-xl font-bold text-gray-800">{displayName}</h2>
            {email && (
              <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5 mt-1 truncate">
                <Mail size={13} className="text-gray-400 shrink-0" />
                <span className="truncate">{email}</span>
              </p>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-400">
              <Calendar size={14} className="text-blue-400" />
              <span>Member since {formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
