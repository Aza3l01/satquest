'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getProfile } from '@/lib/profile'

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
         ? 'before:bg-blue-700/30'
         : 'before:bg-transparent hover:before:bg-blue-700/30'
     }`

  if (!user) return null

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/30 backdrop-blur-lg shadow-md px-6 py-2 flex justify-between items-center h-14 z-50">
      <Image
        src="/logo_big.png"
        alt="SatQuest Logo"
        width={120}
        height={40}
      />

      <div className="flex items-center space-x-6">
        <Link href="/friends" className={getTabClass('/friends')}>
          Friends
        </Link>
        <Link href="/leaderboards" className={getTabClass('/leaderboards')}>
          Leaderboards
        </Link>
        <Link href="/play" className={`${getTabClass('/play')} font-bold text-lg`}>
          Play
        </Link>
        <Link href="/premium" className={getTabClass('/premium')}>
          Premium
        </Link>
        <Link href="/shop" className={getTabClass('/shop')}>
          Shop
        </Link>
      </div>

      <div className="relative">
        <button 
          className="text-white font-medium flex items-center" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {/* Avatar with fallback */}
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
          
          {/* Display name or email prefix */}
          <span className="max-w-[120px] truncate">
            {profile?.display_name || user.email?.split('@')[0]}
          </span>
        </button>
        
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg text-black z-50">
            <Link href="/profile" 
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setDropdownOpen(false)}
            >
              Profile
            </Link>
            <Link href="/settings" 
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setDropdownOpen(false)}
            >
              Settings
            </Link>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}