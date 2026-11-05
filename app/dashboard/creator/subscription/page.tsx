"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatorSubscriptionPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  const plans = [
    {
      name: "Free",
      description: "A simple start for every creator.",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        "Creator profile",
        "Browse available campaigns",
        "Apply to eligible campaigns",
        "Basic messaging",
      ],
      current: true,
    },
    {
      name: "Plus",
      description: "More tools for growing creators.",
      monthlyPrice: 199,
      annualPrice: 1999,
      features: [
        "Everything in Free",
        "Enhanced creator discovery",
        "Advanced collaboration tools",
        "Priority support",
      ],
      current: false,
    },
    {
      name: "Pro",
      description: "For creators ready to grow further.",
      monthlyPrice: 499,
      annualPrice: 4999,
      features: [
        "Everything in Plus",
        "Premium profile visibility",
        "Advanced creator insights",
        "Priority campaign opportunities",
      ],
      current: false,
    },
  ];

  return (
    <main className="min-h-screen bg-[#080811] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition hover:bg-white/[0.07] hover:text-white"
          >
            ← Back
          </button>

          <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300">
            Creator Membership
          </span>
        </div>

        {/* Intro */}
        <section className="mx-auto mt-10 max-w-2xl text-center sm:mt-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-2xl ring-1 ring-purple-400/20">
            ✨
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Choose your{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              growth plan
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/50 sm:text-base">
            Find the membership that fits your creator journey.
            Compare plans and choose what works for you.
          </p>
        </section>

        {/* Current plan */}
        <section className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-xs text-white/40">YOUR CURRENT PLAN</p>
            <h2 className="mt-1 text-lg font-semibold">Free Membership</h2>
            <p className="mt-1 text-xs text-white/40">
              You are viewing the available membership options.
            </p>
          </div>

          <span className="w-fit rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-300">
            Free · ₹0
          </span>
        </section>

        {/* Billing cycle */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              aria-pressed={billingCycle === "monthly"}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              aria-pressed={billingCycle === "annual"}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                billingCycle === "annual"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Annually
              <span className="rounded-full bg-green-400/15 px-1.5 py-0.5 text-[10px] text-green-300">
                Save
              </span>
            </button>
          </div>

          <p className="text-xs text-white/35">
            Displayed prices are illustrative plan options. No payment is
            processed on this page yet.
          </p>
        </div>

        {/* Plans */}
        <section className="mt-8 grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 md:gap-5">
          {plans.map((plan) => {
            const price =
              billingCycle === "monthly"
                ? plan.monthlyPrice
                : plan.annualPrice;

            const period =
              billingCycle === "monthly" ? "/month" : "/year";

            const isPopular = plan.name === "Plus";

            return (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-5 transition sm:p-6 ${
                  isPopular
                    ? "border-purple-400/40 bg-gradient-to-b from-purple-500/[0.12] to-pink-500/[0.04] shadow-[0_0_35px_rgba(168,85,247,0.08)]"
                    : "border-white/10 bg-white/[0.025]"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Popular
                  </span>
                )}

                <div className="mt-1">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-2 min-h-10 text-sm leading-5 text-white/45">
                    {plan.description}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight sm:text-4xl">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-white/40">{period}</span>
                  </div>

                  {billingCycle === "annual" && plan.name !== "Free" && (
                    <p className="mt-2 text-xs text-white/40">
                      Equivalent to ₹
                      {Math.round(price / 12).toLocaleString("en-IN")}/month
                    </p>
                  )}
                </div>

                <div className="my-6 border-t border-white/10" />

                <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
                  Plan includes
                </p>

                <ul className="mt-4 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm leading-5 text-white/70"
                    >
                      <span className="mt-0.5 text-pink-400">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled
                  className={`mt-7 w-full cursor-not-allowed rounded-xl px-4 py-3 text-sm font-semibold opacity-60 ${
                    isPopular
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      : "border border-white/10 bg-white/[0.04] text-white/80"
                  }`}
                >
                  {plan.current ? "Current Plan" : `Choose ${plan.name}`}
                </button>

              </article>
            );
          })}
        </section>

        {/* Footer note */}
        <section className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center sm:p-5">
          <p className="text-sm font-medium text-white/70">
            Your creator journey, your pace.
          </p>
          <p className="mt-2 text-xs leading-5 text-white/40">
            Paid memberships will only activate after payment verification.
            This page is currently a UI preview; no subscription is purchased
            or activated by selecting a billing cycle.
          </p>
        </section>
      </div>
    </main>
  );
}