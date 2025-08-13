'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Password updated! Redirecting...')
      setTimeout(() => router.push('/signin'), 2000)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="p-6 bg-black/10 backdrop-blur-md rounded max-w-md w-full text-white shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Reset Your Password</h2>

        <input
          className="w-full mb-3 p-2.5 rounded bg-black/20 text-white border border-gray-600"
          placeholder="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          className="w-full mb-3 p-2.5 rounded bg-black/20 text-white border border-gray-600"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded mt-2"
          onClick={handleUpdate}
        >
          Update Password
        </button>

        {message && <p className="text-sm text-emerald-300 mt-3 text-center">{message}</p>}
      </div>
    </div>
  )
}