'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { FaGoogle, FaDiscord, FaGithub, FaTwitch, FaTwitter, FaSpotify } from 'react-icons/fa'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [isResetting, setIsResetting] = useState(false)
  const router = useRouter()

  const handleOAuthLogin = async (
    provider: 'google' | 'discord' | 'github' | 'twitch' | 'twitter' | 'spotify'
  ) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider })
    if (error) setMessage(error.message)
  }

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else router.push('/')
  }

  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    })
    if (error) setMessage(error.message)
    else setMessage('Check your email for a password reset link.')
  }

  return (
    <div className="p-6 bg-black/10 backdrop-blur-md rounded max-w-md w-full text-white shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Welcome Back!</h2>

      <div className="flex justify-center gap-5 mb-4">
        <button
          onClick={() => handleOAuthLogin('google')}
          className="p-3 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Sign in with Google"
        >
          <FaGoogle className="h-6 w-6" />
        </button>
        <button
          onClick={() => handleOAuthLogin('discord')}
          className="p-3 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Sign in with Discord"
        >
          <FaDiscord className="h-6 w-6" />
        </button>
        <button
          onClick={() => handleOAuthLogin('github')}
          className="p-3 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Sign in with GitHub"
        >
          <FaGithub className="h-6 w-6" />
        </button>
        <button
          onClick={() => handleOAuthLogin('twitch')}
          className="p-3 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Sign in with Twitch"
        >
          <FaTwitch className="h-6 w-6" />
        </button>
        <button
          onClick={() => handleOAuthLogin('twitter')}
          className="p-3 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Sign in with Twitter"
        >
          <FaTwitter className="h-6 w-6" />
        </button>
        <button
          onClick={() => handleOAuthLogin('spotify')}
          className="p-3 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Sign in with Spotify"
        >
          <FaSpotify className="h-6 w-6" />
        </button>
      </div>

      <div className="border-t border-gray-500 mb-4" />

      <input
        className="w-full mb-2 p-2 rounded bg-black/20 text-white border"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {!isResetting && (
        <input
          className="w-full mb-2 p-2 rounded bg-black/20 text-white border"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}

      {isResetting ? (
        <button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded mt-2"
          onClick={handleForgotPassword}
        >
          Send Reset Link
        </button>
      ) : (
        <>
          <button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded mt-2"
            onClick={handleLogin}
          >
            Sign In
          </button>
          <p
            className="text-sm text-emerald-400 text-center mt-2 cursor-pointer"
            onClick={() => setIsResetting(true)}
          >
            Forgot Password?
          </p>
        </>
      )}

      <p className="text-xs text-white mt-4 text-center">
        Don&apos;t have an account?{' '}
        <a href="/" className="text-emerald-400 underline">Sign up</a>
      </p>

      {message && <p className="text-sm text-emerald-300 mt-2 text-center">{message}</p>}
    </div>
  )
}