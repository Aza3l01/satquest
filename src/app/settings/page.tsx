'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { getProfile, updateProfile } from '@/lib/profile'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/web/NavBar'

interface User {
  id: string
  email?: string
}

interface Profile {
  display_name: string
  avatar_url: string | null
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data, error: sessionError } = await supabase.auth.getUser()
      if (sessionError || !data.user) {
        router.replace('/signin')
        return
      }

      const u = data.user
      setUser({ id: u.id, email: u.email ?? undefined })

      const p = await getProfile(u.id)
      if (p) {
        setProfile(p)
        setDisplayName(p.display_name)
        setAvatarUrl(p.avatar_url ?? '')
      }

      setLoading(false)
    }

    fetchData()
  }, [router])

  const handleRemoveAvatar = async () => {
    if (!user) return
    setError(''); setSuccess('')
    // Cast null to any so TS allows it
    const { error: updateError } = await updateProfile(user.id, {
      avatar_url: null as any
    })
    if (updateError) {
      setError('Failed to remove avatar.')
    } else {
      setAvatarUrl('')
      setProfile(p => p ? { ...p, avatar_url: null } : p)
      setSuccess('Avatar removed.')
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  const handleUpdateName = async () => {
    if (!user) return
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(displayName)) {
      setError('Display name must be 3–20 characters, letters/numbers/_/- only.')
      return
    }
    setError(''); setSuccess('')
    const { error: updateError } = await updateProfile(user.id, {
      display_name: displayName
    })
    if (updateError) {
      setError('Failed to update display name.')
    } else {
      setProfile(p => p ? { ...p, display_name: displayName } : p)
      setSuccess('Display name updated!')
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-10 space-y-16">

        {/* Profile Info */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-emerald-400 border-b border-gray-700 pb-2">
            Profile Info
          </h2>

          <div className="flex items-center gap-6">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500"
              />
            ) : (
              <div className="bg-emerald-600 rounded-full w-24 h-24 flex items-center justify-center border-4 border-emerald-500">
                <span className="text-3xl font-bold">
                  {displayName.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}

            <button
            onClick={handleRemoveAvatar}
            className="relative group bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded-lg"
            >
            Remove Avatar
            {/* ← Add this span right here: */}
            <span className="absolute left-1/2 top-full mt-2 w-134 -translate-x-1/2 rounded bg-gray-800 border border-gray-700 p-2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                Avatars will become cosmetic items in a future update so you can only remove them for privacy.
            </span>
            </button>

          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="bg-gray-800 px-3 py-2 rounded-lg flex-grow"
            />
            <button
              onClick={handleUpdateName}
              className="bg-emerald-600 hover:bg-emerald-500 text-sm px-4 py-2 rounded-lg"
            >
              Update Name
            </button>
          </div>
        </section>

        {/* Privacy (placeholder) */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-emerald-400 border-b border-gray-700 pb-2">
            Privacy
          </h2>
          <p className="text-gray-400">
            You’ll be able to toggle private profiles and streaming mode here in a future update :)
          </p>
        </section>

        {/* Danger Zone → Discord link */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-500 border-b border-gray-700 pb-2">
            Danger Zone
          </h2>
          <p className="text-gray-400">
            To delete your account, join our Discord and request deletion (will include a button to delete in a future update).
          </p>
          <a
            href="https://discord.gg/2bQU7xAdnP"
            target="_blank"
            rel="noopener"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Join Discord
          </a>
        </section>

        {/* Feedback */}
        {(error || success) && (
          <div className="space-y-2">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-400">{success}</p>}
          </div>
        )}

      </div>
    </div>
  )
}
