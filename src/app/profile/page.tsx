'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getProfile } from '@/lib/profile';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace('/signin');
        return;
      }

      setUser(data.user);
      const profileData = await getProfile(data.user.id);
      setProfile(profileData);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="w-40 h-40 rounded-full object-cover border-4 border-emerald-500"
              />
            ) : (
              <div className="bg-emerald-600 rounded-full w-40 h-40 flex items-center justify-center border-4 border-emerald-500">
                <span className="text-5xl font-bold">
                  {profile?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <h1 className="text-3xl font-bold mb-2">{profile?.display_name}</h1>
            <p className="text-gray-400 mb-6">{user.email}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-1">Games Played</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-1">High Score</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-1">Avg. Accuracy</h3>
                <p className="text-2xl font-bold">0%</p>
              </div>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-emerald-400">Recent Games</h2>
              <p className="text-gray-400 text-center py-8">No games played yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}