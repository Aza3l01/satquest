'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import SatelliteMap from '@/components/game/SatelliteMap'
import Timer from '@/components/game/Timer'
import RoundCounter from '@/components/game/RoundCounter'
import RoundResult from '@/components/game/RoundResult'
import FinalResult from '@/components/game/FinalResult'

const GuessMap = dynamic(() => import('@/components/game/GuessMap'), {
  ssr: false,
  loading: () => <div className="min-w-[180px] min-h-[135px] bg-gray-800 rounded-lg flex items-center justify-center"><p className="text-white/50 text-sm">Loading map...</p></div>
});

interface City {
  id: string
  name: string
  country: string
  iso2: string
  lat: number
  lon: number
  population: number
}

interface GameEngineProps {
  mode: string
  difficulty: 'easy' | 'medium' | 'hard'
  isGuest?: boolean
}

const getZoomForDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): number => {
  switch (difficulty) {
    case 'easy':
      return 15;
    case 'medium':
      return 13;
    case 'hard':
      return 11;
    default:
      return 14;
  }
};

export default function GameEngine({
  mode,
  difficulty,
  isGuest = false,
}: GameEngineProps) {
  const [round, setRound] = useState(1)
  const [timeLeft, setTimeLeft] = useState(90)
  const [gameState, setGameState] = useState<'playing' | 'result' | 'finished'>('playing')
  const [cities, setCities] = useState<City[]>([])
  const [currentCity, setCurrentCity] = useState<City | null>(null)
  const [guessCoords, setGuessCoords] = useState<[number, number] | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/data/cities.json')
      .then(res => res.json())
      .then((all: City[]) => {
        const relevant = mode === 'world'
          ? all
          : all.filter(city => city.iso2.toUpperCase() === mode.toUpperCase())

        if (relevant.length === 0) {
          console.error(`No cities found for mode="${mode}"`)
          return
        }

        const sorted = [...relevant].sort((a, b) => b.population - a.population)
        const sliceSize = Math.ceil(sorted.length * 0.2)

        let pool: City[]
        switch (difficulty) {
          case 'easy':
            pool = sorted.slice(0, sliceSize)
            break
          case 'medium':
            pool = sorted.slice(sliceSize, sliceSize * 2)
            break
          case 'hard':
            pool = sorted.slice(-sliceSize)
            break
        }
        
        const availableCities = pool.filter(p => !results.some(r => r.city.id === p.id));
        setCities(availableCities);
        selectRandomCity(availableCities);
      })
      .catch(error => console.error('Failed to load cities:', error))
  }, [mode, difficulty])

  const selectRandomCity = (list: City[]) => {
    if (list.length === 0) {
      setGameState('finished');
      return;
    }
    const idx = Math.floor(Math.random() * list.length)
    setCurrentCity(list[idx])
    setGuessCoords(null)
    setIsMapLoaded(false);
  }
  
  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  const handleGuess = (coords: [number, number]) => {
    setGuessCoords(coords)
  }

  const handleTimeUp = () => {
    if (!currentCity) return;

    const result = {
      round,
      city: currentCity,
      guess: null,
      accuracy: 0,
      distance: 20000,
      timeSpent: 90,
      score: 0,
    };

    setResults(prev => [...prev, result]);
    setGameState('result');
  };

  const handleConfirm = () => {
    if (!currentCity || !guessCoords) return

    const distance = calculateDistance([currentCity.lon, currentCity.lat], guessCoords)
    const accuracy = calculateAccuracy(distance)
    const MAX_ROUND_SCORE = 1000;
    const score = Math.round(MAX_ROUND_SCORE * (accuracy / 100) * (timeLeft / 90));
    const result = { round, city: currentCity, guess: guessCoords, accuracy, distance, timeSpent: 90 - timeLeft, score }
    setResults(prev => [...prev, result])
    setGameState('result')
  }

  const nextRound = () => {
    if (round >= 5) {
      setGameState('finished')
    } else {
      setRound(r => r + 1)
      setTimeLeft(90)
      const remainingCities = cities.filter(city => city.id !== currentCity?.id);
      setCities(remainingCities);
      selectRandomCity(remainingCities)
      setGameState('playing')
    }
  }
  
  const handleQuit = () => {
    if (isGuest) {
      router.push('/');
    } else {
      router.push('/play');
    }
  }

  useEffect(() => {
    if (gameState !== 'playing' || !isMapLoaded || timeLeft <= 0) {
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    if (timeLeft === 1) {
        setTimeout(handleTimeUp, 1000);
    }

    return () => clearTimeout(timerId);
  }, [timeLeft, gameState, isMapLoaded]);

  if (!currentCity || cities.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between p-4 bg-black/0">
        <RoundCounter current={round} total={5} />
        <Timer timeLeft={timeLeft} />
        <button onClick={handleQuit} className="px-3 py-1 bg-red-500 text-white rounded text-sm">
          Quit Game
        </button>
      </div>

      <SatelliteMap
        lat={currentCity.lat}
        lon={currentCity.lon}
        zoom={getZoomForDifficulty(difficulty)}
        onMapLoad={handleMapLoad}
      />

      <div className="absolute bottom-4 right-4 z-10">
        <GuessMap
          onGuess={handleGuess}
          onConfirm={handleConfirm}
          hasGuess={!!guessCoords}
        />
      </div>

      {gameState === 'result' && (
        <RoundResult
          result={results[results.length - 1]}
          onNext={nextRound}
          isGuest={isGuest}
        />
      )}

      {gameState === 'finished' && (
        <FinalResult
          results={results}
          onRestart={() => window.location.reload()}
          mode={mode}
          difficulty={difficulty}
          isGuest={isGuest}
        />
      )}
    </div>
  )
}

function calculateDistance(
  coords1: [number, number],
  coords2: [number, number]
): number {
  const [lon1, lat1] = coords1
  const [lon2, lat2] = coords2
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function calculateAccuracy(distance: number): number {
  const maxDistance = 5000
  return Math.max(0, 100 - (distance / maxDistance) * 100)
}