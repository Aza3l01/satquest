"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export default function PremiumPage() {
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
        <h1 className="text-4xl font-bold mb-6">Go Premium!</h1>
        <p className="text-lg text-center max-w-2xl mb-6">
          Unlock exclusive features, get premium game modes, and enjoy an ad-free experience!
        </p>
        <button className="px-6 py-3 bg-emerald-500 text-white rounded-lg shadow-md hover:bg-emerald-600">
          Upgrade Now
        </button>
      </main>
    </>
  );
}
