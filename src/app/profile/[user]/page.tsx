'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { getProfile } from '@/lib/profile'
import { useParams } from 'next/navigation'
import NavBar from '@/components/web/NavBar'
import FriendsSlider from '@/components/web/FriendsSlider'
import SiteFooter from '@/components/web/Footer'

interface ClassicGame {
  id: string
  mode: string
  difficulty: string
  score: number
  avg_accuracy: number
  played_at: string
}

const profileTabs = [
  { id: 'classic', label: 'Classic' },
  { id: 'casual', label: 'Casual' },
  { id: 'ranked', label: 'Ranked' },
  { id: 'elimination', label: 'Elimination' },
  { id: 'party', label: 'Party' },
]

export default function PublicProfilePage() {
  const { user: userId } = useParams<{ user: string }>()
  const [profile, setProfile] = useState<any>(null)
  const [games, setGames] = useState<ClassicGame[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('classic')

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || typeof userId !== 'string') {
        setLoading(false)
        return
      }

      const profileData = await getProfile(userId)
      setProfile(profileData)

      const { data: gameData, error } = await supabase
        .from('classic_games')
        .select('*')
        .eq('user_id', userId)
        .order('played_at', { ascending: false })
        .limit(20)

      if (error) console.error('Error loading games:', error)
      else setGames(gameData || [])

      setLoading(false)
    }

    fetchData()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }
  
  if (!profile) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-black text-white">
        User not found.
      </div>
    )
  }

  const totalGames = games.length
  const highScore = Math.max(...games.map((g) => g.score), 0)
  const bestAccuracy = Math.max(...games.map((g) => g.avg_accuracy), 0)

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundImage: "url('/bg2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
    >
      <NavBar />
      <FriendsSlider />

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <div className="flex-shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-emerald-500"
              />
            ) : (
              <div className="bg-emerald-600 rounded-full w-32 h-32 flex items-center justify-center border-4 border-emerald-500">
                <span className="text-4xl font-bold flex">
                  {profile?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center pt-4">
            <h1 className="text-3xl font-bold">{profile?.display_name}</h1>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 border-b border-gray-700 mb-4">
            {profileTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 font-semibold ${
                  activeTab === tab.id ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Stats</h2>
          {activeTab === 'classic' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/10 p-4 rounded-lg text-center">
                <h3 className="text-gray-400 text-sm mb-1">Games Played</h3>
                <p className="text-2xl font-bold">{totalGames}</p>
              </div>
              <div className="bg-black/10 p-4 rounded-lg text-center">
                <h3 className="text-gray-400 text-sm mb-1">High Score</h3>
                <p className="text-2xl font-bold">{highScore}</p>
              </div>
              <div className="bg-black/10 p-4 rounded-lg text-center">
                <h3 className="text-gray-400 text-sm mb-1">Best Accuracy</h3>
                <p className="text-2xl font-bold">{bestAccuracy.toFixed(2)}%</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">In development</div>
          )}
        </div>

        <div className="bg-black/10 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Recent Games</h2>
          {activeTab === 'classic' ? (
            games.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No games played yet</p>
            ) : (
              <div className="w-full overflow-x-auto">
                <div className="grid grid-cols-5 text-sm text-gray-400 font-medium border-b border-gray-800 pb-2 mb-2">
                  <div>Mode</div>
                  <div>Difficulty</div>
                  <div className="text-center">Accuracy</div>
                  <div className="text-center">Score</div>
                  <div className="text-right">Date Played</div>
                </div>
                <div className="space-y-2">
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className="grid grid-cols-5 text-sm items-center text-gray-300 border-b border-gray-800 pb-2"
                    >
                      <div className="text-gray-300">
                        {game.mode === 'world' ? 'World' : game.mode.toUpperCase()}
                      </div>
                      <div className="text-gray-300 capitalize">{game.difficulty}</div>
                      <div className="text-center text-emerald-400 font-bold">
                        {game.avg_accuracy.toFixed(2)}%
                      </div>
                      <div className="text-center font-semibold">{game.score} pts</div>
                      <div className="text-right text-gray-400">
                        {new Date(game.played_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <p className="text-center text-gray-500 py-8">In development</p>
          )}
        </div>
      </div>
      <div className="px-6 pb-4 pt-2">
        <SiteFooter />
      </div>
    </div>
  )
}