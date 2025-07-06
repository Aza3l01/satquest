'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { updateProfile, getProfile, getProfileByDisplayName } from '@/lib/profile';
import { useRouter } from 'next/navigation';

export default function ProfileSettings() {
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }

      const profile = await getProfile(user.id);
      if (profile) {
        setDisplayName(profile.display_name);
        setAvatarUrl(profile.avatar_url || '');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(displayName)) {
      setError('Display name must be 3-20 characters, letters, numbers, - or _');
      return;
    }

    // Check if display name is available
    const existingProfile = await getProfileByDisplayName(displayName);
    if (existingProfile && existingProfile.id !== user.id) {
      setError('Display name is already taken');
      return;
    }

    const updates: { display_name: string; avatar_url?: string } = {
      display_name: displayName,
    };
    
    if (avatarUrl) {
      updates.avatar_url = avatarUrl;
    }

    const { error: updateError } = await updateProfile(user.id, updates);

    if (updateError) {
      setError('Failed to update profile');
    } else {
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-900 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-emerald-400">Profile Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:border-emerald-500 focus:outline-none"
            placeholder="Enter display name"
          />
          <p className="text-sm text-gray-500 mt-1">
            No spaces allowed. Letters, numbers, - and _ only.
          </p>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Avatar URL</label>
          <input
            type="text"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:border-emerald-500 focus:outline-none"
            placeholder="Enter avatar URL"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave blank for default avatar
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-lg">
            {success}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition duration-300"
          disabled={loading}
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}