"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import AuthForm from "@/components/AuthForm";
import FAQSection from "@/components/FAQSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.push("/play");
      } else {
        setUser(null);
      }
    };
    getUser();
  }, [router]);

  if (user) return null;

  return (
    <>
      <Navbar user={user} />
      <main className="bg-gradient-to-br from-white via-emerald-700 to-black min-h-screen flex flex-col items-center justify-center p-8 space-y-6">
        <Image src="/logo_big.png" alt="SatQuest Logo" width={300} height={150} className="mx-auto mt-12" />
        <p className="text-6xl text-white text-center">Explore From Above!</p>
        <p className="text-white text-center w-2/3">
          SatQuest is an exciting geography-based guessing game that tests your ability to recognize locations from satellite images.
        </p>
        <AuthForm />
        <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
        <FAQSection />
      </main>
    </>
  );
}
