"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setReady(true);
      } else {
        setMessage("This password reset link is invalid or has expired.");
      }
    };

    checkSession();
  }, []);

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      setMessage("Please enter and confirm your new password.");
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
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Password updated successfully! 🎉");

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#05050d] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <Link href="/" className="text-4xl font-bold">
            Kolab<span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Z</span>
          </Link>

          <h1 className="text-3xl font-bold mt-8">
            Create a new password
          </h1>

          <p className="text-white/50 mt-2">
            Choose a strong password for your KolabZ account.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">

          {!ready ? (
            <p className="text-center text-sm text-white/70">
              {message || "Checking reset link..."}
            </p>
          ) : (
            <>
              <label className="block text-sm text-white/70 mb-2">
                New Password
              </label>

              <div className="relative mb-3">
  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Enter new password"
    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 pr-12 text-white outline-none placeholder:text-white/30 focus:border-pink-500"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white/80"
  >
    {showPassword ? "🙈" : "👁️"}
  </button>
</div>

              <div className="relative">
  <input
    type={showConfirmPassword ? "text" : "password"}
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    placeholder="Confirm new password"
    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 pr-12 text-white outline-none placeholder:text-white/30 focus:border-pink-500"
  />

  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white/80"
  >
    {showConfirmPassword ? "🙈" : "👁️"}
  </button>
</div>

              {message && (
                <p className="mt-4 text-sm text-center text-white/80">
                  {message}
                </p>
              )}

              <button
                type="button"
                onClick={handleUpdatePassword}
                disabled={loading}
                className="w-full mt-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-3 font-semibold transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password →"}
              </button>
            </>
          )}

        </div>

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-sm text-white/40 hover:text-white"
          >
            ← Back to Login
          </Link>
        </div>

      </div>
    </main>
  );
}