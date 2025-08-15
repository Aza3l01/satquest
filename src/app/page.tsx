'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import SignUpForm from '@/components/web/SignUpForm'
import NavBar from '@/components/web/NavBar'
import { useRouter } from 'next/navigation'
import FriendsSlider from '@/components/web/FriendsSlider'
import SiteFooter from '@/components/web/Footer'
import { MapPinIcon } from '@heroicons/react/24/solid'

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setLoggedIn(!!data.session)
    }
    checkSession()
  }, [])

  if (loggedIn === null) return null

  return (
    <main
      className={`min-h-screen text-white px-6 py-4 flex flex-col ${
        !loggedIn ? 'bg-fixed bg-center bg-no-repeat bg-cover' : 'bg-fit bg-center'
      }`}
      style={!loggedIn ? { backgroundImage: "url('/bg.png')" } : { backgroundImage: "url('/bg2.jpg')" }}
    >
      {loggedIn && <NavBar />}

      <div className="flex-grow w-full flex flex-col justify-center">
        {loggedIn ? (
          <>
            <FriendsSlider />
            <div className="flex flex-col md:flex-row justify-between items-center h-full px-4 mt-10 gap-12">
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-2xl font-normal text-center mb-4">Change Logs</h2>
                <div className="text-justify text-white/90 text-sm space-y-2 max-w-md mx-auto">
                  <p>
                    Welcome! SatQuest is very early in its development, so most features are under development.
                    Feel free to play around with singleplayer for now. More modes like multiplayer will be added in the future.
                    Please report bugs on Discord or through any of the social links found in the footer. If you would like to
                    support me, feel free to donate on Ko-fi. Donors will be given pro features when they go live! :)
                  </p>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <MapPinIcon className="w-10 h-10 text-emerald-500 mb-4" />
                <h2 className="text-3xl font-extrabold mb-4 drop-shadow-lg leading-tight">
                  Start Playing<br />Games Now!
                </h2>
                <button
                  onClick={() => router.push('/play')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold px-8 py-3 rounded-xl transition-all duration-300"
                >
                  Play
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col justify-center items-center text-center px-6">
            <div className="mb-10 max-w-2xl mx-auto">
              <img src="/logo_big.svg" alt="SatQuest Logo" className="h-20 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mt-2">Explore From Above!</h2>
              <p className="text-md text-gray-200 mt-2">
                SatQuest is a geography guessing game that tests your ability to recognize locations from satellite images.
              </p>
            </div>
            
            <SignUpForm />

            <div className="mt-8">
              <button
                onClick={() => router.push('/play/classic/world?difficulty=easy&guest=true')}
                className="px-6 py-2 border border-white/50 hover:bg-white/10 text-white rounded-lg font-bold transition"
              >
                Try Without Signing Up
              </button>
              <p className="text-xs text-gray-400 mt-2">
                This is a demo of Classic World on Easy difficulty. Sign up to save your progress and play other types, modes and difficulties.
              </p>
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  )
}