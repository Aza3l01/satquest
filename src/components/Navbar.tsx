"use client";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar({ user }: { user: any }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-lg shadow-md px-6 py-2 flex justify-between items-center h-14">
      <Image
        src={user ? "/logo_big.png" : "/logo_small.png"}
        alt="Logo"
        width={user ? 120 : 40} 
        height={user ? 40 : 20} 
      />
      {user ? (
        <div className="relative">
          <button
            className="text-black font-medium"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {user.email}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg text-black">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          )}
        </div>
      ) : null}
    </nav>
  );
}
