"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {

  const [activeScreen, setActiveScreen] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

useEffect(() => {
  const interval = setInterval(() => {
    setActiveScreen((prev) => (prev + 1) % 7);
  }, 2500);

  return () => clearInterval(interval);
}, []);

const screens = [
  "Discover",
  "Matches",
  "Projects",
  "Messages",
  "Analytics",
  "Profile",
  "Setting",
];

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const handleWaitlist = async () => {
  if (!email.trim()) {
    setMessage("Please enter your email.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("waitlist")
      .insert([{ email: email.trim() }])
      

    if (error) {
  if (error.code === "23505") {
    setMessage("You're already on the waitlist! 🎉");
    return;
  }

  console.error("SUPABASE ERROR:", error);
  setMessage(
    `Error: ${error.message || error.code || "Unknown Supabase error"}`
  );
  return;
}
    console.log("WAITLIST SUCCESS:", data);

    setMessage("You're on the waitlist! 🎉");
    setEmail("");
  } catch (err) {
    console.log("UNEXPECTED ERROR:", err);
    setMessage("Something went wrong. Please try again.");
  }
};

const handleContactSubmit = async () => {
  if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
    setContactStatus("Please fill in all fields.");
    return;
  }

  setContactStatus("Sending...");

  const { error } = await supabase
    .from("contact_messages")
    .insert([
      {
        name: contactName.trim(),
        email: contactEmail.trim(),
        message: contactMessage.trim(),
      },
    ]);

  if (error) {
    console.error(error);
    setContactStatus("Something went wrong. Please try again.");
    return;
  }

  setContactStatus("Message sent successfully! 🎉");
  setContactName("");
  setContactEmail("");
  setContactMessage("");
};

  return (
    <main className="min-h-screen bg-[#05050d] text-white">
      
      {/* Navbar */}
      <header className="relative mx-auto max-w-[1400px] px-6 py-6 lg:px-12">
        <nav className="flex items-center justify-between">

          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="h-8 w-8">
            <svg
                viewBox="0 0 100 100"
               className="h-full w-full"
               fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
           <defs>
             <linearGradient
               id="kolabz-logo-gradient"
              x1="10"
              y1="15"
              x2="90"
              y2="85"
   gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF4F91" />
        <stop offset="1" stopColor="#9B4DFF" />
      </linearGradient>
    </defs>

    <path
      d="M8 12H92V30L38 70H92V88H8V70L62 30H8V12Z"
      fill="url(#kolabz-logo-gradient)"
    />
  </svg>
</div>

            <span className="text-[22px] font-bold tracking-tight">
              KolabZ
            </span>
          </a>

          {/* Navigation Links */}
          <div className="hidden items-center gap-8 lg:flex">
            <a
              href="#creators"
              className="text-sm text-white/80 transition hover:text-white"
            >
              For Creators
            </a>

            <a
              href="#brands"
              className="text-sm text-white/80 transition hover:text-white"
            >
              For Brands
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-white/80 transition hover:text-white"
            >
              How it Works
            </a>

            <a
              href="#about"
              className="text-sm text-white/80 transition hover:text-white"
            >
              About Us
            </a>

            <a
              href="#pricing"
              className="text-sm text-white/80 transition hover:text-white"
            >
              Pricing
            </a>

          </div>

          {/* Right Side */}
          <div className="hidden items-center gap-7 sm:flex">
            <a
  href="/login"
  className="text-sm font-medium text-white/85 transition hover:text-white"
>
  Log in
</a>

            <a
              href="#waitlist"
              className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-2.5 text-sm font-semibold shadow-[0_0_25px_rgba(168,85,247,0.2)] transition hover:-translate-y-0.5"
            >
              Join Waitlist
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
  type="button"
  onClick={() => setMobileMenuOpen((prev) => !prev)}
  aria-label="Toggle navigation menu"
  aria-expanded={mobileMenuOpen}
  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg text-white transition hover:bg-white/10 sm:hidden"
>
  {mobileMenuOpen ? "✕" : "☰"}
</button>

   {mobileMenuOpen && (
  <div className="absolute right-4 top-full z-50 w-[min(280px,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#0d0a1b]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:hidden">

    <div className="flex flex-col gap-1">

      <a
        href="#creators"
        onClick={() => setMobileMenuOpen(false)}
        className="rounded-xl px-4 py-3 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
      >
        For Creators
      </a>

      <a
        href="#brands"
        onClick={() => setMobileMenuOpen(false)}
        className="rounded-xl px-4 py-3 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
      >
        For Brands
      </a>

      <a
        href="#how-it-works"
        onClick={() => setMobileMenuOpen(false)}
        className="rounded-xl px-4 py-3 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
      >
        How it Works
      </a>

      <a
        href="#about"
        onClick={() => setMobileMenuOpen(false)}
        className="rounded-xl px-4 py-3 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
      >
        About Us
      </a>

      <a
        href="#pricing"
        onClick={() => setMobileMenuOpen(false)}
        className="rounded-xl px-4 py-3 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
      >
        Pricing
      </a>

      <div className="my-2 border-t border-white/10" />

      <a
        href="/login"
        onClick={() => setMobileMenuOpen(false)}
        className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
      >
        Log in
      </a>

      <a
        href="#waitlist"
        onClick={() => setMobileMenuOpen(false)}
        className="mt-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-3 text-center text-sm font-semibold text-white"
      >
        Join Waitlist →
      </a>

    </div>

  </div>
)}

        </nav>
      </header>

      {/* Hero Section */}
<section className="mx-auto max-w-[1400px] px-6 pb-20 pt-16 lg:px-12 lg:pb-28 lg:pt-20">
  <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">

    {/* Left Content */}
    <div className="max-w-[600px]">

      <div className="mb-7 inline-flex items-center rounded-full border border-pink-500/40 px-3 py-1 text-[9px] font-bold tracking-wide text-pink-400">
        APP COMING SOON
      </div>

      <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[64px]">
        Find the right
        <br />
        <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
          collabs.
        </span>
        <br />
        Grow your influence.
      </h1>

      <p className="mt-7 max-w-[520px] text-lg leading-8 text-white/60">
        Connect with brands that love your content and audience.
      </p>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">

        <a
          href="#waitlist"
          className="flex w-fit items-center justify-between gap-8 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3.5 text-sm font-semibold shadow-[0_10px_35px_rgba(236,72,153,0.2)] transition hover:-translate-y-1"
        >
          I'm a Creator
          <span className="text-lg">→</span>
        </a>

        <a
          href="#waitlist"
          className="flex w-fit items-center justify-between gap-8 rounded-xl border border-pink-500/80 px-5 py-3.5 text-sm font-semibold transition hover:bg-pink-500/10"
        >
          I'm a Brand
          <span className="text-lg">→</span>
        </a>

      </div>

      {/* Waitlist count */}
      <div className="mt-9 flex items-center gap-4">

        <div className="flex pl-2">
          <div className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#05050d] bg-[#9b705d] text-xs font-bold">
            P
          </div>

          <div className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#05050d] bg-[#765d55] text-xs font-bold">
            A
          </div>

          <div className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#05050d] bg-[#b08c72] text-xs font-bold">
            R
          </div>

          <div className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#05050d] bg-[#69577c] text-xs font-bold">
            S
          </div>

          <div className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#05050d] bg-[#9a8068] text-xs font-bold">
            K
          </div>
        </div>

        <p className="text-sm leading-5 text-white/60">
          <strong className="text-white">
            1000+ creators & brands
          </strong>
          <br />
          already joined the waitlist
        </p>

      </div>

    </div>

{/* Right Dashboard */}
<div className="relative">

  {/* Glow */}
  <div className="absolute inset-5 rounded-3xl bg-purple-600/20 blur-[60px]" />

  {/* Dashboard Frame */}
  <div className="relative overflow-hidden rounded-2xl border border-purple-500/70 bg-[#070711] shadow-[0_0_50px_rgba(168,85,247,0.15)]">

    <div className="flex h-[420px] overflow-hidden">

      {/* Sidebar */}
      <div className="hidden w-[105px] shrink-0 border-r border-white/10 p-4 sm:block">

        <div className="mb-7 text-center text-2xl font-black bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
          Z
        </div>

        <div className="space-y-2 text-[9px]">

          {[
            { icon: "🔍", name: "Discover" },
            { icon: "❤️", name: "Matches" },
            { icon: "📁", name: "Projects" },
            { icon: "💬", name: "Messages" },
            { icon: "📊", name: "Analytics" },
            { icon: "👤", name: "Profile" },
            { icon: "⚙️", name: "Settings" },
          ].map((item, index) => (
            <div
              key={item.name}
              className={`rounded-md px-2 py-2 transition-all duration-500 ${
                activeScreen === index
                  ? "bg-pink-500/15 text-white"
                  : "text-white/40"
              }`}
            >
              {item.icon} {item.name}
            </div>
          ))}

        </div>
      </div>

      {/* Dashboard Content */}
      <div className="min-w-0 flex-1 overflow-hidden p-5">

        {/* Top Bar */}
        <div className="flex h-4 items-center justify-end gap-5 text-white/70">

          {/* Notification */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 21h4"
            />
          </svg>

          {/* Mail */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
          >
            <rect
              x="3"
              y="5"
              width="18"
              height="14"
              rx="2"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m3 7 9 6 9-6"
            />
          </svg>

          {/* Profile */}
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-orange-300 to-purple-500 text-[8px] font-bold text-white">
            P
          </span>

        </div>

        {/* Fixed Screen Area */}
        <div className="mt-5 h-[350px] overflow-hidden">

          {/* ================= DISCOVER ================= */}
          {activeScreen === 0 && (
            <div className="h-full">

              <h2 className="text-lg font-semibold">
                Discover collaborations
              </h2>

              <p className="mt-1 text-[10px] text-white/50">
                Find creators and brands that match your vibe.
              </p>

              {/* Search */}
              <div className="mt-4 rounded-lg border border-white/10 px-3 py-2.5 text-[9px] text-white/40">
                🔍 Search creators, brands or niches...
              </div>

              {/* Filters */}
              <div className="mt-3 flex gap-2">

                {["All", "Instagram", "YouTube", "TikTok"].map(
                  (item, index) => (
                    <span
                      key={item}
                      className={`rounded-full border border-white/10 px-2.5 py-1 text-[8px] ${
                        index === 0
                          ? "bg-white/10 text-white"
                          : "text-white/40"
                      }`}
                    >
                      {item}
                    </span>
                  )
                )}

              </div>

              {/* Creator Cards */}
              <div className="mt-4 grid grid-cols-3 gap-2">

                {[
                  {
                    name: "@wanderwith.png",
                    type: "Travel Creator",
                    followers: "125K",
                    platform: "Instagram",
                    avatar: "W",
                    bg: "from-orange-300 to-pink-400",
                  },
                  {
                    name: "@shotbyarnav",
                    type: "Tech Creator",
                    followers: "98K",
                    platform: "YouTube",
                    avatar: "S",
                    bg: "from-purple-400 to-blue-500",
                  },
                  {
                    name: "@artistically.yours",
                    type: "Lifestyle",
                    followers: "76K",
                    platform: "Instagram",
                    avatar: "A",
                    bg: "from-pink-300 to-purple-400",
                  },
                ].map((creator) => (

                  <div
                    key={creator.name}
                    className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]"
                  >

                    <div
                      className={`flex h-[82px] items-center justify-center bg-gradient-to-br ${creator.bg}`}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/60 bg-black/20 text-xs font-bold">
                        {creator.avatar}
                      </div>
                    </div>

                    <div className="p-2">

                      <p className="truncate text-[8px] font-semibold">
                        {creator.name}
                      </p>

                      <p className="mt-1 text-[7px] text-white/40">
                        {creator.type}
                      </p>

                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[7px] text-white/40">
                          {creator.followers}
                        </span>

                        <span className="text-[7px] text-white/30">
                          {creator.platform}
                        </span>
                      </div>

                      <div className="mt-1 text-[7px] text-green-400">
                        ● Available
                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>
          )}

          {/* ================= MATCHES ================= */}
          {activeScreen === 1 && (
            <div className="h-full">

              <h2 className="text-lg font-semibold">
                Your matches
              </h2>

              <p className="mt-1 text-[10px] text-white/50">
                People and brands that match your profile.
              </p>

              <div className="mt-5 space-y-2">

                {[
                  ["NovaBrand", "92%", "Fashion · Lifestyle"],
                  ["@techwithsam", "87%", "Technology · AI"],
                  ["CreatorHub", "84%", "Travel · Content"],
                ].map((match) => (

                  <div
                    key={match[0]}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-[10px] font-bold">
                        {match[0].charAt(0)}
                      </div>

                      <div>
                        <p className="text-[9px] font-semibold">
                          {match[0]}
                        </p>

                        <p className="mt-1 text-[7px] text-white/40">
                          {match[2]}
                        </p>
                      </div>

                    </div>

                    <span className="rounded-full bg-green-500/10 px-2 py-1 text-[8px] text-green-400">
                      {match[1]} Match
                    </span>

                  </div>

                ))}

              </div>

              <div className="mt-4 rounded-xl border border-pink-500/20 bg-pink-500/5 p-3">
                <p className="text-[9px] font-semibold">
                  ✨ 12 new matches found
                </p>

                <p className="mt-1 text-[7px] text-white/40">
                  Based on your interests and collaboration preferences.
                </p>
              </div>

            </div>
          )}

          {/* ================= PROJECTS ================= */}
          {activeScreen === 2 && (
            <div className="h-full">

              <h2 className="text-lg font-semibold">
                Your projects
              </h2>

              <p className="mt-1 text-[10px] text-white/50">
                Manage your active collaborations.
              </p>

              <div className="mt-5 space-y-2">

                {[
                  ["Summer Creator Campaign", "72%", "In Progress"],
                  ["Tech Product Launch", "45%", "Review"],
                  ["Travel Brand Campaign", "100%", "Completed"],
                ].map((project) => (

                  <div
                    key={project[0]}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >

                    <div className="flex items-center justify-between">

                      <p className="text-[9px] font-semibold">
                        {project[0]}
                      </p>

                      <span className="text-[7px] text-pink-400">
                        {project[2]}
                      </span>

                    </div>

                    <div className="mt-3 h-1.5 rounded-full bg-white/10">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                        style={{ width: project[1] }}
                      />
                    </div>

                    <p className="mt-1 text-right text-[7px] text-white/30">
                      {project[1]} complete
                    </p>

                  </div>

                ))}

              </div>

            </div>
          )}

          {/* ================= MESSAGES ================= */}
          {activeScreen === 3 && (
            <div className="h-full">

              <h2 className="text-lg font-semibold">
                Messages
              </h2>

              <p className="mt-1 text-[10px] text-white/50">
                Stay connected with your collaboration partners.
              </p>

              <div className="mt-5 space-y-2">

                {[
                  ["NovaBrand", "Hey! We'd love to collaborate with you.", "2m"],
                  ["@shotbyarnav", "The campaign looks amazing!", "18m"],
                  ["CreatorHub", "Are you available this week?", "1h"],
                ].map((chat) => (

                  <div
                    key={chat[0]}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >

                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-[10px] font-bold">

                      {chat[0].charAt(0)}

                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#070711] bg-green-400" />

                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex justify-between">

                        <p className="text-[9px] font-semibold">
                          {chat[0]}
                        </p>

                        <span className="text-[7px] text-white/30">
                          {chat[2]}
                        </span>

                      </div>

                      <p className="mt-1 truncate text-[7px] text-white/40">
                        {chat[1]}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>
          )}

          {/* ================= ANALYTICS ================= */}
          {activeScreen === 4 && (
            <div className="h-full">

              <h2 className="text-lg font-semibold">
                Collaboration analytics
              </h2>

              <p className="mt-1 text-[10px] text-white/50">
                Track your performance and growth.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2">

                {[
                  ["128K", "Profile Views", "+18%"],
                  ["24", "Matches", "+12%"],
                  ["12", "Projects", "+24%"],
                  ["87%", "Success Rate", "+8%"],
                ].map((stat) => (

                  <div
                    key={stat[1]}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >

                    <p className="text-lg font-bold">
                      {stat[0]}
                    </p>

                    <p className="mt-1 text-[7px] text-white/40">
                      {stat[1]}
                    </p>

                    <p className="mt-2 text-[7px] text-green-400">
                      ↗ {stat[2]}
                    </p>

                  </div>

                ))}

              </div>

              {/* Mini Graph */}
              <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">

                <div className="flex items-end gap-1.5">

                  {[35, 48, 42, 60, 55, 72, 88, 78, 96].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t bg-gradient-to-t from-purple-600/40 to-pink-400/80"
                        style={{ height: `${height / 2}px` }}
                      />
                    )
                  )}

                </div>

                <p className="mt-2 text-[7px] text-white/30">
                  Collaboration activity — Last 30 days
                </p>

              </div>

            </div>
          )}

          {/* ================= PROFILE ================= */}
          {activeScreen === 5 && (
            <div className="h-full">

              <h2 className="text-lg font-semibold">
                Your profile
              </h2>

              <p className="mt-1 text-[10px] text-white/50">
                Manage your creator identity.
              </p>

              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-300 to-purple-500 text-lg font-bold">
                    P
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Prashu
                    </p>

                    <p className="mt-1 text-[8px] text-white/40">
                      Creator · Technology · AI
                    </p>

                    <p className="mt-1 text-[7px] text-green-400">
                      ● Profile 92% complete
                    </p>
                  </div>

                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 text-center">

                  <div>
                    <p className="text-sm font-bold">
                      24
                    </p>
                    <p className="text-[7px] text-white/40">
                      Matches
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      12
                    </p>
                    <p className="text-[7px] text-white/40">
                      Projects
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      8.7K
                    </p>
                    <p className="text-[7px] text-white/40">
                      Followers
                    </p>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ================= SETTINGS ================= */}
          {activeScreen === 6 && (
            <div className="h-full">

              <h2 className="text-lg font-semibold">
                Settings
              </h2>

              <p className="mt-1 text-[10px] text-white/50">
                Manage your account preferences.
              </p>

              <div className="mt-5 space-y-2">

                {[
                  ["👤", "Account", "Profile and account details"],
                  ["🔔", "Notifications", "Email and activity alerts"],
                  ["🔒", "Privacy", "Control your privacy settings"],
                  ["🔗", "Connected accounts", "Instagram · YouTube · TikTok"],
                  ["⚙️", "Preferences", "Customize your experience"],
                ].map((setting) => (

                  <div
                    key={setting[1]}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >

                    <div className="text-sm">
                      {setting[0]}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold">
                        {setting[1]}
                      </p>

                      <p className="mt-1 text-[7px] text-white/40">
                        {setting[2]}
                      </p>
                    </div>

                    <span className="ml-auto text-white/30">
                      →
                    </span>

                  </div>

                ))}

              </div>

            </div>
          )}

        </div>

      </div>

    </div>

  </div>

</div>

  </div>
</section>

{/* Features Section */}
<section
  id="features"
  className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12"
>
  {/* Heading */}
  <div className="text-center">

    <span className="inline-flex rounded-full border border-pink-500/40 px-3 py-1 text-[9px] font-semibold tracking-wide text-pink-400">
      BUILT FOR CREATORS & BRANDS
    </span>

    <h2 className="mx-auto mt-4 max-w-[650px] text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
      Everything you need for
      <br />
      meaningful{" "}
      <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
        collaborations
      </span>
    </h2>

  </div>

  {/* Feature Cards */}
  <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

    {/* Discover */}
    <div className="rounded-xl border border-white/10 bg-[#0d0a1b] p-5 transition duration-300 hover:-translate-y-1 hover:border-purple-500/40">

      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-purple-500/30 bg-gradient-to-br from-pink-500/20 to-purple-600/30 text-pink-400">

        <svg
          width="23"
          height="23"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="10.5" cy="10.5" r="6" />
          <path d="m15 15 5 5" />
          <circle cx="7.5" cy="8" r="1" />
        </svg>

      </div>

      <h3 className="mt-5 text-base font-semibold text-white">
        Discover
      </h3>

      <p className="mt-2 text-xs leading-6 text-white/55">
        Find the right creators or brands based on your niche,
        audience and goals.
      </p>

    </div>


    {/* Connect */}
    <div className="rounded-xl border border-white/10 bg-[#0d0a1b] p-5 transition duration-300 hover:-translate-y-1 hover:border-purple-500/40">

      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-purple-500/30 bg-gradient-to-br from-pink-500/20 to-purple-600/30 text-pink-400">

        <svg
          width="23"
          height="23"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 11.5a7.5 7.5 0 0 1-15 0 7.5 7.5 0 0 1 15 0Z" />
          <path d="M7 20l2-2.5" />
          <path d="M8.5 11.5h.01" />
          <path d="M12 11.5h.01" />
          <path d="M15.5 11.5h.01" />
        </svg>

      </div>

      <h3 className="mt-5 text-base font-semibold text-white">
        Connect
      </h3>

      <p className="mt-2 text-xs leading-6 text-white/55">
        Start conversations, share ideas and build strong
        relationships.
      </p>

    </div>


    {/* Collaborate */}
    <div className="rounded-xl border border-white/10 bg-[#0d0a1b] p-5 transition duration-300 hover:-translate-y-1 hover:border-purple-500/40">

      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-purple-500/30 bg-gradient-to-br from-pink-500/20 to-purple-600/30 text-pink-400">

        <svg
          width="23"
          height="23"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />
        </svg>

      </div>

      <h3 className="mt-5 text-base font-semibold text-white">
        Collaborate
      </h3>

      <p className="mt-2 text-xs leading-6 text-white/55">
        Plan, manage and execute campaigns in one simple
        workspace.
      </p>

    </div>


    {/* Grow Together */}
    <div className="rounded-xl border border-white/10 bg-[#0d0a1b] p-5 transition duration-300 hover:-translate-y-1 hover:border-purple-500/40">

      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-purple-500/30 bg-gradient-to-br from-pink-500/20 to-purple-600/30 text-pink-400">

        <svg
          width="23"
          height="23"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19V11" />
          <path d="M9 19V7" />
          <path d="M14 19V4" />
          <path d="M19 19V9" />
        </svg>

      </div>

      <h3 className="mt-5 text-base font-semibold text-white">
        Grow Together
      </h3>

      <p className="mt-2 text-xs leading-6 text-white/55">
        Track performance, get insights and build long-term
        partnerships.
      </p>

    </div>

  </div>
</section>

{/* How It Works Section */}
<section
  id="how-it-works"
  className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12"
>
  {/* Heading */}
  <div className="text-center">

    <span className="inline-flex rounded-full border border-pink-500/40 px-3 py-1 text-[9px] font-semibold tracking-wide text-pink-400">
      HOW IT WORKS
    </span>

    <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
      Simple steps.{" "}
      <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
        Powerful connections.
      </span>
    </h2>

  </div>

  {/* Steps */}
  <div className="relative mx-auto mt-14 max-w-[1050px]">

    {/* Dotted connecting line */}
    <div className="pointer-events-none absolute left-[12%] right-[12%] top-10 hidden border-t border-dashed border-pink-500/40 lg:block" />

    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

      {/* Step 1 */}
      <div className="relative text-center">

        <div
  className="relative z-10 mx-auto flex !h-20 !w-20 !shrink-0 !rounded-full items-center justify-center border border-pink-500/50 bg-[#0b0915] text-pink-400 shadow-[0_0_25px_rgba(236,72,153,0.12)]"
>
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="8" r="3" />
            <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
            <path d="M18 8v6" />
            <path d="M15 11h6" />
          </svg>

        </div>

        <h3 className="mt-5 text-sm font-semibold">
          1. Create Profile
        </h3>

        <p className="mx-auto mt-2 max-w-[190px] text-xs leading-5 text-white/55">
          Sign up as a Creator or Brand in minutes.
        </p>

      </div>


      {/* Step 2 */}
      <div className="relative text-center">

        <div
  className="relative z-10 mx-auto flex !h-20 !w-20 !shrink-0 !rounded-full items-center justify-center border border-purple-500/50 bg-[#0b0915] text-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.12)]"
>

          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" />
          </svg>

        </div>

        <h3 className="mt-5 text-sm font-semibold">
          2. Discover
        </h3>

        <p className="mx-auto mt-2 max-w-[190px] text-xs leading-5 text-white/55">
          Find the perfect match using smart filters.
        </p>

      </div>


      {/* Step 3 */}
      <div className="relative text-center">

        <div
  className="relative z-10 mx-auto flex !h-20 !w-20 !shrink-0 !rounded-full items-center justify-center border border-pink-500/50 bg-[#0b0915] text-pink-400 shadow-[0_0_25px_rgba(236,72,153,0.12)]"
>
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 11.5a7.5 7.5 0 0 1-15 0 7.5 7.5 0 0 1 15 0Z" />
            <path d="M7 20l2-2.5" />
            <path d="M8.5 11.5h.01" />
            <path d="M12 11.5h.01" />
            <path d="M15.5 11.5h.01" />
          </svg>

        </div>

        <h3 className="mt-5 text-sm font-semibold">
          3. Connect
        </h3>

        <p className="mx-auto mt-2 max-w-[190px] text-xs leading-5 text-white/55">
          Send invites, chat and plan your collab.
        </p>

      </div>


      {/* Step 4 */}
      <div className="relative text-center">

        <div
  className="relative z-10 mx-auto flex !h-20 !w-20 !shrink-0 !rounded-full items-center justify-center border border-purple-500/50 bg-[#0b0915] text-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.12)]"
>
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
          </svg>

        </div>

        <h3 className="mt-5 text-sm font-semibold">
          4. Collaborate & Grow
        </h3>

        <p className="mx-auto mt-2 max-w-[190px] text-xs leading-5 text-white/55">
          Create impactful content and grow together.
        </p>

      </div>

    </div>

  </div>
</section>

{/* For Creators */}
<section
  id="creators"
  className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8"
>
  <div className="text-center">
    <span className="inline-flex rounded-full border border-pink-400/30 bg-pink-500/10 px-3 py-1 text-[10px] font-medium tracking-wide text-pink-300">
      FOR CREATORS
    </span>

    <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
      Turn your content into{" "}
      <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
        opportunities.
      </span>
    </h2>

    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
      Discover brands, find the right collaborations, and grow your creator
      career with KolabZ.
    </p>
  </div>

  {/* Creator cards will be added here */}
  <div className="mt-10 grid gap-5 md:grid-cols-3">
    <div className="group relative min-h-[260px] overflow-hidden rounded-2xl border border-white/10 bg-[#090912] p-6 transition duration-300 hover:-translate-y-1 hover:border-pink-400/30">
  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-pink-500/10 blur-3xl transition group-hover:bg-pink-500/20" />

  <div className="relative">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-pink-400/20 bg-pink-500/10 text-xl">
      🔎
    </div>

    <h3 className="mt-6 text-xl font-semibold text-white">
      Discover Opportunities
    </h3>

    <p className="mt-3 text-sm leading-6 text-white/50">
      Find campaigns and brands that match your content, niche and audience.
    </p>

    <div className="mt-6 flex items-center gap-2 text-xs font-medium text-pink-300">
      <span>Explore campaigns</span>
      <span>→</span>
    </div>
  </div>
</div>

   <div className="group relative min-h-[260px] overflow-hidden rounded-2xl border border-white/10 bg-[#090912] p-6 transition duration-300 hover:-translate-y-1 hover:border-purple-400/30">
  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl transition group-hover:bg-purple-500/20" />

  <div className="relative">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-xl">
      🤝
    </div>

    <h3 className="mt-6 text-xl font-semibold text-white">
      Match With Brands
    </h3>

    <p className="mt-3 text-sm leading-6 text-white/50">
      Connect with brands that genuinely fit your style, audience and creator identity.
    </p>

    <div className="mt-6 flex items-center gap-2 text-xs font-medium text-purple-300">
      <span>Find your match</span>
      <span>→</span>
    </div>
  </div>
</div>

  <div className="group relative min-h-[260px] overflow-hidden rounded-2xl border border-white/10 bg-[#090912] p-6 transition duration-300 hover:-translate-y-1 hover:border-pink-400/30">
  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-pink-500/10 blur-3xl transition group-hover:bg-pink-500/20" />

  <div className="relative">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-pink-400/20 bg-pink-500/10 text-xl">
      📈
    </div>

    <h3 className="mt-6 text-xl font-semibold text-white">
      Grow Your Influence
    </h3>

    <p className="mt-3 text-sm leading-6 text-white/50">
      Build meaningful collaborations, showcase your work and turn your influence into long-term growth.
    </p>

    <div className="mt-6 flex items-center gap-2 text-xs font-medium text-pink-300">
      <span>Grow with KolabZ</span>
      <span>→</span>
    </div>
  </div>
</div>

  </div>

<div className="mt-8 flex justify-center">
  <button
    type="button"
    onClick={() => {
      document.getElementById("waitlist")?.scrollIntoView({
        behavior: "smooth",
      });
    }}
    className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/10 transition hover:scale-[1.02] hover:opacity-90"
  >
    Join as a Creator →
  </button>
</div>

{/* For Brands */}
<section
  id="brands"
  className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8"
>
  <div className="text-center">
    <span className="inline-flex rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-[10px] font-medium tracking-wide text-purple-300">
      FOR BRANDS
    </span>

    <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
      Find creators who{" "}
      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        fit your brand.
      </span>
    </h2>

    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
      Discover the right creators, launch campaigns, and build meaningful
      collaborations that connect with your audience.
    </p>
  </div>

  {/* Brand cards will be added here */}
  <div className="mt-10 grid gap-5 md:grid-cols-3">
   
    <div className="group relative min-h-[260px] overflow-hidden rounded-2xl border border-white/10 bg-[#090912] p-6 transition duration-300 hover:-translate-y-1 hover:border-purple-400/30">
  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl transition group-hover:bg-purple-500/20" />

  <div className="relative">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-xl">
      🔎
    </div>

    <h3 className="mt-6 text-xl font-semibold text-white">
      Discover Creators
    </h3>

    <p className="mt-3 text-sm leading-6 text-white/50">
      Find creators based on their niche, audience, content style and brand fit.
    </p>

    <div className="mt-6 flex items-center gap-2 text-xs font-medium text-purple-300">
      <span>Find the right creators</span>
      <span>→</span>
    </div>
  </div>
</div>

   <div className="group relative min-h-[260px] overflow-hidden rounded-2xl border border-white/10 bg-[#090912] p-6 transition duration-300 hover:-translate-y-1 hover:border-pink-400/30">
  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-pink-500/10 blur-3xl transition group-hover:bg-pink-500/20" />

  <div className="relative">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-pink-400/20 bg-pink-500/10 text-xl">
      🎯
    </div>

    <h3 className="mt-6 text-xl font-semibold text-white">
      Launch Better Campaigns
    </h3>

    <p className="mt-3 text-sm leading-6 text-white/50">
      Create campaigns, set your goals and connect with creators who align with your vision.
    </p>

    <div className="mt-6 flex items-center gap-2 text-xs font-medium text-pink-300">
      <span>Build your campaign</span>
      <span>→</span>
    </div>
  </div>
</div>

   <div className="group relative min-h-[260px] overflow-hidden rounded-2xl border border-white/10 bg-[#090912] p-6 transition duration-300 hover:-translate-y-1 hover:border-purple-400/30">
  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl transition group-hover:bg-purple-500/20" />

  <div className="relative">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-xl">
      📊
    </div>

    <h3 className="mt-6 text-xl font-semibold text-white">
      Track Your Results
    </h3>

    <p className="mt-3 text-sm leading-6 text-white/50">
      Manage collaborations, measure campaign performance and understand what drives real results.
    </p>

    <div className="mt-6 flex items-center gap-2 text-xs font-medium text-purple-300">
      <span>Measure your impact</span>
      <span>→</span>
    </div>
  </div>
</div>

  </div>

<div className="mt-8 flex justify-center">
  <button
    type="button"
    onClick={() => {
      document.getElementById("waitlist")?.scrollIntoView({
        behavior: "smooth",
      });
    }}
    className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/10 transition hover:scale-[1.02] hover:opacity-90"
  >
    Join as a Brand →
  </button>
</div>

</section>

</section>

{/* Pricing */}
<section
  id="pricing"
  className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8"
>
  <div className="text-center">
    <span className="inline-flex rounded-full border border-pink-400/30 bg-pink-500/10 px-3 py-1 text-[10px] font-semibold tracking-wide text-pink-300">
      PRICING
    </span>

    <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
      Simple plans.{" "}
      <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
        Bigger opportunities.
      </span>
    </h2>

    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
      Choose the plan that fits your growth. Built for both creators and brands.
    </p>
  </div>

  <div className="mt-8 flex items-center justify-center">
  <div className="flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">

    <button
      type="button"
      onClick={() => setBillingCycle("monthly")}
      className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
        billingCycle === "monthly"
          ? "bg-white/10 text-white shadow-sm"
          : "text-white/45 hover:text-white/70"
      }`}
    >
      Monthly
    </button>

    <button
      type="button"
      onClick={() => setBillingCycle("annual")}
      className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
        billingCycle === "annual"
          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
          : "text-white/45 hover:text-white/70"
      }`}
    >
      Annually
    </button>

    {billingCycle === "annual" && (
  <span className="ml-2 mr-2 rounded-full border border-pink-400/20 bg-pink-500/10 px-2.5 py-1 text-[9px] font-semibold text-pink-300">
    Save ~16%
  </span>
)}

  </div>
</div>

  {/* Pricing cards will be added here */}
  <div className="mt-12 grid gap-5 lg:grid-cols-3">
   <div className="group relative min-h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-[#090912] 
   p-6 transition duration-300 hover:-translate-y-1 hover:border-pink-400/30">
  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl" />

  <div className="relative">
    <h3 className="text-xl font-semibold text-white">
      Free
    </h3>

    <p className="mt-2 text-sm text-white/45">
      Get started with the basics.
    </p>

    <div className="mt-6 flex items-end gap-1">
      <span className="text-4xl font-bold text-white">
  ₹0
</span>

<span className="mb-1 text-sm text-white/40">
  {billingCycle === "monthly" ? "/month" : "/year"}
</span>
    </div>

    <div className="mt-6 h-px bg-white/10" />

    <p className="mt-6 text-xs font-medium uppercase tracking-wide text-white/40">
      Includes
    </p>

    <ul className="mt-4 space-y-4 text-sm text-white/65">
      <li>✓ Create your profile</li>
      <li>✓ Browse campaigns</li>
      <li>✓ Discover creators & brands</li>
      <li>✓ Basic collaboration access</li>
    </ul>

  </div>
</div>

   <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-pink-400 bg-[#090912] 
   p-6 shadow-[0_0_14px_rgba(236,72,153,0.25),0_0_35px_rgba(236,72,153,0.14),0_0_60px_rgba(168,85,247,0.08)] 
   transition duration-300 hover:-translate-y-1 hover:border-pink-400">
  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />

  <div className="relative">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-white">
        Plus
      </h3>

      <span className="rounded-full border border-pink-400/20 bg-pink-500/10 px-3 py-1 text-[9px] font-semibold tracking-wide text-pink-300">
        MOST POPULAR
      </span>
    </div>

    <p className="mt-2 text-sm text-white/45">
      More tools. More opportunities.
    </p>

    <div className="mt-6 flex items-end gap-1">
      <span className="text-4xl font-bold text-white">
  {billingCycle === "monthly" ? "₹199" : "₹1,999"}
</span>

<span className="mb-1 text-sm text-white/40">
  {billingCycle === "monthly" ? "/month" : "/year"}
</span>
    </div>

    <div className="mt-6 h-px bg-white/10" />

    <p className="mt-6 text-xs font-medium uppercase tracking-wide text-white/40">
     Plus Features
    </p>

    <ul className="mt-4 space-y-4 text-sm text-white/65">
      <li>✓ More campaign access</li>
      <li>✓ Advanced discovery & filters</li>
      <li>✓ Better collaboration opportunities</li>
      <li>✓ Enhanced profile visibility</li>
      <li>✓ Access of analytics feature</li>
      <li>✓ Advanced messaging feature</li>
    </ul>
  </div>
</div>

    <div className="group relative min-h-[360px] overflow-hidden rounded-3xl border border-purple-400/30 
    bg-[#090912] p-6 shadow-[...] transition duration-300 hover:-translate-y-1 hover:border-purple-400/60">
  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />

  <div className="relative">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-white">
        Pro
      </h3>

      <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-[9px] font-semibold tracking-wide text-purple-300">
        PREMIUM
      </span>
    </div>

    <p className="mt-2 text-sm text-white/45">
      Unlimited access. Maximum growth.
    </p>

    <div className="mt-6 flex items-end gap-1">
      <span className="text-4xl font-bold text-white">
  {billingCycle === "monthly" ? "₹499" : "₹4,999"}
</span>

<span className="mb-1 text-sm text-white/40">
  {billingCycle === "monthly" ? "/month" : "/year"}
</span>
    </div>

    <div className="mt-6 h-px bg-white/10" />

    <p className="mt-6 text-xs font-medium uppercase tracking-wide text-white/40">
      PRO FEATURES
    </p>

    <ul className="mt-4 space-y-4 text-sm text-white/65">
      <li>✓ Unlimited campaign access</li>
      <li>✓ Unlimited campaign creation</li>
      <li>✓ Advanced creator & brand discovery</li>
      <li>✓ Maximum profile visibility</li>
      <li>✓ Premium collaboration tools</li>
      <li>✓ One to one customer support</li>
    </ul>
  </div>
</div>

  </div>

    <div className="group mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-pink-400/30 bg-gradient-to-r 
    from-pink-500/[0.08] via-purple-500/[0.08] to-pink-500/[0.08] px-5 py-5 text-center shadow-[0_0_25px_rgba(236,72,153,0.06)] transition duration-300 hover:-translate-y-1 hover:border-pink-400/50 hover:shadow-[0_0_25px_rgba(236,72,153,0.10)] sm:px-8 sm:py-6">
  <div className="flex flex-col items-center">

    <span className="inline-flex items-center rounded-full border border-pink-400/25 bg-pink-500/10 px-3 py-1 text-[9px] 
    font-semibold tracking-wide text-pink-300">
      🎁 EARLY ACCESS OFFER
    </span>

    <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">
      Get Pro features{" "}
      <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
        FREE for 3 months.
      </span>
    </h3>

    <p className="mt-2 max-w-xl text-xs leading-5 text-white/55 sm:text-sm">
      Sign up today and experience the full power of KolabZ with Pro features
      free for your first 3 months.
    </p>

    <button
  type="button"
  onClick={() => {
    window.location.href = "/signup";
  }}
  className="mt-5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-pink-500/10 transition hover:scale-[1.02] hover:opacity-90 sm:text-sm"
>
  Sign Up & Claim 3 Months Free →
</button>

    <p className="mt-2 text-[9px] text-white/35">
      Limited early-access offer.
    </p>

  </div>
</div>

</section>

{/* About Us */}
<section
  id="about"
  className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8"
>
  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#090912] px-6 py-10 sm:px-10 lg:px-12 lg:py-12">

    {/* Background Glow */}
    <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

    <div className="relative">

      {/* Heading */}
      <div className="text-center">

        <span className="inline-flex rounded-full border border-pink-400/30 bg-pink-500/10 px-3 py-1 text-[10px] font-medium tracking-wide text-pink-300">
          ABOUT KOLABZ
        </span>

        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Tired of sending{" "}
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            cold DMs?
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
          Whether you're a creator reaching out to brands or a brand searching
          for creators, you've probably sent messages that never got a reply.
        </p>

      </div>


      {/* Problem → Solution */}
      <div className="mt-10 grid gap-5 md:grid-cols-2">

        {/* Problem */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-xl">
            💬
          </div>

          <h3 className="mt-5 text-lg font-semibold text-white">
            The cold DM problem
          </h3>

          <p className="mt-3 text-sm leading-6 text-white/50">
            You find the perfect creator or brand, send a message, wait for a
            response... and sometimes hear absolutely nothing.
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs text-white/35">
            <span>Send DM</span>
            <span>→</span>
            <span>Wait</span>
            <span>→</span>
            <span>No response</span>
          </div>
        </div>


        {/* Solution */}
        <div className="rounded-2xl border border-pink-400/25 bg-gradient-to-br from-pink-500/[0.06] to-purple-500/[0.06] p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-pink-400/20 bg-pink-500/10 text-xl">
            🤝
          </div>

          <h3 className="mt-5 text-lg font-semibold text-white">
            Meet directly through KolabZ
          </h3>

          <p className="mt-3 text-sm leading-6 text-white/55">
            KolabZ connects creators and brands directly, so you can discover
            relevant opportunities and start meaningful collaborations without
            endless cold outreach.
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs font-medium text-pink-300">
            <span>Discover</span>
            <span>→</span>
            <span>Connect</span>
            <span>→</span>
            <span>Collaborate</span>
          </div>
        </div>

      </div>


      {/* Closing Statement */}
      <div className="mt-10 text-center">

        <h3 className="text-xl font-semibold text-white sm:text-2xl">
          Stop chasing collaborations.
        </h3>

        <p className="mt-2 text-sm text-white/45 sm:text-base">
          Start finding them.
        </p>

      </div>

    </div>
  </div>
</section>

{/* Waitlist CTA */}
<section
  id="waitlist"
  className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
>
  <div className="overflow-hidden rounded-2xl border border-pink-400/50 bg-gradient-to-r from-[#b92b63] via-[#7d2b91] 
  to-[#4d3b9d] px-5 py-6 shadow-[0_0_35px_rgba(236,72,153,0.15)] sm:px-7 sm:py-7 lg:px-8 lg:py-8">

    <div className="grid items-center gap-6 lg:grid-cols-[1fr_0.9fr] lg:gap-10">

      {/* Left Side */}
      <div className="min-w-0">

        <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 
        text-[8px] font-medium tracking-wide text-white/80 sm:text-[9px]">
          JOIN EARLY ACCESS
        </span>

        <h2 className="mt-3 max-w-[560px] text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
          Be the first to experience{" "}
          <span className="bg-gradient-to-r from-pink-300 to-purple-400 bg-clip-text text-transparent">
            KolabZ
          </span>
        </h2>

        <p className="mt-2 max-w-[480px] text-xs leading-5 text-white/75 sm:text-sm sm:leading-6">
          Join our waitlist and get early access when we launch.
        </p>

      </div>

      {/* Right Side */}
      <div className="min-w-0">

        <div className="flex min-h-[48px] w-full overflow-hidden rounded-xl border border-white/20 bg-black/45 p-1 
        sm:min-h-[52px]">

          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-w-0 flex-1 bg-transparent px-3 text-xs text-white outline-none placeholder:text-white/40 
            sm:px-4 sm:text-sm"
          />

          {/* Join Waitlist Button */}
          <button
            type="button"
            onClick={handleWaitlist}
            className="shrink-0 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-3 text-xs font-semibold 
            text-white shadow-lg transition hover:opacity-90 sm:px-5 sm:text-sm"
          >
            Join Waitlist
            <span className="ml-1 text-sm sm:ml-2 sm:text-base">
              →
            </span>
          </button>

        </div>

        <p className="mt-2 px-1 text-[9px] text-white/55 sm:text-[10px]">
          No spam, we promise. Unsubscribe anytime.
        </p>

        {message && (
          <p className="mt-2 px-1 text-[9px] font-medium text-white/80 sm:text-[10px]">
            {message}
          </p>
        )}

      </div>

    </div>

  </div>
</section>

{/* Contact Us */}
<section
  id="contact"
  className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8"
>
  <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#090912] px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

      {/* Left Side */}
      <div>
        <span className="inline-flex rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-[10px] font-medium tracking-wide text-purple-300">
          CONTACT US
        </span>

        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Let's{" "}
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            talk.
          </span>
        </h2>

        <p className="mt-4 max-w-md text-sm leading-6 text-white/50 sm:text-base">
          Have a question, partnership idea, or just want to say hello?
          We’d love to hear from you.
        </p>

        <div className="mt-7 space-y-4">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-400/20 bg-pink-500/10">
              ✉️
            </div>

            <div>
              <p className="text-[10px] text-white/35">
                EMAIL
              </p>

              <p className="mt-0.5 text-sm text-white/75">
                kolabzsupport@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10">
              💬
            </div>

            <div>
              <p className="text-[10px] text-white/35">
                MESSAGE US
              </p>

              <p className="mt-0.5 text-sm text-white/75">
                We’re here to help.
              </p>
            </div>
          </div>

        </div>
      </div>


      {/* Right Side */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">

        <div className="grid gap-4 sm:grid-cols-2">

          <div>
            <label className="text-xs font-medium text-white/60">
              Name
            </label>

            <input
              type="text"
              placeholder="Your name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-pink-400/40"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-white/60">
              Email
            </label>

            <input
              type="email"
              placeholder="xyz@gmail.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-pink-400/40"
            />
          </div>

        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-white/60">
            Message
          </label>

          <textarea
            rows={5}
            placeholder="Tell us how we can help..."
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-pink-400/40"
          />
        </div>

        <button
          type="button"
          onClick={handleContactSubmit}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/10 transition hover:scale-[1.01] hover:opacity-90"
        >
          Send Message →
        </button>

        {contactStatus && (
  <p className="mt-3 text-center text-xs text-white/60">
    {contactStatus}
  </p>
)}

      </div>

    </div>
  </div>
</section>

{/* Footer */}
<footer className="border-t border-white/10 bg-[#05050d]">

  <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr] lg:px-12">

    {/* Brand */}
    <div>

      <a href="/" className="flex items-center gap-3">
        <div className="h-8 w-8">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <defs>
              <linearGradient
                id="footer-z-gradient"
                x1="10"
                y1="15"
                x2="90"
                y2="85"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FF4F91" />
                <stop offset="1" stopColor="#9B4DFF" />
              </linearGradient>
            </defs>

            <path
              d="M8 12H92V30L38 70H92V88H8V70L62 30H8V12Z"
              fill="url(#footer-z-gradient)"
            />
          </svg>
        </div>

        <span className="text-xl font-bold">
          KolabZ
        </span>
      </a>

      <p className="mt-5 max-w-[230px] text-sm leading-6 text-white/50">
        Find the right collabs.
        <br />
        Grow your influence.
      </p>

      {/* Social Icons */}
      <div className="mt-6 flex items-center gap-3">

        <a
          href="https://www.instagram.com/_kolabz/"
            target="_blank"
            rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs text-white/60 transition hover:border-pink-500/40 hover:text-white"
        >
          ◎
        </a>

        <a
          href="https://youtube.com/@kolab-z"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs text-white/60 transition hover:border-pink-500/40 hover:text-white"
        >
          ▶
        </a>

        <a
          href="https://x.com/KolabZofficial"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="KolabZ on X"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs text-white/60 transition hover:border-pink-500/40 hover:text-white"
        >
          X
        </a>

      </div>

    </div>


    {/* Platform */}
    <div>

      <h3 className="text-sm font-semibold text-white">
        Platform
      </h3>

      <div className="mt-5 flex flex-col gap-3">

        <a href="#creators" className="footer-link">
          For Creators
        </a>

        <a href="#brands" className="footer-link">
          For Brands
        </a>

        <a href="#how-it-works" className="footer-link">
          How it Works
        </a>

        <a href="#pricing" className="footer-link">
          Pricing
        </a>

      </div>

    </div>


    {/* Company */}
    <div>

      <h3 className="text-sm font-semibold text-white">
        Company
      </h3>

      <div className="mt-5 flex flex-col gap-3">

        <a href="#about" className="footer-link">
          About Us
        </a>

        <a href="#contact" className="footer-link">
          Contact Us
        </a>

      </div>

    </div>


    {/* Legal */}
    <div>

      <h3 className="text-sm font-semibold text-white">
        Legal
      </h3>

      <div className="mt-5 flex flex-col gap-3">

        <a href="/privacy" className="footer-link">
          Privacy Policy
        </a>

        <a href="/terms" className="footer-link">
          Terms of Service
        </a>

        <a href="/cookies" className="footer-link">
          Cookies Policy
        </a>

      </div>

    </div>


    {/* Newsletter */}
    <div>

      <h3 className="text-sm font-semibold text-white">
        Stay updated about KolabZ
      </h3>

      <p className="mt-4 text-sm leading-6 text-white/50">
        Get the latest updates and be the first to know
        when we launch.
      </p>

      <button
  type="button"
  onClick={() => {
    document.getElementById("waitlist")?.scrollIntoView({
      behavior: "smooth",
    });
  }}
  className="mt-5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
>
  Join Waitlist 
</button>

      </div>

    </div>


  {/* Bottom Bar */}
  <div className="border-t border-white/10">

    <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-6 py-6 text-center sm:flex-row sm:text-left lg:px-12">

      <p className="text-xs text-white/35">
        © 2026 KolabZ. All rights reserved.
      </p>

      <p className="text-xs text-white/30">
        Built for creators & brands.
      </p>

    </div>

  </div>

</footer>


    </main>
  );
}