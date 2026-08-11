'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // To force dependent components to re-render after refreshing current Firebase user's data
  const [, forceRerender] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        setUser(auth.currentUser);
        setLoggingOut(false); // clear once a real session exists again
        fetch('/api/users/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firebaseUid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
          }),
        }).catch((err) => console.error('Auto-sync failed:', err));
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Refresh current Firebase uer's data after procfile/account change
  // Components can immediately reflect updates
  const refreshUser = async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    setUser(auth.currentUser);
    forceRerender((n) => n + 1);
  };

  const logout = async () => {
    setLoggingOut(true);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser, loggingOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
