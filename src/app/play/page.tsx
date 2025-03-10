"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";

export default function PlayPage() {
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
        <h1 className="text-4xl font-bold mb-6">Welcome to Play Mode!</h1>
        <p className="text-lg">Start your game and explore the world.</p>
      </main>
    </>
  );
}
