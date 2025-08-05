'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { getProfile } from '@/lib/profile'
import { useRouter } from 'next/navigation'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import NavBar from '@/components/web/NavBar'
import FriendsSlider from '@/components/web/FriendsSlider'
import SiteFooter from '@/components/web/Footer'

interface SingleplayerGame {
  id: string
  mode: string
  difficulty: string
  score: number
  avg_accuracy: number
  played_at: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [games, setGames] = useState<SingleplayerGame[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'singleplayer' | 'multiplayer' | 'tournament'>('singleplayer')
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.replace('/signin')
        return
      }

      setUser(data.user)
      const profileData = await getProfile(data.user.id)
      setProfile(profileData)

      const { data: gameData, error } = await supabase
        .from('singleplayer_games')
        .select('*')
        .eq('user_id', data.user.id)
        .order('played_at', { ascending: false })
        .limit(20)

      if (error) console.error('Error loading games:', error)
      else setGames(gameData || [])

      setLoading(false)
    }

    fetchData()
  }, [router])

  const handleCopy = () => {
    if (!user?.id) return
    navigator.clipboard.writeText(user.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  const totalGames = games.length
  const highScore = Math.max(...games.map((g) => g.score), 0)
  const bestAccuracy = Math.max(...games.map((g) => g.avg_accuracy), 0)

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundImage: "url('/bg2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <NavBar />
      <FriendsSlider />

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-8">
        {/* Header */}
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
                <span className="text-4xl font-bold">
                  {profile?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>

          <div className="flex-grow">
            <h1 className="text-3xl font-bold mb-1">{profile?.display_name}</h1>
            <p className="text-gray-400 mb-4">{user.email}</p>

            <p className="text-gray-400 mb-1">Friend Code</p>
            <div className="relative bg-black/10 rounded-lg p-3 pr-12 border border-gray-700 text-sm font-mono text-gray-300">
              {user.id}
              <button
                onClick={handleCopy}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white"
                title="Copy"
              >
                <ClipboardDocumentIcon className="h-5 w-5" />
              </button>
              {copied && (
                <span className="absolute -bottom-6 left-0 text-green-400 text-xs mt-1">
                  Copied!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-4 border-b border-gray-700 mb-4">
            {['singleplayer', 'multiplayer', 'tournament'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-2 px-4 font-semibold capitalize ${
                  activeTab === tab ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Stats</h2>
          {activeTab === 'singleplayer' ? (
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

        {/* Recent Games */}
        <div className="bg-black/10 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Recent Games</h2>
          {activeTab === 'singleplayer' ? (
            games.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No games played yet</p>
            ) : (
              <div className="overflow-x-auto">
                <div className="grid grid-cols-5 text-sm font-semibold text-gray-400 border-b border-gray-700 pb-2 mb-2">
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
                      <div>{game.mode === 'world' ? 'World' : game.mode.toUpperCase()}</div>
                      <div>{game.difficulty}</div>
                      <div className="text-center text-emerald-400 font-semibold">{game.avg_accuracy.toFixed(2)}%</div>
                      <div className="text-center font-semibold">{game.score} pts</div>
                      <div className="text-right text-gray-400">{new Date(game.played_at).toLocaleDateString()}</div>
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
