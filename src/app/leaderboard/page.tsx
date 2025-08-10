'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import NavBar from '@/components/web/NavBar'
import SiteFooter from '@/components/web/Footer'
import FriendsSlider from '@/components/web/FriendsSlider'

// Types
type Country = {
  id: string
  name: string
  iso2: string
}

type Profile = {
  display_name: string
  avatar_url: string | null
}

type LeaderboardEntry = {
  score: number
  avg_accuracy: number
  profiles: Profile[] | null
}

type UserRank = {
  rank: number | null
  high_score: number | null
  high_accuracy: number | null
}

const leaderboardTypes = [
  { id: 'singleplayer', label: 'Singleplayer' },
  { id: 'multiplayer', label: 'Multiplayer' },
  { id: 'party', label: 'Party Mode' },
  { id: 'tournaments', label: 'Tournaments' },
]

const difficultyLevels = ['easy', 'medium', 'hard']

const Avatar = ({ profile }: { profile: Profile | null | undefined }) => {
  if (profile?.avatar_url) {
    return <img src={profile.avatar_url} alt={profile.display_name} className="w-10 h-10 rounded-full" />
  }

  const initial = profile?.display_name?.charAt(0)?.toUpperCase() || '?'
  return (
    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white">
      {initial}
    </div>
  )
}

const LeaderboardPage = () => {
  const [selectedTab, setSelectedTab] = useState('singleplayer')
  const [countries, setCountries] = useState<Country[]>([])
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<UserRank | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const [mode, setMode] = useState('world')
  const [difficulty, setDifficulty] = useState('easy')

  useEffect(() => {
    const fetchInitialData = async () => {
      const res = await fetch('/data/countries.json')
      const json = await res.json()
      setCountries(json)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    fetchInitialData()
  }, [])

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true)

    const { data: top10Data, error: top10Error } = await supabase
      .from('singleplayer_games')
      .select('score, avg_accuracy, profiles(display_name, avatar_url)')
      .eq('mode', mode)
      .eq('difficulty', difficulty)
      .order('score', { ascending: false })
      .limit(10)
    
    if (top10Error && top10Error.message) { // Only log if there's an actual error message
      console.error('Error fetching leaderboard:', top10Error)
    }
    setLeaderboardData((top10Data as LeaderboardEntry[]) || [])
    
    if (userId) {
        const { data: rankData, error: rankError } = await supabase.rpc('get_user_leaderboard_rank', {
            p_user_id: userId,
            p_mode: mode,
            p_difficulty: difficulty,
        })

        if (rankError && rankError.message) { // Only log if there's an actual error message
            console.error("Error fetching user's rank:", rankError)
        }
        setUserRank(rankData?.[0] || null)
    }

    setLoading(false)
  }, [mode, difficulty, userId])

  useEffect(() => {
    // Only fetch if countries have been loaded to avoid race conditions if needed
    if (countries.length > 0) {
      fetchLeaderboard()
    }
  }, [countries, fetchLeaderboard])

  return (
    <main
      className="min-h-screen text-white flex flex-col bg-fixed bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/bg2.jpg')" }}
    >
      <NavBar />
      <FriendsSlider />

      <div className="flex justify-center pt-24 px-6">
        <div className="flex flex-col w-full max-w-3xl border-b border-white/30">
          <div className="flex justify-center space-x-12 md:space-x-24 text-lg mb-1">
            {leaderboardTypes.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`pb-2 transition ${
                  selectedTab === tab.id
                    ? 'font-bold text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative h-[2px] bg-white/20 w-full">
            <div
              className="absolute h-[3px] bg-white transition-all duration-300"
              style={{
                width: `${100 / leaderboardTypes.length}%`,
                left: `${(100 / leaderboardTypes.length) * leaderboardTypes.findIndex((m) => m.id === selectedTab)}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-8">
        {selectedTab === 'singleplayer' ? (
          <div>
            <div className="flex items-center gap-4 mb-6 bg-black/20 backdrop-blur-sm p-4 rounded-lg">
              <div className="flex-1">
                <label htmlFor="mode" className="block text-sm font-medium text-gray-300 mb-1">Mode</label>
                <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)} className="w-full bg-gray-900/80 text-white p-2 rounded-md border border-gray-700 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="world">World</option>
                  {countries.map((c) => (
                    // FIX: Changed key from c.iso2 to the unique c.id
                    <option key={c.id} value={c.iso2}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
                <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full bg-gray-900/80 text-white p-2 rounded-md border border-gray-700 focus:ring-emerald-500 focus:border-emerald-500">
                  {difficultyLevels.map(level => (
                    <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* FIX: UI has been restructured to put the table and "Your Rank" in one container */}
            <div className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden">
                <div className="h-[500px] overflow-y-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 sticky top-0 z-10">
                            <tr>
                                <th className="p-4 w-16 text-center">Rank</th>
                                <th className="p-4 w-16"></th>
                                <th className="p-4">Player</th>
                                <th className="p-4 text-right">Score</th>
                                <th className="p-4 text-right">Accuracy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center p-8"><div className="flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500" /></div></td></tr>
                            ) : leaderboardData.length > 0 ? (
                                leaderboardData.map((entry, index) => (
                                <tr key={entry.profiles?.[0]?.display_name || index} className="border-b border-gray-800 last:border-b-0 hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4 font-bold text-center text-xl">{index + 1}</td>
                                    <td className="p-4"><Avatar profile={entry.profiles?.[0]} /></td>
                                    <td className="p-4 font-semibold">{entry.profiles?.[0]?.display_name || 'Anonymous'}</td>
                                    <td className="p-4 text-right">{entry.score.toLocaleString()}</td>
                                    <td className="p-4 text-right">{entry.avg_accuracy.toFixed(2)}%</td>
                                </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="text-center p-8 text-gray-400">No scores found for this filter.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {userId && (
                    <div className="bg-gradient-to-r from-emerald-900/50 to-gray-900/50 p-4 border-t border-emerald-700">
                        <h3 className="text-lg font-bold mb-2 text-emerald-400">Your Highest Rank</h3>
                        {loading ? (
                            <div className="flex justify-center items-center p-4"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-emerald-500" /></div>
                        ) : userRank?.high_score ? (
                            <div className="flex justify-between items-center text-lg">
                                <div><span className="font-bold text-gray-300">Rank:</span> #{userRank.rank}</div>
                                <div><span className="font-bold text-gray-300">Score:</span> {userRank.high_score.toLocaleString()}</div>
                                <div><span className="font-bold text-gray-300">Accuracy:</span> {userRank.high_accuracy?.toFixed(2)}%</div>
                            </div>
                        ) : (
                            <p className="text-gray-400">You haven't played this mode or difficulty yet.</p>
                        )}
                    </div>
                )}
            </div>
          </div>
        ) : (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-400">{selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Leaderboard</h2>
                <p className="text-gray-500 mt-2">(Coming Soon)</p>
            </div>
        )}
      </div>

      <SiteFooter />
    </main>
  )
}

export default LeaderboardPage