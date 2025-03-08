"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js"; // Import User type
import Navbar from "@/components/Navbar";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  return (
    <>
      <Navbar />
      <main className="mt-16 p-4 flex flex-col items-center">
        {user ? <GameModeSelection /> : <AuthPage setEmail={setEmail} setPassword={setPassword} email={email} password={password} />}
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

const AuthPage = ({ setEmail, setPassword, email, password }: { setEmail: React.Dispatch<React.SetStateAction<string>>; setPassword: React.Dispatch<React.SetStateAction<string>>; email: string; password: string }) => {
  const handleOAuthLogin = async (provider: "google" | "apple" | "facebook") => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) alert(error.message);
  };

  const handleEmailSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email for a confirmation link!");
  };

  const handleForgotPassword = async () => {
    if (!email) return alert("Enter your email to reset password");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) alert(error.message);
    else alert("Password reset email sent!");
  };

  return (
    <div className="max-w-md w-full p-6 bg-white/30 shadow-lg rounded-lg">
      <h1 className="text-xl font-bold mb-4">Sign Up To Play!</h1>
      
      <div className="flex flex-col gap-2">
        <button className="bg-gray-100 p-2 rounded" onClick={() => handleOAuthLogin("google")}>Continue with Google</button>
        <button className="bg-gray-100 p-2 rounded" onClick={() => handleOAuthLogin("apple")}>Continue with Apple</button>
        <button className="bg-gray-100 p-2 rounded" onClick={() => handleOAuthLogin("facebook")}>Continue with Facebook</button>
      </div>

      <div className="my-4 border-t border-gray-300"></div>

      <input type="text" placeholder="Username" className="w-full p-2 border rounded my-1" />
      <input type="email" placeholder="Email" className="w-full p-2 border rounded my-1" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="w-full p-2 border rounded my-1" value={password} onChange={(e) => setPassword(e.target.value)} />
      
      <a href="#" className="text-blue-500 text-sm" onClick={handleForgotPassword}>Forgot Password?</a>

      <button className="mt-4 w-full bg-blue-500 text-white p-2 rounded" onClick={handleEmailSignUp}>Sign Up</button>

      <p className="text-xs mt-2 text-gray-500">
        By signing up, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
      </p>
    </div>
  );
};