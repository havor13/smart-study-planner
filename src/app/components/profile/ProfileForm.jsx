'use client';

import { useState } from 'react';
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import {
  User,
  Mail,
  Save,
  AlertCircle,
  CheckCircle,
  Edit2,
  X,
  Key,
  Shield,
  Image as ImageIcon,
} from 'lucide-react';
import { getFriendlyAuthError } from '@/lib/firebaseErrors';

export default function ProfileForm({ user, profile, updateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const [form, setForm] = useState({
    name: profile?.name || user?.displayName || '',
    email: profile?.email || user?.email || '',
    avatar: profile?.avatar || user?.photoURL || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const resetForm = () => {
    setForm({
      name: profile?.name || user?.displayName || '',
      email: profile?.email || user?.email || '',
      avatar: profile?.avatar || user?.photoURL || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setAvatarError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Update MongoDB profile details (name and avatar)
      const hasNameChanged = form.name !== profile?.name;
      const hasAvatarChanged = form.avatar !== profile?.avatar;

      if (hasNameChanged || hasAvatarChanged) {
        await updateProfile({
          name: form.name.trim(),
          avatar: form.avatar.trim(),
        });
      }

      // 2. Email / password update in Firebase Auth
      const wantsEmailChange = form.email !== user?.email;
      const wantsPasswordChange = Boolean(form.newPassword);

      if ((wantsEmailChange || wantsPasswordChange) && form.currentPassword) {
        const credential = EmailAuthProvider.credential(user.email, form.currentPassword);
        await reauthenticateWithCredential(user, credential);

        if (wantsEmailChange) {
          await updateEmail(user, form.email.trim());
        }

        if (wantsPasswordChange) {
          if (form.newPassword !== form.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            setSaving(false);
            return;
          }
          if (form.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            setSaving(false);
            return;
          }
          await updatePassword(user, form.newPassword);
        }
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setShowPasswordFields(false);
      resetForm();
    } catch (error) {
      console.error('Update error:', error);
      setMessage({
        type: 'error',
        text: getFriendlyAuthError(error),
      });
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

          {/* Password Settings */}
          {isEditing && (
            <button
              type="button"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              <Key size={16} />
              {showPasswordFields ? 'Hide password fields' : 'Change password'}
            </button>
          )}

          {isEditing && showPasswordFields && (
            <div className="space-y-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-blue-500" />
                <h4 className="text-sm font-semibold text-gray-700">Change Password</h4>
                <span className="text-xs text-gray-400 ml-2">(Optional)</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-blue-300"
                />
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
