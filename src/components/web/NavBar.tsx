'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getProfile } from '@/lib/profile'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export default function NavBar() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      if (data.user) {
        const profileData = await getProfile(data.user.id)
        setProfile(profileData)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/signin')
  }

  const getTabClass = (path: string) =>
    `relative px-4 py-2 rounded-lg transition text-white
     before:absolute before:inset-0 before:rounded-full before:blur-lg 
     ${
       pathname === path
         ? 'before:bg-emerald-700/30'
         : 'before:bg-transparent hover:before:bg-emerald-700/30'
     }`

  if (!user) return null

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/30 backdrop-blur-lg shadow-md px-6 py-2 flex items-center h-12 z-50">
      <div className="flex items-center space-x-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo_big.svg"
            alt="SatQuest Logo"
            width={120}
            height={40}
          />
        </Link>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-700 mx-3" />

        <Link href="/play" className={`${getTabClass('/play')} font-bold text-lg`}>
          Play
        </Link>
        {/* <Link href="/leaderboard" className={getTabClass('/leaderboard')}>
          Leaderboards
        </Link>
        <Link href="/premium" className={getTabClass('/premium')}>
          Premium
        </Link>
        <Link href="/shop" className={getTabClass('/shop')}>
          Shop
        </Link> */}
      </div>

      <div className="ml-auto relative flex items-center">
        <div className="h-6 w-px bg-gray-700 mr-4" />

        <button 
          className="text-white font-medium flex items-center" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full mr-2 object-cover"
            />
          ) : (
            <div className="bg-emerald-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">
              <span className="font-bold">
                {profile?.display_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}

          <span className="max-w-[120px] truncate flex items-center gap-1">
            {profile?.display_name || user.email?.split('@')[0]}
            <ChevronDownIcon className="w-4 h-4 text-white opacity-70" />
          </span>
        </button>
      </div>

      {dropdownOpen && (
        <div className="fixed right-6 top-16 w-48 bg-black/30 backdrop-blur-sm shadow-md rounded-lg text-white z-[9999]">
          <Link
            href="/profile"
            className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded-lg"
            onClick={() => setDropdownOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/settings"
            className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded-lg"
            onClick={() => setDropdownOpen(false)}
          >
            Settings
          </Link>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded-lg"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  )
}
