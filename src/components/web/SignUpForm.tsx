'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { FaGoogle, FaDiscord, FaGithub, FaTwitch, FaTwitter, FaSpotify } from 'react-icons/fa'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSignup = async () => {
    if (!email || !password) {
      setMessage('Please fill in all fields.')
      return
    }

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Check your email to confirm your account :)')
  }

  const handleOAuthLogin = async (
    provider: 'google' | 'discord' | 'github' | 'twitch' | 'twitter' | 'spotify'
  ) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider })
    if (error) setMessage(error.message)
  }

  return (
    <div className="p-6 bg-black/10 backdrop-blur-md rounded max-w-md w-full text-white shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Sign Up To Play For Free!</h2>

      <div className="flex justify-center gap-5 mb-4">
        <button
          onClick={() => handleOAuthLogin('google')}
          className="p-3 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Sign up with Google"
        >
          <FaGoogle className="h-6 w-6" />
        </button>
        <button
          onClick={() => handleOAuthLogin('discord')}
          className="p-3 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Sign up with Discord"
        >
          <FaDiscord className="h-6 w-6" />
        </button>
        <button
          onClick={() => handleOAuthLogin('github')}
          className="p-3 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Sign up with GitHub"
        >
          <FaGithub className="h-6 w-6" />
        </button>
        <button
          onClick={() => handleOAuthLogin('twitch')}
          className="p-3 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Sign up with Twitch"
        >
          <FaTwitch className="h-6 w-6" />
        </button>
        <button
          onClick={() => handleOAuthLogin('twitter')}
          className="p-3 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Sign up with Twitter"
        >
          <FaTwitter className="h-6 w-6" />
        </button>
        <button
          onClick={() => handleOAuthLogin('spotify')}
          className="p-3 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Sign up with Spotify"
        >
          <FaSpotify className="h-6 w-6" />
        </button>
      </div>

      <div className="border-t border-gray-500 my-4" />

      <input
        className="w-full mb-2 p-2 rounded bg-black/20 text-white border"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 rounded bg-black/20 text-white border"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded mt-2"
        onClick={handleSignup}
      >
        Sign Up
      </button>

      <p className="text-xs text-gray-200 mt-2 text-center">
        Already have an account?{' '}
        <a href="/signin" className="text-emerald-400 underline">Sign In</a>
      </p>

      {message && <p className="text-sm text-emerald-300 mt-3 text-center">{message}</p>}
    </div>
  )
}