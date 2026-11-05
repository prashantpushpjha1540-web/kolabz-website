"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [accountType, setAccountType] = useState<"creator" | "brand">(
    "creator"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setMessage("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          account_type: accountType,
          name: name.trim(),
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setMessage(
        "Account created successfully! Please check your email to verify your account."
      );
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#05050d] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold">
            Kolab<span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Z</span>
          </Link>

          <h1 className="text-3xl font-bold mt-8">
            Create your account
          </h1>

          <p className="text-white/50 mt-2">
            Join KolabZ and start collaborating.
          </p>
        </div>

        {/* Signup Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">

          {/* Account Type */}
          <label className="block text-sm text-white/70 mb-3">
            I am a...
          </label>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setAccountType("creator")}
              className={`rounded-xl border px-4 py-4 text-sm font-semibold transition ${
                accountType === "creator"
                  ? "border-blue-500 bg-blue-500/15 text-blue-400"
                  : "border-white/10 bg-black/20 text-white/60 hover:border-white/30"
              }`}
            >
              👤 Creator
            </button>

            <button
              type="button"
              onClick={() => setAccountType("brand")}
              className={`rounded-xl border px-4 py-4 text-sm font-semibold transition ${
                accountType === "brand"
                  ? "border-blue-500 bg-blue-500/15 text-blue-400"
                  : "border-white/10 bg-black/20 text-white/60 hover:border-white/30"
              }`}
            >
              🏢 Brand
            </button>
          </div>

          {/* Name */}
          <label className="block text-sm text-white/70 mb-2">
            {accountType === "creator" ? "Full Name" : "Brand Name"}
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={
              accountType === "creator"
                ? "Enter your full name"
                : "Enter your brand name"
            }
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-pink-500"
          />

          {/* Email */}
          <label className="block text-sm text-white/70 mb-2 mt-5">
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
            placeholder="Create a password"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-pink-500"
          />

          {/* Confirm Password */}
          <label className="block text-sm text-white/70 mb-2 mt-5">
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-pink-500"
          />

          {/* Message */}
          {message && (
            <p className="mt-4 text-sm text-center text-white/80">
              {message}
            </p>
          )}

          {/* Create Account */}
          <button
            type="button"
            onClick={handleSignup}
            disabled={loading}
            className="w-full mt-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-3 font-semibold transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>

          {/* Login */}
          <p className="text-center text-sm text-white/50 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Log In
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