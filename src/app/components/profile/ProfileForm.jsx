'use client';

import { useState, useEffect } from 'react';
import { 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  verifyBeforeUpdateEmail, 
  updateProfile, 
  updatePassword 
} from 'firebase/auth';
import { 
  Edit2, 
  User, 
  CheckCircle, 
  AlertCircle, 
  ImageIcon, 
  Mail, 
  Key, 
  Shield, 
  Save, 
  X 
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { getFriendlyAuthError } from '@/lib/firebaseErrors';

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [form, setForm] = useState({
    name: '',
    email: '',
    avatar: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Populate form with current Firebase user data on mount
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || '',
        avatar: user.photoURL || '',
      }));
    }
  }, []);

  const resetForm = () => {
    const user = auth.currentUser;
    if (user) {
      setForm({
        name: user.displayName || '',
        email: user.email || '',
        avatar: user.photoURL || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  const syncUserToMongoDB = async (user, overrideName, overrideAvatar) => {
    try {
      await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: user.email,
          displayName: overrideName ?? user.displayName,
          photoURL: overrideAvatar ?? user.photoURL,
        }),
      });
    } catch (err) {
      console.error('Failed to sync user with MongoDB:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSaving(true);

    const user = auth.currentUser;
    if (!user) {
      setMessage({ type: 'error', text: 'No authenticated user found.' });
      setSaving(false);
      return;
    }

    const isEmailChanging = form.email.trim().toLowerCase() !== user.email?.toLowerCase();
    const isPasswordChanging = Boolean(form.newPassword);
    const isProfileChanging = 
      form.name !== (user.displayName || '') || 
      form.avatar !== (user.photoURL || '');

    // Password confirmation checks
    if (isPasswordChanging && form.newPassword !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      setSaving(false);
      return;
    }

    if ((isEmailChanging || isPasswordChanging) && !form.currentPassword) {
      setMessage({
        type: 'error',
        text: 'Please enter your current password to authorize email or password changes.',
      });
      setSaving(false);
      return;
    }

    try {
      // Re-authenticate user if updating email or password
      if (isEmailChanging || isPasswordChanging) {
        const credential = EmailAuthProvider.credential(user.email, form.currentPassword);
        await reauthenticateWithCredential(user, credential);
      }

      // Update Name & Photo in Firebase Profile
      if (isProfileChanging) {
        await updateProfile(user, {
          displayName: form.name,
          photoURL: form.avatar,
        });
        await syncUserToMongoDB(user, form.name, form.avatar);
      }

      // Update Password if specified
      if (isPasswordChanging) {
        await updatePassword(user, form.newPassword);
      }

      // Trigger Email Verification for new address
      if (isEmailChanging) {
        // TODO: Requires testing in production version 
        const actionCodeSettings = {
          url: `${window.location.origin}/login?emailVerified=true`,
          handleCodeInApp: true,
        };

        await verifyBeforeUpdateEmail(user, form.email, actionCodeSettings);
        setMessage({
          type: 'success',
          text: `Verification link sent to ${form.email}! Please check your inbox (and spam/junk folder) to complete your email update.`,
        });
      } else if (isProfileChanging || isPasswordChanging) {
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        setMessage({ type: 'success', text: 'No changes were detected.' });
      }

      // Reset sensitive fields and turn off editing mode on success
      setForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setIsEditing(false);
      setShowPasswordFields(false);
    } catch (err) {
      setMessage({ type: 'error', text: getFriendlyAuthError(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/60">
      <div className="px-8 py-6 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              {isEditing ? (
                <Edit2 size={18} className="text-blue-600" />
              ) : (
                <User size={18} className="text-blue-600" />
              )}
              {isEditing ? 'Edit Profile' : 'Profile Information'}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing ? 'Update your personal information' : 'Your account details'}
            </p>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 text-sm hover:scale-[1.02] active:scale-95"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="p-8">
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
            role={message.type === 'success' ? 'status' : 'alert'}
          >
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview & URL */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
              {form.avatar && !avatarError ? (
                <img
                  src={form.avatar}
                  alt="Avatar"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <User size={24} className="text-gray-400" />
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <ImageIcon size={14} className="inline mr-1 text-blue-500" />
                Avatar URL
              </label>
              <input
                type="url"
                value={form.avatar}
                onChange={(e) => {
                  setForm({ ...form, avatar: e.target.value });
                  setAvatarError(false);
                }}
                disabled={!isEditing}
                placeholder="https://example.com/avatar.jpg"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
                  isEditing
                    ? 'border-gray-300 bg-white hover:border-blue-300'
                    : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                }`}
              />
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <User size={14} className="inline mr-1 text-blue-500" />
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={!isEditing}
              placeholder="Your name"
              className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                isEditing
                  ? 'border-gray-300 bg-white hover:border-blue-300'
                  : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Mail size={14} className="inline mr-1 text-blue-500" />
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={!isEditing}
              placeholder="your@email.com"
              className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                isEditing
                  ? 'border-gray-300 bg-white hover:border-blue-300'
                  : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Current Password Field (Always visible during edit mode to confirm security changes) */}
          {isEditing && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <label className="block text-sm font-semibold text-amber-900">
                <Shield size={16} className="inline mr-1 text-amber-600" />
                Current Password Required
              </label>
              <p className="text-xs text-amber-700">
                Enter your password to verify your identity when changing your email address or password.
              </p>
              <input
                type="password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                placeholder="Enter current password"
                className="w-full px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm"
              />
            </div>
          )}

          {/* Optional Password Settings Toggle */}
          {isEditing && (
            <button
              type="button"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              <Key size={16} />
              {showPasswordFields ? 'Hide password fields' : 'Change account password'}
            </button>
          )}

          {isEditing && showPasswordFields && (
            <div className="space-y-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-blue-500" />
                <h4 className="text-sm font-semibold text-gray-700">New Password</h4>
                <span className="text-xs text-gray-400 ml-2">(Optional)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={form.newPassword}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-blue-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-95"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setShowPasswordFields(false);
                  resetForm();
                  setMessage({ type: '', text: '' });
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}