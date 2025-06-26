'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NavBar() {
  const [user, setUser] = useState<any>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
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
      {/* Logo */}
      <Image
        src="/logo_big.png"
        alt="SatQuest Logo"
        width={120}
        height={40}
      />

      {/* Navigation Tabs */}
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

      {/* User Dropdown */}
      <div className="relative">
        <button className="text-white font-medium" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {user.email}
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg text-black">
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
              Profile
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
              Settings
            </button>
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
