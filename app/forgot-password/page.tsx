"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "If an account exists with this email, we've sent a password reset link."
    );

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#05050d] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <Link href="/" className="text-4xl font-bold">
            Kolab<span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Z</span>
          </Link>

          <h1 className="text-3xl font-bold mt-8">
            Forgot your password?
          </h1>

          <p className="text-white/50 mt-2">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">

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

          {message && (
            <p className="mt-4 text-sm text-center text-white/80">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="w-full mt-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-3 font-semibold transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link →"}
          </button>

          <p className="text-center text-sm text-white/50 mt-6">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-pink-400 hover:text-pink-300 font-medium"
            >
              Log In
            </Link>
          </p>

        </div>

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