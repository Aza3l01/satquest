'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import SignUpForm from '@/components/web/SignUpForm'
import NavBar from '@/components/web/NavBar'
import { useRouter } from 'next/navigation'
import FriendsSlider from '@/components/web/FriendsSlider'

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
      className={`min-h-screen text-white p-6 flex flex-col items-center ${
        !loggedIn ? 'bg-cover bg-center bg-no-repeat' : 'bg-fit bg-center'
      }`}
      style={!loggedIn ? { backgroundImage: "url('/bg.png')" } : { backgroundImage: "url('/bg2.jpg')" }}
    >
      {loggedIn && <NavBar />}

      {loggedIn ? (
        <div className="text-center mt-10">
          <FriendsSlider />
          <h1 className="text-3xl font-bold mb-4">You are signed in</h1>
          <p>
            Right side premium info, left side big play button saying "Play casual games for free" or something like that
          </p>
          <button
            onClick={() => router.push('/play')}
            className="bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-2 rounded"
          >
            Go to Play
          </button>
        </div>
      ) : (
        <>
          <div className="text-center mb-10 max-w-2xl">
            <img src="/logo_big.svg" alt="SatQuest Logo" className="h-20 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mt-2">Explore From Above!</h2>
            <p className="text-md text-gray-200 mt-2">
              SatQuest is a geography guessing game that tests your ability to recognize locations from satellite images.
            </p>
          </div>
          <SignUpForm />
        </>
      )}
    </main>
  )
}
