'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Award,
  Calendar,
  Clock,
  TrendingUp,
  Edit2,
  UserCircle,
  X,
  Key,
  Shield
} from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        displayName: user.displayName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const updates = [];

      if (formData.displayName !== user.displayName) {
        updates.push(
          updateProfile(user, { displayName: formData.displayName })
        );
      }

      if (formData.email !== user.email && formData.currentPassword) {
        const credential = EmailAuthProvider.credential(
          user.email,
          formData.currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        updates.push(updateEmail(user, formData.email));
      }

      if (formData.newPassword && formData.currentPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage({ type: 'error', text: 'New passwords do not match' });
          setSaving(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
          setSaving(false);
          return;
        }
        const credential = EmailAuthProvider.credential(
          user.email,
          formData.currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        updates.push(updatePassword(user, formData.newPassword));
      }

      await Promise.all(updates);

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setShowPasswordFields(false);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Update error:', error);
      if (error.code === 'auth/wrong-password') {
        setMessage({ type: 'error', text: 'Current password is incorrect' });
      } else if (error.code === 'auth/email-already-in-use') {
        setMessage({ type: 'error', text: 'Email is already in use' });
      } else if (error.code === 'auth/requires-recent-login') {
        setMessage({ type: 'error', text: 'Please reauthenticate to update this field' });
      } else {
        setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
      }
    } finally {
      setSaving(false);
    }
  };

  const memberSince = new Date(user?.metadata?.creationTime || Date.now());
  const formattedDate = memberSince.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  if (loading) {
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
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="bg-linear-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-xl">👤</span>
          My Profile
        </h1>
        <p className="text-gray-500 mt-1 ml-12">View and manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
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
                <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl text-blue-600">
                  <UserCircle size={48} className="text-blue-500" />
                </div>
                
                <div className="text-center mt-3">
                  <h2 className="text-xl font-bold text-gray-800">
                    {user.displayName || 'User'}
                  </h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  
                  <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-400">
                    <Calendar size={14} />
                    <span>Member since {formattedDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600">
                    <Award size={16} />
                    <span className="text-sm font-semibold">12</span>
                  </div>
                  <p className="text-xs text-gray-400">Tasks Done</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <TrendingUp size={16} />
                    <span className="text-sm font-semibold">87%</span>
                  </div>
                  <p className="text-xs text-gray-400">Completion</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-600">
                    <Clock size={16} />
                    <span className="text-sm font-semibold">4</span>
                  </div>
                  <p className="text-xs text-gray-400">Active Tasks</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Form Header */}
            <div className="px-8 py-6 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Edit2 size={18} className="text-blue-600" />
                        Edit Profile
                      </>
                    ) : (
                      <>
                        <User size={18} className="text-blue-600" />
                        Profile Information
                      </>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {isEditing ? 'Update your personal information' : 'Your account details'}
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 text-sm"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="p-8">
              {message.text && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <User size={14} className="inline mr-1 text-blue-500" />
                    Display Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        isEditing 
                          ? 'border-gray-300 bg-white hover:border-blue-300' 
                          : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                      }`}
                      placeholder="Your name"
                      disabled={!isEditing}
                    />
                    {isEditing && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        Required
                      </span>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Mail size={14} className="inline mr-1 text-blue-500" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        isEditing 
                          ? 'border-gray-300 bg-white hover:border-blue-300' 
                          : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                      }`}
                      placeholder="your@email.com"
                      disabled={!isEditing}
                    />
                    {isEditing && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        Required
                      </span>
                    )}
                  </div>
                </div>

                {/* Change Password Toggle */}
                {isEditing && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswordFields(!showPasswordFields)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                      <Key size={16} />
                      {showPasswordFields ? 'Hide password fields' : 'Change password'}
                    </button>
                  </div>
                )}

                {/* Password Fields */}
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
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-blue-300"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-blue-300"
                          placeholder="Min 6 characters"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-blue-300"
                          placeholder="Confirm new password"
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
                      className="flex-1 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Save size={18} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setShowPasswordFields(false);
                        setFormData({
                          ...formData,
                          displayName: user.displayName || '',
                          email: user.email || '',
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                        setMessage({ type: '', text: '' });
                      }}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}