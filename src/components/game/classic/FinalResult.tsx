'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import SiteFooter from '@/components/web/Footer'

interface FinalResultProps {
  results: any[]
  onRestart: () => void
  mode: string
  difficulty: 'easy' | 'medium' | 'hard'
  isGuest?: boolean
}

export default function FinalResult({
  results,
  onRestart,
  mode,
  difficulty,
  isGuest = false,
}: FinalResultProps) {
  const totalScore = results.reduce((sum, result) => sum + result.score, 0)
  const avgAccuracy =
    results.reduce((sum, result) => sum + result.accuracy, 0) / results.length
  const totalDistance = results.reduce((sum, result) => sum + result.distance, 0)
  const totalTimePlayed = results.reduce((sum, result) => sum + result.timeSpent, 0)
  const router = useRouter()

  const saveAttempted = useRef(false)

  useEffect(() => {
    if (isGuest) {
      return;
    }

    const saveGame = async () => {
      if (saveAttempted.current) return

      saveAttempted.current = true

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (!user || userError) {
        console.error('Failed to get user for saving game:', userError)
        return
      }

      const { error: insertError } = await supabase.from('classic_games').insert([
        {
          user_id: user.id,
          mode,
          difficulty,
          score: totalScore,
          avg_accuracy: avgAccuracy,
          time_played: totalTimePlayed,
          played_at: new Date().toISOString(),
          rounds: results,
        },
      ])

      if (insertError) {
        console.error('Error saving game:', insertError)
      }
    }

    saveGame()
  }, [results, mode, difficulty, totalScore, avgAccuracy, totalTimePlayed, isGuest])

  return (
    <div className="bg-[url('/bg2.jpg')] fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black/10 backdrop-blur-lg rounded-xl p-8 max-w-3xl w-full mx-4">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isGuest ? 'Demo Complete!' : 'Game Complete!'}
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-black/10 p-4 rounded-lg text-center">
            <p className="text-white">Total Score</p>
            <p className="text-3xl font-bold">{totalScore}</p>
          </div>

          <div className="bg-black/10 p-4 rounded-lg text-center">
            <p className="text-white">Avg Accuracy</p>
            <p className="text-3xl font-bold text-green-600">
              {avgAccuracy.toFixed(2)}%
            </p>
          </div>

          <div className="bg-black/10 p-4 rounded-lg text-center">
            <p className="text-white">Total Distance</p>
            <p className="text-3xl font-bold">{totalDistance.toFixed(2)} km</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Round Details</h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-white/20 pb-2"
              >
                <div>
                  <span className="font-bold">Round {index + 1}:</span>
                  <span className="ml-2">{result.city.name}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-green-600 font-bold">
                    {result.accuracy.toFixed(2)}%
                  </span>
                  <span>{result.distance.toFixed(2)} km</span>
                  <span>{result.score} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {isGuest ? (
            <div className="text-center">
              <p className="mb-4">Enjoyed the demo?</p>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-lg"
              >
                Sign Up to Play More!
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={onRestart}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold"
              >
                Play Again
              </button>
              <button
                onClick={() => router.push('/play')}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold"
              >
                Back to Menu
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}