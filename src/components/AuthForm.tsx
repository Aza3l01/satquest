"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const handleOAuthLogin = async (provider: "google" | "discord") => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) alert(error.message);
  };

  const handleEmailAuth = async () => {
    if (!email || !password) return alert("Please fill in all fields.");
    let error;
    if (isLogin) {
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
    } else {
      ({ error } = await supabase.auth.signUp({ email, password }));
    }
    if (error) alert(error.message);
    else alert(isLogin ? "Logged in successfully!" : "Check your email for a confirmation link!");
  };

  const handleForgotPassword = async () => {
    if (!email) return alert("Enter your email to reset password");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) alert(error.message);
    else alert("Password reset email sent!");
  };

  return (
    <div className="max-w-md w-full p-6 bg-white/30 backdrop-blur-lg shadow-lg rounded-lg">
      <h1 className="text-xl font-bold mb-4 text-center text-white">{isLogin ? "Sign In" : "Sign Up"} To Play!</h1>

      <button 
        className="bg-gray-800 p-2 rounded w-full mb-2 cursor-pointer text-white" 
        onClick={() => handleOAuthLogin("google")}
      >
        Continue with Google
      </button>

      <button 
        className="bg-gray-800 p-2 rounded w-full mb-2 cursor-pointer text-white" 
        onClick={() => handleOAuthLogin("discord")}
      >
        Continue with Discord
      </button>

      <div className="my-4 border-t border-gray-500"></div>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border border-gray-500 bg-black/20 text-white rounded my-1"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border border-gray-500 bg-black/20 text-white rounded my-1"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {isLogin && (
        <a href="#" className="text-emerald-400 text-sm" onClick={handleForgotPassword}>
          Forgot Password?
        </a>
      )}

      <button
        className="mt-4 w-full bg-emerald-500 text-white p-2 rounded cursor-pointer hover:bg-emerald-600"
        onClick={handleEmailAuth}
      >
        {isLogin ? "Sign In" : "Sign Up"}
      </button>

      <p className="text-xs mt-2 text-gray-300">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <a href="#" className="underline text-emerald-400" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign Up" : "Sign In"}
        </a>
      </p>
    </div>
  );
}