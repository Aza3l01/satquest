'use client'

import { useRouter } from 'next/navigation'
import NavBar from '@/components/web/NavBar'
import FriendsSlider from '@/components/web/FriendsSlider'

const PlayPage = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white bg ">
      <NavBar />
      <FriendsSlider />
      <main className="p-6 pt-24">
    
        <div className="max-w-2xl mx-auto bg-gray-900 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-emerald-300">Not complete</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => router.push('/play/singleplayer')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-6 rounded-lg transition duration-300 flex flex-col items-center"
            >
              <span className="text-xl font-bold">Singleplayer</span>
              <span className="text-sm mt-2 text-gray-300">solo</span>
            </button>

            <button
              className="bg-gray-800 text-gray-400 py-4 px-6 rounded-lg cursor-not-allowed flex flex-col items-center"
              disabled
            >
              <span className="text-xl font-bold">Multiplayer</span>
              <span className="text-sm mt-2">In development</span>
            </button>

            <button
              className="bg-gray-800 text-gray-400 py-4 px-6 rounded-lg cursor-not-allowed flex flex-col items-center"
              disabled
            >
              <span className="text-xl font-bold">Party Mode</span>
              <span className="text-sm mt-2">In development</span>
            </button>

            <button
              className="bg-gray-800 text-gray-400 py-4 px-6 rounded-lg cursor-not-allowed flex flex-col items-center"
              disabled
            >
              <span className="text-xl font-bold">Tournaments</span>
              <span className="text-sm mt-2">In development</span>
            </button>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-800">
            <h3 className="text-xl font-semibold mb-4">Announcements</h3>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-emerald-400">🎉 New locations blah blah</p>
              <p className="mt-2 text-gray-300">blah blah</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PlayPage