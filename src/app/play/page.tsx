"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";

export default function PlayPage() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTab, setSelectedTab] = useState<"singleplayer" | "multiplayer" | "custom">("singleplayer");
  const [selectedSubTab, setSelectedSubTab] = useState<"world">("world");

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
        
        {/* Main Tabs */}
        <div className="flex space-x-8 mb-8">
          {["singleplayer", "multiplayer", "custom"].map((tab) => (
            <button
              key={tab}
              className={`text-2xl font-bold pb-2 transition-all ${
                selectedTab === tab
                  ? "border-b-4 border-emerald-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setSelectedTab(tab as "singleplayer" | "multiplayer" | "custom")}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Sub-tabs for "Singleplayer" */}
        {selectedTab === "singleplayer" && (
          <div className="flex space-x-8 mb-6">
            {["world"].map((subTab) => (
              <button
                key={subTab}
                className={`text-lg font-semibold pb-2 transition-all ${
                  selectedSubTab === subTab
                    ? "border-b-4 border-emerald-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setSelectedSubTab(subTab as "world")}
              >
                {subTab.charAt(0).toUpperCase() + subTab.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* User Info Container */}
        <div className="flex flex-col items-center bg-black/30 p-6 rounded-lg shadow-lg backdrop-blur-lg w-64 text-white">
          <p className="text-lg font-semibold">{user?.email || "Guest"}</p>
        </div>

        {/* Play Button */}
        <button className="mt-6 px-6 py-3 bg-emerald-500 text-white text-lg font-bold rounded-lg shadow-md hover:bg-emerald-600 transition">
          Play
        </button>

      </main>
    </>
  );
}
