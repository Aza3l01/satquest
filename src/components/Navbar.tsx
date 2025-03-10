"use client";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar({ user }: { user: any }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // Function to determine styles for active and hover effects
  const getTabClass = (path: string) =>
    `relative px-4 py-2 rounded-lg transition text-white
     before:absolute before:inset-0 before:rounded-full before:blur-lg 
     ${
       pathname === path
         ? "before:bg-blue-800/30" // Active tab effect
         : "before:bg-transparent hover:before:bg-blue-800/30" // Hover effect
     }`;  

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/30 backdrop-blur-lg shadow-md px-6 py-2 flex justify-between items-center h-14">
      {/* Logo */}
      <Image
        src={user ? "/logo_big.png" : "/logo_small.png"}
        alt="Logo"
        width={user ? 120 : 40}
        height={user ? 40 : 20}
      />

      {user ? (
        <div className="flex items-center space-x-6">
          {/* Friends */}
          <Link href="/friends" className={getTabClass("/friends")}>
            Friends
          </Link>

          {/* Leaderboards */}
          <Link href="/leaderboards" className={getTabClass("/leaderboards")}>
            Leaderboards
          </Link>

          {/* Play (Centered, Links to Home) */}
          <Link href="/" className={`${getTabClass("/")} font-bold text-lg`}>
            Play
          </Link>

          {/* Premium */}
          <Link href="/premium" className={getTabClass("/premium")}>
            Premium
          </Link>

          {/* Shop */}
          <Link href="/shop" className={getTabClass("/shop")}>
            Shop
          </Link>
        </div>
      ) : null}

      {/* User Dropdown */}
      {user ? (
        <div className="relative">
          <button className="text-black font-medium" onClick={() => setDropdownOpen(!dropdownOpen)}>
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
