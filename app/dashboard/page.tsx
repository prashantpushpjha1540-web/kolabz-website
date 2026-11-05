"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // 1. Check logged-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        console.log("AUTH USER:", user);
        console.log("AUTH ERROR:", userError);

        if (userError || !user) {
          router.replace("/login");
          return;
        }

        // 2. Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, role")
          .eq("id", user.id)
          .maybeSingle();

        console.log("USER ID:", user.id);
        console.log("PROFILE:", profile);
        console.log("PROFILE ERROR:", profileError);

        if (profileError) {
          console.error(
            "PROFILE ERROR MESSAGE:",
            profileError.message
          );

          setLoading(false);
          return;
        }

        if (!profile) {
          console.error(
            "NO PROFILE FOUND FOR USER:",
            user.id
          );

          setLoading(false);
          return;
        }

        // 3. Redirect according to account type
        if (profile.role === "creator") {
          router.replace("/dashboard/creator");
          return;
        }

        if (profile.role === "brand") {
          router.replace("/dashboard/brand");
          return;
        }

        console.error("UNKNOWN ROLE:", profile.role);
        setLoading(false);

      } catch (error) {
        console.error("DASHBOARD ERROR:", error);
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#05050d] text-white flex items-center justify-center">
        <p className="text-white/60">
          Loading your dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05050d] text-white flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold">
          Unable to load your profile
        </h1>

        <p className="text-white/50 mt-2">
          Please try logging in again.
        </p>

        <button
          onClick={() => router.replace("/login")}
          className="mt-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 font-semibold"
        >
          Back to Login
        </button>
      </div>
    </main>
  );
}