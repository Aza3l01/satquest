'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/web/NavBar'
import FriendsSlider from '@/components/web/FriendsSlider'
import SiteFooter from '@/components/web/Footer'

const modes = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Guess cities from satellite images in the original solo experience.',
    announcement:
      'The original singleplayer experience. Challenge yourself and set a new high score!',
    route: '/play/classic',
    enabled: true,
  },
  {
    id: 'casual',
    label: 'Casual',
    description: 'Play casual, unranked matches with other players (In development).',
    announcement:
      'Casual multiplayer is under development. A chill way to play with the community.',
    route: '/play/casual',
    enabled: true,
  },
  {
    id: 'ranked',
    label: 'Ranked',
    description: 'Compete in skill-based matches and climb the ladder (In development).',
    announcement:
      'Ranked mode with an ELO system is coming soon. Get ready to prove your skills!',
    route: null,
    enabled: false,
  },
  {
    id: 'elimination',
    label: 'Elimination',
    description: 'A battle royale where the player with the worst guess each round is eliminated (In development).',
    announcement:
      'Last one standing wins. Elimination mode is under development.',
    route: null,
    enabled: false,
  },
  {
    id: 'party',
    label: 'Party',
    description: 'Host private games to play with just your friends (In development).',
    announcement:
      'Party mode will let you create private rooms. Coming soon!',
    route: null,
    enabled: false,
  },
]

export default function PlayPage() {
  const [selectedMode, setSelectedMode] = useState('classic')
  const router = useRouter()

  const current = modes.find((m) => m.id === selectedMode)

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white flex flex-col"
      style={{ backgroundImage: "url('/bg2.jpg')" }}
    >
      <NavBar />
      <FriendsSlider />

      <div className="flex justify-center pt-24 px-6">
        <div className="flex flex-col w-full max-w-3xl border-b border-white/30">
          <div className="flex justify-center space-x-24 text-lg mb-1">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`pb-2 transition ${
                  selectedMode === mode.id
                    ? 'font-bold text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div className="relative h-[2px] bg-white/20 w-full">
            <div
              className="absolute h-[3px] bg-white transition-all duration-300"
              style={{
                width: `${100 / modes.length}%`,
                left: `${(100 / modes.length) * modes.findIndex((m) => m.id === selectedMode)}%`,
              }}
            />
          </div>
        </div>
      </div>

      <main className="flex-grow flex items-center justify-center px-6">
        <div className="flex flex-col md:flex-row w-full max-w-5xl justify-between items-center gap-12">
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-semibold text-center mb-4">Announcements</h2>
            <p className="text-white/90 text-sm leading-relaxed text-center max-w-md mx-auto">
              {current?.announcement}
            </p>
          </div>

          <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold mb-4">{current?.label}</h2>
            <p className="text-white/80 text-sm mb-6 max-w-sm">{current?.description}</p>
            {current?.enabled ? (
              <button
                onClick={() => router.push(current.route!)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-md font-semibold px-6 py-3 rounded-lg transition"
              >
                Play {current.label}
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-700 text-white/40 text-md font-semibold px-6 py-3 rounded-lg cursor-not-allowed"
              >
                In development
              </button>
            )}
          </div>
        </div>
      </main>

      <div className="px-6 pb-4 pt-2">
        <SiteFooter />
      </div>
    </div>
  )
}