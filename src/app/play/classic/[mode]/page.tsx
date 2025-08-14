'use client';

import { useSearchParams, useParams } from 'next/navigation';
import GameEngine from '@/components/game/classic/GameEngine';

export default function GamePageClient() {
  const searchParams = useSearchParams();
  const params = useParams<{ mode: string }>();

  const isGuest = searchParams.get('guest') === 'true';
  const difficulty = (
    searchParams.get('difficulty') as 'easy' | 'medium' | 'hard' | null
  ) || 'medium';

  return (
    <GameEngine
      mode={params.mode}
      difficulty={difficulty}
      isGuest={isGuest}
    />
  );
}