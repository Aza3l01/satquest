"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";

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
      <main className="mt-16 p-4 flex flex-col items-center">
        {!user && (
          <>
            <h1 className="text-3xl font-bold">SatQuest</h1>
            <p className="text-lg text-gray-700 mb-6">
              A satellite imagery geography guessing game!
            </p>
          </>
        )}
        {user ? <GameModeSelection /> : <AuthForm />}
      </main>
    </>
  );
}

const GameModeSelection = () => (
  <div>
    <h1 className="text-2xl font-bold">Select Your Game Mode</h1>
    <p>Game mode options will go here.</p>
  </div>
);