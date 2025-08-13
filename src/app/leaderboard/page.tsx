'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import NavBar from '@/components/web/NavBar'
import SiteFooter from '@/components/web/Footer'
import FriendsSlider from '@/components/web/FriendsSlider'
// Import our new component
import CustomDropdown, { DropdownOption } from '@/components/web/CustomDropdown'

// Types
type Country = { id: string; name: string; iso2: string }
type Profile = { display_name: string; avatar_url: string | null }
type LeaderboardEntry = { score: number; avg_accuracy: number; display_name: string; avatar_url: string | null }
type UserRank = { rank: number | null; high_score: number | null; high_accuracy: number | null }

// --- CHANGE: Updated leaderboard types and order ---
const leaderboardTypes = [
  { id: 'classic', label: 'Classic' },
  { id: 'casual', label: 'Casual' },
  { id: 'ranked', label: 'Ranked' },
  { id: 'elimination', label: 'Elimination' },
  { id: 'party', label: 'Party' },
]

// Data for the difficulty dropdown
const difficultyOptions: DropdownOption[] = [
    { value: 'easy', name: 'Easy' },
    { value: 'medium', name: 'Medium' },
    { value: 'hard', name: 'Hard' },
]

const Avatar = ({ profile }: { profile: { display_name: string; avatar_url: string | null } | null | undefined }) => {
  if (profile?.avatar_url) {
    return <img src={profile.avatar_url} alt={profile.display_name} className="w-8 h-8 rounded-full" />
  }
  const initial = profile?.display_name?.charAt(0)?.toUpperCase() || '?'
  return (
    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
      {initial}
    </div>
  )
}

const LeaderboardPage = () => {
  // --- CHANGE: Default selected tab is now 'classic' ---
  const [selectedTab, setSelectedTab] = useState('classic')
  const [countries, setCountries] = useState<Country[]>([])
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<UserRank | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // State for the dropdowns
  const [selectedMode, setSelectedMode] = useState<DropdownOption>({ value: 'world', name: 'World' })
  const [selectedDifficulty, setSelectedDifficulty] = useState<DropdownOption>(difficultyOptions[0])

  // Prepare country data for the dropdown
  const countryOptions: DropdownOption[] = [
    { value: 'world', name: 'World' },
    ...countries.map(c => ({ value: c.id, name: c.name }))
  ]

  useEffect(() => {
    const fetchInitialData = async () => {
      const res = await fetch('/data/countries.json')
      const json = await res.json()
      setCountries(json)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    fetchInitialData()
  }, [])

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true)
    const { data: top10Data, error: top10Error } = await supabase.rpc('get_leaderboard', {
      p_mode: selectedMode.value,
      p_difficulty: selectedDifficulty.value,
    });
    if (top10Error) console.error("Error fetching leaderboard:", top10Error);
    setLeaderboardData(top10Data || []);

    if (userId) {
      const { data: rankData, error: rankError } = await supabase.rpc('get_user_leaderboard_rank', {
        p_user_id: userId,
        p_mode: selectedMode.value,
        p_difficulty: selectedDifficulty.value,
      });
      if (rankError) console.error("Error fetching user rank:", rankError);
      setUserRank(rankData?.[0] || null);
    }
    setLoading(false)
  }, [selectedMode, selectedDifficulty, userId])

  useEffect(() => {
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
              <button key={tab.id} onClick={() => setSelectedTab(tab.id)} className={`pb-2 transition ${ selectedTab === tab.id ? 'font-bold text-white' : 'text-white/50 hover:text-white/80' }`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative h-[2px] bg-white/20 w-full">
            <div className="absolute h-[3px] bg-white transition-all duration-300" style={{ width: `${100 / leaderboardTypes.length}%`, left: `${(100 / leaderboardTypes.length) * leaderboardTypes.findIndex((m) => m.id === selectedTab)}%` }} />
          </div>
        </div>
      </div>

      <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-8">
        {/* --- CHANGE: Check for 'classic' tab to show the leaderboard --- */}
        {selectedTab === 'classic' ? (
          <div className="bg-black/10 backdrop-blur-md rounded-lg overflow-hidden">
            <div className="flex items-center gap-3 p-3 border-b border-white/10">
              <div className="flex-1">
                <label className="block text-xs font-medium text-white mb-1">Mode</label>
                <CustomDropdown options={countryOptions} selected={selectedMode} onChange={setSelectedMode} />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-white mb-1">Difficulty</label>
                <CustomDropdown options={difficultyOptions} selected={selectedDifficulty} onChange={setSelectedDifficulty} />
              </div>
            </div>
            
            <div className="h-[400px] overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="bg-black/10 sticky top-0 z-10">
                        <tr className="text-xs text-white uppercase">
                            <th className="p-3 w-16 text-center font-semibold">Rank</th>
                            <th className="p-3 w-12 font-semibold"></th>
                            <th className="p-3 font-semibold">Player</th>
                            <th className="p-3 text-right font-semibold">Score</th>
                            <th className="p-3 text-right font-semibold">Accuracy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="text-center p-8"><div className="flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500" /></div></td></tr>
                        ) : leaderboardData.length > 0 ? (
                            leaderboardData.map((entry, index) => (
                            <tr key={entry.display_name + index} className="border-b border-gray-800 last:border-b-0 text-sm">
                                <td className="p-3 font-bold text-center text-base">{index + 1}</td>
                                <td className="p-3"><Avatar profile={entry} /></td>
                                <td className="p-3 font-medium">{entry.display_name || 'Anonymous'}</td>
                                <td className="p-3 text-right">{entry.score.toLocaleString()}</td>
                                <td className="p-3 text-right text-gray-300">{entry.avg_accuracy.toFixed(2)}%</td>
                            </tr>
                            ))
                        ) : (
                            <tr><td colSpan={5} className="text-center p-8 text-gray-400">No scores found for this filter.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {userId && (
                <div className="bg-gradient-to-r from-emerald-900/50 to-black/10 p-3 border-t border-white/10">
                    <h3 className="text-base font-bold mb-2 text-emerald-400">Your Highest Rank</h3>
                    {loading ? (
                        <div className="flex justify-center items-center p-4"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-emerald-500" /></div>
                    ) : userRank?.high_score ? (
                        <div className="flex justify-between items-center text-base">
                            <div><span className="font-bold text-gray-300">Rank:</span> #{userRank.rank}</div>
                            <div><span className="font-bold text-gray-300">Score:</span> {userRank.high_score.toLocaleString()}</div>
                            <div><span className="font-bold text-gray-300">Accuracy:</span> {userRank.high_accuracy?.toFixed(2)}%</div>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">You haven't played this mode or difficulty yet.</p>
                    )}
                </div>
            )}
          </div>
        ) : (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-400">{leaderboardTypes.find(t => t.id === selectedTab)?.label} Leaderboard</h2>
                <p className="text-gray-500 mt-2">(Coming Soon)</p>
            </div>
        )}
      </div>

      <div className="px-6 pb-4 pt-2">
        <SiteFooter />
      </div>
    </main>
  )
}

export default LeaderboardPage
