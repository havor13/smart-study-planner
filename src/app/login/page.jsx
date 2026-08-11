'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getFriendlyAuthError } from '@/lib/firebaseErrors';
import './login.css';

const Hero = ({ type, active, title, text, buttonText, onClick }) => (
  <div className={`hero ${type} ${active ? 'active' : ''}`}>
    <h2>{title}</h2>
    <p>{text}</p>
    <button type="button" onClick={onClick}>
      {buttonText}
    </button>
  </div>
);

const AuthForm = ({ type, active, title, children, onSubmit }) => (
  <div className={`form ${type} ${active ? 'active' : ''}`}>
    <h2>{title}</h2>
    <form onSubmit={onSubmit}>{children}</form>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const isSignup = view === 'signup';

  const toggleView = () => {
    setView(isSignup ? 'signin' : 'signup');
    setError('');
  };

  // Sync authenticared Firebase user with corresponding DB profile
  const syncUserToMongoDB = async (user, fallbackName = '') => {
    try {
      await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: user.email,
          displayName: user.displayName || fallbackName,
          photoURL: user.photoURL || '',
        }),
      });
    } catch (err) {
      console.error('Failed to sync user with MongoDB:', err);
    }
  };

  useEffect(() => {
    const urlMessage = new URLSearchParams(window.location.search).get('message');

    if (urlMessage === 'email-verification') {
      setMessage(urlMessage);
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Avoid redirecting whil current signin.signup submission is still processing
      if (user && !loading) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router, loading]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      // Complete DB sync before navigating to dashboard
      await syncUserToMongoDB(userCredential.user);

      router.push('/');
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate password before creating Firebase account
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      // Add user's display name to Firebase profile before sync
      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      // Create corresponding DB profile after Firebase registration
      await syncUserToMongoDB(userCredential.user, formData.name);

      router.push('/');
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      {message === 'email-verification' && (
        <div
          className="absolute top-6 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-center text-sm text-blue-700 shadow-md"
          role="status"
        >
          <strong className="block mb-1 font-semibold">Verification email sent.</strong>
          <p>
            Please check your inbox and your spam or junk folder. Verify your new email address
            before logging in again.
          </p>
        </div>
      )}
      <div className="login-card">
        <div
          className="card-bg"
          style={{ transform: isSignup ? 'translateX(0)' : 'translateX(100%)' }}
        />

        <Hero
          type="signup"
          active={isSignup}
          title="Welcome Back!"
          text="Sign in to track your study progress and manage tasks."
          buttonText="SIGN IN"
          onClick={toggleView}
        />

        <AuthForm type="signup" active={isSignup} title="Create Account" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'SIGN UP'}
          </button>
        </AuthForm>

        <Hero
          type="signin"
          active={!isSignup}
          title="Hey There! 👋"
          text="Start your study journey here and track your progress."
          buttonText="SIGN UP"
          onClick={toggleView}
        />

        <AuthForm type="signin" active={!isSignup} title="Sign In" onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'SIGN IN'}
          </button>
        </AuthForm>
      </div>
    </section>
  );
}
