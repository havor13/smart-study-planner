'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import './login.css';

const SSOButtons = () => (
  <div className="sso">
    <a className="sso-btn">f</a>
    <a className="sso-btn">🐦</a>
    <a className="sso-btn">in</a>
  </div>
);

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
    <SSOButtons />
    <p className="or-text">Or use your email address</p>
    <form onSubmit={onSubmit}>{children}</form>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const isSignup = view === 'signup';
  const toggleView = () => setView(isSignup ? 'signin' : 'signup');

  // Redirect if already logged in - REMOVED the /signup redirect
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) router.push('/');
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      const syncResponse = await fetch('api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: userCredential.user.uid,
          email: userCredential.user.email,
          dsiplayName: formData.name,
          photoURL: userCredential.user.photoURL,
        }),
      });

      const syncData = await syncResponse.json();

      if (!syncResponse.ok) {
        throw new Error(syncData.message || 'Failed to sync user.');
      }

      router.replace('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
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

        <AuthForm 
          type="signup" 
          active={isSignup} 
          title="Create Account"
          onSubmit={handleSignUp}
        >
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
          {error && <div className="error-message">{error}</div>}
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

        <AuthForm 
          type="signin" 
          active={!isSignup} 
          title="Sign In"
          onSubmit={handleSignIn}
        >
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <a className="forgot-link">Forgot password?</a>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'SIGN IN'}
          </button>
        </AuthForm>
      </div>
    </section>
  );
}