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
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white/20 backdrop-blur-md rounded max-w-md w-full">
        <h2 className="text-xl font-bold text-white text-center mb-4">Reset Your Password</h2>

        <input
          className="w-full mb-2 p-2 rounded bg-black/20 text-white border"
          placeholder="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          className="w-full mb-2 p-2 rounded bg-black/20 text-white border"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded mt-2"
          onClick={handleUpdate}
        >
          Update Password
        </button>

        {message && <p className="text-sm text-emerald-300 mt-2 text-center">{message}</p>}
      </div>
    </div>
  )
}
