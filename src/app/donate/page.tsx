// File: src/app/donate/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { getProfile } from '@/lib/profile'
import NavBar from '@/components/web/NavBar'
import SiteFooter from '@/components/web/Footer'
import FriendsSlider from '@/components/web/FriendsSlider'

export default function DonatePage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email || null)
      if (user) {
        const profileData = await getProfile(user.id)
        setProfile(profileData)
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
      </div>
    )
  }

  return (
    <main
      className="min-h-screen text-white flex flex-col bg-fixed bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/bg2.jpg')" }}
    >
      <NavBar />
      <FriendsSlider />
      
      {/* Two-column layout */}
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center gap-8 pt-16 pb-8 px-6">
        
        {/* Left column: text */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="text-center max-w-lg">
            <p className="text-sm text-gray-300 mb-4">
              Your support will go a long way and early supporters will get pro perks when they go live. 
              All donations go directly toward server costs, map licensing, and feature development.
            </p>
            <p className="text-sm text-gray-300">
              Thank you for supporting! ❤️
            </p>
          </div>
        </div>

        {/* Right column: Ko-fi panel */}
        <div className="w-full md:w-1/2 flex justify-center">
          <iframe 
            id="kofiframe" 
            src="https://ko-fi.com/satquestgame/?hidefeed=true&widget=true&transparent=true"
            style={{ 
              border: "none", 
              width: "45%", 
              height: "560px", 
              background: "transparent",
              borderRadius: "12px",
              boxShadow: "4px 4px 12px rgba(0,0,0,0.15)"
            }}
            height="600" 
            title="satquestgame"
          ></iframe>
        </div>
      </div>
      
      <div className="px-6 pb-4 pt-2">
        <SiteFooter />
      </div>
    </main>
  )
}
