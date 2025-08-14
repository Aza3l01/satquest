'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { RealtimeChannel } from '@supabase/supabase-js'

// Import shared components
import SatelliteMap from '@/components/game/common/SatelliteMap'
import GuessMap from '@/components/game/common/GuessMap'
import Timer from '@/components/game/common/Timer'
import RoundCounter from '@/components/game/common/RoundCounter'

// Define the types for our data
interface Match {
  id: string;
  game_state: 'waiting' | 'in_progress' | 'finished';
  team_one_health: number;
  team_two_health: number;
  current_round: number;
  locations: any[]; // Assuming locations is an array of city objects
}

interface Player {
  player_id: string;
  team: 1 | 2;
  profiles: {
    display_name: string;
    avatar_url: string | null;
  }
}

const CasualGameEngine = ({ matchId }: { matchId: string }) => {
  const [match, setMatch] = useState<Match | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState('Loading match...')
  const router = useRouter()

  useEffect(() => {
    // Get the current user's ID
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
      } else {
        router.push('/signin')
      }
    }
    fetchUser()
  }, [router])

  // This effect fetches the initial game state and sets up the real-time subscription
  useEffect(() => {
    if (!matchId || !currentUserId) return

    let channel: RealtimeChannel

    const setupMatch = async () => {
      // 1. Fetch the initial match data
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single()

      if (matchError || !matchData) {
        console.error('Error fetching match:', matchError)
        setStatusMessage('Could not find match.')
        return
      }
      setMatch(matchData)

      // 2. Fetch the players in the match
      const { data: playersData, error: playersError } = await supabase
        .from('match_players')
        .select(`
          player_id,
          team,
          profiles ( display_name, avatar_url )
        `)
        .eq('match_id', matchId)

      if (playersError || !playersData) {
        console.error('Error fetching players:', playersError)
        setStatusMessage('Could not load players.')
        return
      }
      setPlayers(playersData as Player[])

      // 3. Set up the real-time channel
      channel = supabase
        .channel(`match-${matchId}`)
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'matches',
            filter: `id=eq.${matchId}`
          },
          (payload) => {
            console.log('Match updated!', payload.new)
            setMatch(payload.new as Match)
          }
        )
        // We will add listeners for guesses later
        .subscribe()

      setIsLoading(false)
    }

    setupMatch()

    // Cleanup function to unsubscribe from the channel when the component unmounts
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [matchId, currentUserId, router])

  // Helper to get the current location for the round
  const currentRoundLocation = match ? match.locations[match.current_round - 1] : null

  if (isLoading || !match || !currentRoundLocation) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mr-3"></div>
          <div className="text-white text-xl">{statusMessage}</div>
        </div>
      </div>
    )
  }

  // Find the current user and the opponent
  const currentUser = players.find(p => p.player_id === currentUserId)
  const opponentUser = players.find(p => p.player_id !== currentUserId)

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* --- UI PLACEHOLDERS --- */}
      <div className="absolute top-4 left-4 z-10 text-white bg-black/50 p-2 rounded-lg">
        <p className="font-bold">{currentUser?.profiles.display_name} (You)</p>
        <p>Health: {currentUser?.team === 1 ? match.team_one_health : match.team_two_health}</p>
      </div>

      <div className="absolute top-4 right-4 z-10 text-white bg-black/50 p-2 rounded-lg text-right">
        <p className="font-bold">{opponentUser?.profiles.display_name || 'Waiting...'}</p>
        <p>Health: {opponentUser?.team === 1 ? match.team_one_health : match.team_two_health}</p>
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <Timer timeLeft={90} /> {/* We will wire this up later */}
      </div>
      {/* --- END OF UI PLACEHOLDERS --- */}

      <SatelliteMap
        lat={currentRoundLocation.lat}
        lon={currentRoundLocation.lon}
        zoom={14} // We can tie this to difficulty later
        onMapLoad={() => {}} // We can wire this up later
      />

      <div className="absolute bottom-4 right-4 z-10">
        <GuessMap
          onGuess={() => {}} // We will wire this up next
          onConfirm={() => {}} // We will wire this up next
          hasGuess={false}
        />
      </div>
    </div>
  )
}

export default CasualGameEngine
