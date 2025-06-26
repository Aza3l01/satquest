'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import SignUpForm from '@/components/web/SignUpForm'
import NavBar from '@/components/web/NavBar'
import { useRouter } from 'next/navigation'

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
    <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      {loggedIn && <NavBar />}

      {loggedIn ? (
        <div className="text-center mt-10">
          <h1 className="text-3xl font-bold mb-4">You are signed in</h1>
          <p>Right side premium info left side big play button saying play casual games for free or something like that</p>
          <button
            onClick={() => router.push('/play')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded"
          >
            Go to Play
          </button>
        </div>
      ) : (
        <>
          {/* Guest view with marketing and SignUpForm */}
          <div className="text-center mb-10 max-w-2xl">
            <h1 className="text-5xl font-extrabold font-mono text-emerald-300 drop-shadow-md">SatQuest</h1>
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
