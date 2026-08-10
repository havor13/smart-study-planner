'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    if (!user) return;

    let ignore = false;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        if (!ignore) setProfile(data.profile);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      ignore = true;
    };
  }, [user, refetchIndex]);

  const updateProfile = useCallback(
    async (updates) => {
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      setProfile(data.profile);
      return data.profile;
    },
    [user],
  );

  const refetch = useCallback(() => {
    setRefetchIndex((i) => i + 1);
  }, []);

  return { profile, loading, error, updateProfile, refetch };
}
