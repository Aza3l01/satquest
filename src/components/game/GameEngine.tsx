'use client'

import { useState, useEffect } from 'react'
import SatelliteMap from '@/components/game/SatelliteMap'
import GuessMap from '@/components/game/GuessMap'
import Timer from '@/components/game/Timer'
import RoundCounter from '@/components/game/RoundCounter'
import RoundResult from '@/components/game/RoundResult'
import FinalResult from '@/components/game/FinalResult'

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
}

export default function GameEngine({
  mode,
  difficulty,
}: GameEngineProps) {
  const [round, setRound] = useState(1)
  const [timeLeft, setTimeLeft] = useState(90)
  const [gameState, setGameState] = useState<'playing' | 'result' | 'finished'>('playing')
  const [cities, setCities] = useState<City[]>([])
  const [currentCity, setCurrentCity] = useState<City | null>(null)
  const [guessCoords, setGuessCoords] = useState<[number, number] | null>(null)
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    fetch('/data/cities.json')
      .then(res => res.json())
      .then((all: City[]) => {
        // 1) filter by world vs country (use iso2 code)
        const relevant = mode === 'world'
          ? all
          : all.filter(city => city.iso2.toUpperCase() === mode.toUpperCase())

        if (relevant.length === 0) {
          console.error(`No cities found for mode="${mode}"`)
          return
        }

        // 2) sort by population descending
        const sorted = [...relevant].sort((a, b) => b.population - a.population)
        const sliceSize = Math.ceil(sorted.length * 0.2)

        // 3) pick bucket
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

        // 4) initialize game with pool
        setCities(pool)
        selectRandomCity(pool)
      })
      .catch(error => console.error('Failed to load cities:', error))
  }, [mode, difficulty])

  const selectRandomCity = (list: City[]) => {
    const idx = Math.floor(Math.random() * list.length)
    setCurrentCity(list[idx])
    setGuessCoords(null)
  }

  const handleGuess = (coords: [number, number]) => {
    setGuessCoords(coords)
  }

  const handleConfirm = () => {
    if (!currentCity || !guessCoords) return

    const distance = calculateDistance(
      [currentCity.lon, currentCity.lat],
      guessCoords
    )
    const accuracy = calculateAccuracy(distance)
    const score = Math.round((timeLeft * accuracy) / 100)

    const result = {
      round,
      city: currentCity,
      guess: guessCoords,
      accuracy,
      distance,
      timeSpent: 90 - timeLeft,
      score,
    }

    setResults(prev => [...prev, result])
    setGameState('result')
  }

  const nextRound = () => {
    if (round >= 5) {
      setGameState('finished')
    } else {
      setRound(r => r + 1)
      setTimeLeft(90)
      selectRandomCity(cities)
      setGameState('playing')
    }
  }

  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return

    const timerId = setTimeout(() => {
      setTimeLeft(t => t - 1)
      if (timeLeft === 1) handleConfirm()
    }, 1000)

    return () => clearTimeout(timerId)
  }, [timeLeft, gameState])

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
        <button
          onClick={() => (window.location.href = '/play')}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Quit Game
        </button>
      </div>

      <SatelliteMap lat={currentCity.lat} lon={currentCity.lon} />

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
        />
      )}

      {gameState === 'finished' && (
        <FinalResult
          results={results}
          onRestart={() => window.location.reload()}
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
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function calculateAccuracy(distance: number): number {
  const maxDistance = 10000
  return Math.max(0, 100 - (distance / maxDistance) * 100)
}
