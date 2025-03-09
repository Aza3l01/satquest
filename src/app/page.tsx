"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  return (
    <>
      <Navbar user={user} />
      <main className="bg-gradient-to-br from-white via-emerald-700 to-black min-h-screen flex flex-col items-center justify-center p-8 space-y-6">
        {!user ? (
          <>
            <Image src="/logo_big.png" alt="SatQuest Logo" width={300} height={150} className="mx-auto mt-12" />
            <p className="text-6xl text-white text-center">
              Explore From Above!
            </p>
            <p className="text-white text-center w-2/3">
              SatQuest is an exciting geography-based guessing game that tests your ability to recognize locations from satellite images.
            </p>
            <p className="text-white text-center w-2/3">
              Explore stunning aerial imagery, guess locations, and challenge yourself in various game modes. Compete with friends, sharpen your geography skills, and see how well you know the world!
            </p>
            {/* <Image src="/intro.gif" alt="Gameplay Preview" width={400} height={200} className="rounded-lg" /> */}
            <AuthForm />
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
            <FAQSection />
          </>
        ) : (
          <GameModeSelection />
        )}
      </main>
    </>
  );
}

const GameModeSelection = () => (
  <div className="text-white">
    <h1 className="text-2xl font-bold">Select Your Game Mode</h1>
  </div>
);
