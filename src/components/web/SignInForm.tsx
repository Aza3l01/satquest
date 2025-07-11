'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [isResetting, setIsResetting] = useState(false)
  const router = useRouter()

  const handleOAuthLogin = async (provider: 'google' | 'discord') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider })
    if (error) setMessage(error.message)
  }

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else router.push('/play')
  }

  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    })
    if (error) setMessage(error.message)
    else setMessage('Check your email for a password reset link.')
  }

  return (
    <div className="p-6 bg-white/20 backdrop-blur-md rounded max-w-md w-full">
      <h2 className="text-white text-xl font-bold mb-4 text-center">Sign In</h2>

      <button
        onClick={() => handleOAuthLogin('google')}
        className="w-full mb-2 p-2 rounded bg-gray-800 text-white hover:bg-gray-700"
      >
        Continue with Google
      </button>
      <button
        onClick={() => handleOAuthLogin('discord')}
        className="w-full mb-4 p-2 rounded bg-gray-800 text-white hover:bg-gray-700"
      >
        Continue with Discord
      </button>

      <div className="border-t border-gray-500 mb-4"></div>

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
        Don’t have an account?{' '}
        <a href="/" className="text-emerald-400 underline">Sign up</a>
      </p>

      {message && <p className="text-sm text-emerald-300 mt-2 text-center">{message}</p>}
    </div>
  )
}
