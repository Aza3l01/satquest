'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { PlusIcon, CheckIcon, XMarkIcon  } from '@heroicons/react/24/outline'

interface UserCard {
  id: string
  display_name: string
  avatar_url: string | null
}

export default function FriendsSlider() {
  const [open, setOpen] = useState(false)
  const [me, setMe] = useState<string>('')
  const [incoming, setIncoming] = useState<UserCard[]>([])
  const [friends, setFriends] = useState<UserCard[]>([])
  const [codeInput, setCodeInput] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)

  // Load my ID, incoming requests, and friends on mount
  useEffect(() => {
    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      setMe(user.id)

      // fetch pending requests (user_id → me)
      const { data: incRows } = await supabase
        .from('friends')
        .select('user_id')
        .eq('friend_id', user.id)
        .eq('status', 'pending')

      // fetch accepted friendships (either direction)
      const { data: accRows } = await supabase
        .from('friends')
        .select('user_id,friend_id')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted')

      // helper to load profile info
      const loadProfiles = async (ids: string[]) => {
        const out: UserCard[] = []
        for (let id of ids) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('display_name,avatar_url')
            .eq('id', id)
            .single()
          if (prof) out.push({ id, display_name: prof.display_name, avatar_url: prof.avatar_url })
        }
        return out
      }

      setIncoming(
        await loadProfiles(incRows?.map(r => r.user_id) || [])
      )

      const friendIds = (accRows || []).map(r =>
        r.user_id === user.id ? r.friend_id : r.user_id
      )
      setFriends(await loadProfiles(friendIds))
    })()
  }, [])

  // Send a friend request
  const sendRequest = async () => {
    if (!codeInput) return
    await supabase.from('friends').insert({ user_id: me, friend_id: codeInput })
    setCodeInput('')
    // you could reload incoming/outgoing here
  }

  // Accept a request
  const accept = async (id: string) => {
    await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .match({ user_id: id, friend_id: me })
    setIncoming(i => i.filter(u => u.id !== id))
    const accepted = incoming.find(u => u.id === id)
    if (accepted) setFriends(f => [...f, accepted])
  }

  // Reject a request
  const reject = async (id: string) => {
    await supabase
      .from('friends')
      .update({ status: 'rejected' })
      .match({ user_id: id, friend_id: me })
    setIncoming(i => i.filter(u => u.id !== id))
  }

  return (
    <div
      ref={panelRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={`
        fixed top-0 right-0 h-full bg-black/30 backdrop-blur-sm
        ${open ? 'w-72 pt-16' : 'w-12 pt-16'} transition-[width] duration-200 overflow-hidden z-40
      `}
    >
      <div className="flex flex-col h-full">
        {/* Add Friend */}
        <div className="p-2 flex items-center space-x-2 border-b border-gray-700">
          <input
            className="flex-1 p-1 rounded bg-gray-800 text-sm text-white"
            placeholder="Friend code"
            value={codeInput}
            onChange={e => setCodeInput(e.target.value)}
          />
          <button onClick={sendRequest}>
            <PlusIcon className="h-5 w-5 text-emerald-400" />
          </button>
        </div>

        {/* Incoming Requests */}
        <div className="flex-shrink-0 p-2 border-b border-gray-700">
          <h3 className="text-xs text-gray-400 uppercase">Requests</h3>
          {incoming.map(u => (
            <div key={u.id} className="flex items-center justify-between mt-1">
              <div className="flex items-center space-x-2">
                <img
                  src={u.avatar_url || '/default-avatar.png'}
                  alt=""
                  className="h-6 w-6 rounded-full"
                />
                {open && <span className="text-xs text-white">{u.display_name}</span>}
              </div>
              {open && (
                <div className="flex space-x-1">
                  <button onClick={() => accept(u.id)}>
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  </button>
                  <button onClick={() => reject(u.id)}>
                    <XMarkIcon className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Friends List */}
        <div className="p-2 overflow-auto flex-1">
          <h3 className="text-xs text-gray-400 uppercase">Friends</h3>
          {friends.map(u => (
            <div key={u.id} className="flex items-center justify-between mt-1">
              <div className="flex items-center space-x-2">
                <img
                  src={u.avatar_url || '/default-avatar.png'}
                  alt=""
                  className="h-6 w-6 rounded-full"
                />
                {open && <span className="text-xs text-white">{u.display_name}</span>}
              </div>
              {open && (
                <button>
                  <PlusIcon className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
