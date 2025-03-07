"use client";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar({ user }: { user: any }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Refresh page to reflect logout
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-lg shadow-md px-6 py-3 flex justify-between items-center">
      <Image src="/logo_big.png" alt="Logo" width={120} height={40} />
      
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
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-bla" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          )}
        </div>
      ) : null}
    </nav>
  );
}
