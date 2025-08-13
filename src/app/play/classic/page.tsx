'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { getProfile } from '@/lib/profile'
import NavBar from '@/components/web/NavBar'
import SiteFooter from '@/components/web/Footer'
import FriendsSlider from '@/components/web/FriendsSlider'

type Country = {
  id: string
  name: string
}

const difficultyLevels = ['easy', 'medium', 'hard']

// --- CHANGE: Renamed component ---
const ClassicPage = () => {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [countries, setCountries] = useState<Country[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('medium')

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email || null)
      if (user) {
        const profileData = await getProfile(user.id)
        setProfile(profileData)
      }
      setLoading(false)
    }

    const fetchCountries = async () => {
      const res = await fetch('/data/countries.json')
      const json = await res.json()
      setCountries(json)
    }

    fetchUser()
    fetchCountries()
  }, [])

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStart = () => {
    if (!selectedCountry) return
    // --- CHANGE: Updated the route to '/play/classic/' ---
    router.push(`/play/classic/${selectedCountry.id}?difficulty=${selectedDifficulty}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
      </div>
    )
  }

  return (
    <main
      className="h-screen text-white px-2 py-2 flex flex-col bg-fixed bg-center bg-no-repeat bg-cover overflow-hidden"
      style={{ backgroundImage: "url('/bg2.jpg')" }}
    >
      <NavBar />
      <FriendsSlider />

      <div className="max-w-6xl mx-auto w-full pt-16 flex flex-col lg:flex-row gap-8 flex-grow overflow-hidden">
        <div className="lg:w-3/4 overflow-y-auto pr-4">
          <div
            className={`relative mb-6 cursor-pointer rounded-xl overflow-hidden border-2 ${
              selectedCountry?.id === 'world' ? 'border-emerald-500' : 'border-transparent'
            }`}
            onClick={() => setSelectedCountry({ id: 'world', name: 'World' })}
          >
            <img src="/thumbs/world.jpg" alt="World" className="w-full h-100 object-cover" />
            <div className="absolute inset-0 flex items-center justify-start px-40">
              <h2 className="text-3xl font-bold text-white">Play The <br /> World!</h2>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search for a country"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-black/10 backdrop-blur-md text-white p-3 rounded-lg mb-6"
          />

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCountries.map((country) => (
              <div
                key={country.id}
                className={`bg-gray-900 p-3 rounded-lg cursor-pointer border-2 transition ${
                  selectedCountry?.id === country.id ? 'border-emerald-500' : 'border-transparent'
                }`}
                onClick={() => setSelectedCountry(country)}
              >
                <img
                  src={`https://flagcdn.com/w320/${country.id.toLowerCase()}.png`}
                  alt={country.name}
                  className="w-full h-28 object-cover rounded-md mb-2"
                />
                <h3 className="text-center text-white font-medium">{country.name}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/4">
          <div className="bg-gray-900 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-emerald-400 mb-4">Player Info</h2>
            <div className="flex items-center mb-6">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="rounded-full w-12 h-12 mr-4" />
              ) : (
                <div className="bg-emerald-600 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-lg">{profile?.display_name?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>
              )}
              <div>
                <h3 className="font-semibold">
                  {profile?.display_name || userEmail?.split('@')[0] || 'Player'}
                </h3>
                <p className="text-gray-400 text-sm break-all">{userEmail}</p>
              </div>
            </div>

            {selectedCountry && (
              <>
                <div className="mb-4">
                  {selectedCountry.id === 'world' ? (
                    <img
                      src="/thumbs/world.jpg"
                      alt="World"
                      className="w-full h-28 object-cover rounded-md mb-2"
                    />
                  ) : (
                    <img
                      src={`https://flagcdn.com/w320/${selectedCountry.id.toLowerCase()}.png`}
                      alt={selectedCountry.name}
                      className="w-full h-28 object-cover rounded-md mb-2"
                    />
                  )}
                  <h3 className="text-lg font-semibold">{selectedCountry.name}</h3>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Difficulty</h4>
                  <div className="flex gap-2">
                    {difficultyLevels.map((level) => (
                      <button
                        key={level}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          selectedDifficulty === level ? 'bg-emerald-600' : 'bg-gray-800'
                        }`}
                        onClick={() => setSelectedDifficulty(level)}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded-lg transition"
                >
                  Start Game
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}

// --- CHANGE: Renamed export ---
export default ClassicPage