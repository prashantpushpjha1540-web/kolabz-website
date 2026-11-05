"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setMessage("Please verify your email before logging in.");
      } else {
        setMessage(error.message);
      }

      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#05050d] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="text-4xl font-bold">
            Kolab<span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Z</span>
          </Link>

          <h1 className="text-3xl font-bold mt-8">
            Welcome back 👋
          </h1>

          <p className="text-white/50 mt-2">
            Login to continue to KolabZ
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">

          {/* Email */}
          <label className="block text-sm text-white/70 mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-pink-500"
          />

          {/* Password */}
          <label className="block text-sm text-white/70 mb-2 mt-5">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-pink-500"
          />

          {/* Forgot Password */}
          <div className="text-right mt-3">
            <Link
              href="/forgot-password"
              className="text-sm text-pink-400 hover:text-pink-300"
            >
              Forgot password?
            </Link>
          </div>

          {/* Message */}
          {message && (
            <p className="mt-4 text-sm text-center text-white/80">
              {message}
            </p>
          )}

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-3 font-semibold transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In →"}
          </button>

          {/* Signup */}
          <p className="text-center text-sm text-white/50 mt-6">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-pink-400 hover:text-pink-300 font-medium"
            >
              Sign Up
            </Link>
          </p>

        </div>

        {/* Back */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-white/40 hover:text-white"
          >
            ← Back to KolabZ
          </Link>
        </div>

      </div>
    </main>
  );
}