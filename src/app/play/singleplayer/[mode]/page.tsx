'use client'

import GameEngine from '@/components/game/GameEngine';
import { useParams } from 'next/navigation';

export default function SinglePlayerGame() {
  const params = useParams();
  const mode = params.mode as string;

  return (
    <div className="h-screen">
      <GameEngine mode={mode} />
    </div>
  );
}