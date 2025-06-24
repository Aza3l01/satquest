import SignUpForm from '@/components/web/SignUpForm'

export default function HomePage() {
  return (
    <main className="min-h-screen text-white p-6 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold font-mono text-emerald-300 drop-shadow-md">SatQuest</h1>
        <h2 className="text-3xl font-bold mt-2">Explore From Above!</h2>
        <p className="text-md text-gray-200 mt-2 max-w-lg mx-auto">
          SatQuest is a geography guessing game that tests your ability to recognize locations from satellite images.
        </p>
      </div>
      <SignUpForm />
    </main>
  )
}
