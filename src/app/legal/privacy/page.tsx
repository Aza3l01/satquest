'use client'

import SiteFooter from '@/components/web/Footer'

const Privacy = () => {
  return (
    <main
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: "url('/bg2.jpg')" }}
    >
      <div className="flex-grow px-6 py-16 max-w-3xl w-full mx-auto">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy for SatQuest</h1>
        <p className="text-sm text-white/70 mb-6">Last Updated: 2025/08/03</p>

        <p className="mb-4">
          SatQuest ("the Game") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information. By using SatQuest, you agree to the terms outlined here.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Data Collection</h2>
        <ul className="list-disc list-inside space-y-1 text-white/90 text-sm">
          <li>Supabase User ID and authentication metadata.</li>
          <li>Profile data (username, avatar URL, optional display name).</li>
          <li>Game statistics (scores, accuracy, game mode, and timestamps).</li>
          <li>Friend connections and game history.</li>
          <li>Premium status and linked Ko-fi email (if applicable).</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">2. Data Usage</h2>
        <ul className="list-disc list-inside space-y-1 text-white/90 text-sm">
          <li>Improve gameplay experience and personalized feedback.</li>
          <li>Enable social features like friend lists and multiplayer lobbies.</li>
          <li>Track progress, achievements, and leaderboards.</li>
          <li>Manage premium features if you’ve donated via Ko-fi.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">3. Data Retention</h2>
        <ul className="list-disc list-inside space-y-1 text-white/90 text-sm">
          <li>Data is stored securely in Supabase.</li>
          <li>You may request full deletion of your account and data by contacting support.</li>
          <li>Non-identifying gameplay statistics may be retained anonymously for analytics.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. Age Requirements</h2>
        <p className="text-white/90 text-sm mb-4">
          You must be at least 13 years old to use SatQuest. We do not knowingly collect personal information from children under 13.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">5. Policy Updates</h2>
        <p className="text-white/90 text-sm mb-4">
          This policy may be updated periodically. Changes will be announced on the official site or the socials found below. Continued use of the platform indicates acceptance.
        </p>
      </div>

      <div className="px-6 pb-4 pt-2">
        <SiteFooter />
      </div>
    </main>
  )
}

export default Privacy
