'use client'

import { useSearchParams, useParams } from 'next/navigation'
import GameEngine from '@/components/game/GameEngine'

export default function SinglePlayerGamePage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const mode = params.mode as string
  const difficulty = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard' | null

  if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <p className="text-lg">Invalid or missing difficulty.</p>
      </div>
    )
  }

  return (
    <div className="h-screen">
      <GameEngine mode={mode} difficulty={difficulty} />
    </div>
  )
}
