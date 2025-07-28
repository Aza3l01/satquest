'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { getProfile } from '@/lib/profile'
import {
  CheckIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

interface Profile {
  id: string
  display_name: string
  avatar_url?: string
}

interface FriendRecord {
  user_id: string
  friend_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
}

export default function FriendsSlider() {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState<Profile[]>([])
  const [friends, setFriends] = useState<Profile[]>([])
  const [inputCode, setInputCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data: pendRecs } = await supabase
        .from<FriendRecord>('friends')
        .select('user_id')
        .eq('friend_id', user.id)
        .eq('status', 'pending')
      const pendProfiles = await Promise.all(
        (pendRecs || []).map(r => getProfile(r.user_id) as Promise<Profile>)
      )
      setPending(pendProfiles.filter(Boolean))

      const { data: frRecs } = await supabase
        .from<FriendRecord>('friends')
        .select('user_id, friend_id')
        .or(`and(user_id.eq.${user.id},status.eq.accepted),and(friend_id.eq.${user.id},status.eq.accepted)`)
      const otherIds = (frRecs || []).map(r =>
        r.user_id === user.id ? r.friend_id : r.user_id
      )
      const frProfiles = await Promise.all(
        otherIds.map(id => getProfile(id) as Promise<Profile>)
      )
      setFriends(frProfiles.filter(Boolean))
    }
    load()
  }, [])

  const handleAdd = async () => {
    if (!userId || !inputCode) return
    const { error } = await supabase
      .from('friends')
      .insert({ user_id: userId, friend_id: inputCode })
    setMessage(error ? `Error: ${error.message}` : 'Request sent!')
    setInputCode('')
    setTimeout(() => setMessage(null), 3000)
  }

  const accept = async (fromId: string) => {
    if (!userId) return
    await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .eq('user_id', fromId)
      .eq('friend_id', userId)
    setPending(p => p.filter(x => x.id !== fromId))
    const prof = await getProfile(fromId)
    if (prof) setFriends(f => [prof, ...f])
  }

  const remove = async (otherId: string, isFriend: boolean) => {
    if (!userId) return
    await supabase
      .from('friends')
      .delete()
      .or(`and(user_id.eq.${otherId},friend_id.eq.${userId}),and(user_id.eq.${userId},friend_id.eq.${otherId})`)
    if (isFriend) setFriends(f => f.filter(x => x.id !== otherId))
    else setPending(p => p.filter(x => x.id !== otherId))
  }

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={`
        fixed top-0 right-0 bottom-0 flex flex-col
        bg-black/40 backdrop-blur-lg text-white
        transition-width duration-300 overflow-hidden
        ${open ? 'w-80' : 'w-16'}
      `}
    >
      {/* Add Friend */}
      <div className="p-2 flex items-center gap-2">
        <input
          value={inputCode}
          onChange={e => setInputCode(e.target.value)}
          placeholder="Friend UUID"
          className={`
            flex-grow px-2 py-1 bg-gray-800 rounded
            text-sm placeholder-gray-500
            ${open ? '' : 'hidden'}
          `}
        />
        <button
          onClick={handleAdd}
          className="p-1 rounded-full border border-emerald-600 hover:bg-emerald-600 hover:text-black transition"
          title="Send Request"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
      {message && open && (
        <div className="text-xs text-center text-emerald-300">{message}</div>
      )}

      <hr className="border-gray-700 my-2" />

      {/* Pending Requests */}
      <div className="px-2 text-sm font-semibold text-gray-400 text-left">
        {open ? 'Pending Requests' : 'PR'}
      </div>
      <div className="flex-grow overflow-auto p-2 space-y-2">
        {pending.map(p => (
          <div key={p.id} className="flex items-center justify-between">
            <Link href={`/profile/${p.id}`} className="flex items-center gap-2">
              <img
                src={p.avatar_url || '/default-avatar.png'}
                alt=""
                className="w-6 h-6 rounded-full"
              />
              {open && <span className="text-sm">{p.display_name}</span>}
            </Link>
            {open && (
              <div className="flex gap-1">
                <div className="relative group">
                  <button onClick={() => accept(p.id)}
                    className="p-1 rounded-full border border-emerald-600 hover:bg-emerald-600 hover:text-black transition"
                    title="Accept"
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-gray-200 px-2 rounded opacity-0 group-hover:opacity-100">
                    Accept
                  </span>
                </div>
                <div className="relative group">
                  <button onClick={() => remove(p.id, false)}
                    className="p-1 rounded-full border border-red-600 hover:bg-red-600 hover:text-black transition"
                    title="Reject"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-gray-200 px-2 rounded opacity-0 group-hover:opacity-100">
                    Reject
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        <hr className="border-gray-700 my-2" />

        {/* Friends List */}
        <div className="px-2 text-sm font-semibold text-gray-400 text-left">
          {open ? 'Friends' : 'FR'}
        </div>
        {friends.map(f => (
          <div key={f.id} className="flex items-center justify-between">
            <Link href={`/profile/${f.id}`} className="flex items-center gap-2">
              <img
                src={f.avatar_url || '/default-avatar.png'}
                alt=""
                className="w-6 h-6 rounded-full"
              />
              {open && <span className="text-sm">{f.display_name}</span>}
            </Link>
            {open && (
              <div className="flex gap-1">
                <div className="relative group">
                  <button
                    className="p-1 rounded-full border border-emerald-600 hover:bg-emerald-600 hover:text-black transition"
                    title="Invite to Party"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-gray-200 px-2 rounded opacity-0 group-hover:opacity-100">
                    Invite
                  </span>
                </div>
                <div className="relative group">
                  <button onClick={() => remove(f.id, true)}
                    className="p-1 rounded-full border border-red-600 hover:bg-red-600 hover:text-black transition"
                    title="Unfriend"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-gray-200 px-2 rounded opacity-0 group-hover:opacity-100">
                    Unfriend
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
