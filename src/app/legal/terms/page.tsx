'use client'

import SiteFooter from '@/components/web/Footer'

const Terms = () => {
  return (
    <main
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: "url('/bg2.jpg')" }}
    >
      <div className="flex-grow px-6 py-16 max-w-3xl w-full mx-auto">
        <h1 className="text-3xl font-bold mb-2">Terms of Service for SatQuest</h1>
        <p className="text-sm text-white/70 mb-6">Last Updated: 2025/08/03</p>

        <p className="mb-4">
          These Terms of Service ("Terms") govern your access to and use of SatQuest ("the Game"). By using SatQuest, you agree to these Terms.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Use of the Game</h2>
        <ul className="list-disc list-inside space-y-1 text-white/90 text-sm">
          <li>You may use the game for personal, non-commercial purposes.</li>
          <li>You agree not to exploit, reverse-engineer, or manipulate the game.</li>
          <li>Abuse, cheating, or harassment may result in suspension.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">2. Accounts and Data</h2>
        <ul className="list-disc list-inside space-y-1 text-white/90 text-sm">
          <li>You are responsible for your Supabase-authenticated account.</li>
          <li>You may request account deletion at any time.</li>
          <li>We reserve the right to suspend or terminate inactive or abusive accounts.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">3. Premium Access</h2>
        <ul className="list-disc list-inside space-y-1 text-white/90 text-sm">
          <li>Premium features may be unlocked via Ko-fi donations or special events.</li>
          <li>Premium is non-transferable and tied to your verified email.</li>
          <li>No refunds are guaranteed unless explicitly stated.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. Disclaimer</h2>
        <p className="text-white/90 text-sm mb-4">
          SatQuest is offered “as is.” We make no guarantees about availability, accuracy, or performance. Your use is at your own risk.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">5. Updates and Changes</h2>
        <p className="text-white/90 text-sm mb-4">
          We may modify these Terms at any time. Continued use after changes means you accept the updated terms.
        </p>
      </div>

      
      <div className="px-6 pb-4 pt-2">
        <SiteFooter />
      </div>
    </main>
  )
}

export default Terms
