'use client'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

type GameMode = {
  id: string
  name: string
  description: string
  region: string
}

const SingleplayerPage = () => {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Define game modes with region data
  const gameModes: GameMode[] = [
    {
      id: 'world',
      name: 'World Tour',
      description: 'Random locations from around the globe',
      region: 'world'
    },
    {
      id: 'asia',
      name: 'Asian Challenge',
      description: 'Locations across Asia',
      region: 'asia'
    },
    {
      id: 'europe',
      name: 'European Explorer',
      description: 'Locations throughout Europe',
      region: 'europe'
    },
    {
      id: 'north-america',
      name: 'American Roadtrip',
      description: 'Locations in North America',
      region: 'north-america'
    },
    {
      id: 'urban',
      name: 'Urban Landscapes',
      description: 'Major cities worldwide',
      region: 'urban'
    },
  ]

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email || null)
      setLoading(false)
    }
    
    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Singleplayer Mode</h1>
        <p className="text-gray-400 mb-8">Select a region to test your geography skills</p>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Game Mode Selection */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gameModes.map((mode) => (
                <div 
                  key={mode.id}
                  className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition duration-300 cursor-pointer"
                  onClick={() => router.push(`/play/singleplayer/${mode.id}`)}
                >
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-emerald-400 mb-2">{mode.name}</h2>
                    <p className="text-gray-300 mb-4">{mode.description}</p>
                    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16" />
                      <span className="ml-4 text-sm text-gray-400">
                        {mode.region === 'world' ? '🌎' : 
                         mode.region === 'asia' ? '🗾' : 
                         mode.region === 'europe' ? '🏰' : 
                         mode.region === 'north-america' ? '🗽' : '🏙️'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* User Info Panel */}
          <div className="lg:w-1/3">
            <div className="bg-gray-900 rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6 text-emerald-400">Player Info</h2>
              
              <div className="flex items-center mb-6">
                <div className="bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <h3 className="font-semibold">Signed in as:</h3>
                  <p className="text-gray-300 break-all">{userEmail}</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold mb-3">Recent Scores</h3>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 italic">No games played yet</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold mb-3">Quick Play</h3>
                <button
                  onClick={() => router.push(`/play/singleplayer/world`)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition duration-300"
                >
                  Play Random Location
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleplayerPage