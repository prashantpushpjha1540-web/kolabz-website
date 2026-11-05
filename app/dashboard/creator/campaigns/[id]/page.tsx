"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Campaign = {
  id: string;
  brand_id: string;
  campaign_name: string;
  product_brand: string | null;
  category: string;
  description: string;
  platform: string;
  content_type: string;
  creators_required: number | null;
  start_date: string | null;
  end_date: string | null;
  deliverables: string | null;
  preferred_niche: string | null;
  minimum_followers: number | null;
  preferred_location: string | null;
  target_audience: string | null;
  total_budget: number | string;
  budget_per_creator: number | string | null;
  payment_terms: string | null;
  application_deadline: string | null;
  who_can_apply: string;
  additional_instructions: string | null;
  status: string;
  created_at: string;
};

export default function CampaignDetails() {
  const params = useParams();
  const router = useRouter();

  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [applying, setApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      setFetchError("");

      try {
        if (!campaignId) {
          setFetchError("Campaign not found.");
          return;
        }

        const isUuid =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            campaignId
          );

        let data: Campaign | null = null;
        let error: any = null;

        if (isUuid) {
          const result = await supabase
            .from("campaigns")
            .select("*")
            .eq("id", campaignId)
            .eq("status", "published")
            .gte("application_deadline", new Date().toISOString().split("T")[0])
            .maybeSingle();

          data = result.data;
          error = result.error;
        } else {
          const campaignName = campaignId.replace(/-/g, " ");

          const result = await supabase
            .from("campaigns")
            .select("*")
            .eq("status", "published")
            .gte("application_deadline", new Date().toISOString().split("T")[0])
            .ilike("campaign_name", campaignName)
            .limit(1)
            .maybeSingle();

          data = result.data;
          error = result.error;
        }

        if (error) {
          console.error("Campaign fetch error:", error);

          setFetchError(
            error.message || "Unable to load this campaign."
          );

          return;
        }

        if (!data) {
          setFetchError("This campaign could not be found.");
          return;
        }

        setCampaign(data);
      } catch (error) {
        console.error("Campaign fetch error:", error);
        setFetchError("Something went wrong while loading the campaign.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  const applyToCampaign = async () => {
    setApplicationMessage("");

    if (!campaign?.id) {
      setApplicationMessage("Campaign not found.");
      return;
    }

    if (campaign.who_can_apply !== "everyone") {
      setApplicationMessage(
        "This campaign is currently available by invitation only."
      );
      return;
    }

    setApplying(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setApplicationMessage("Please login to apply.");
        return;
      }

      const { error } = await supabase
        .from("campaign_applications")
        .insert({
          campaign_id: campaign.id,
          creator_id: user.id,
          status: "pending",
        });

      if (error) {
        if (error.code === "23505") {
          setApplicationMessage(
            "You have already applied to this campaign."
          );
        } else {
          setApplicationMessage(
            error.message || "Unable to submit your application."
          );
        }

        return;
      }

      setApplicationMessage(
        "Application submitted successfully."
      );
    } catch (error) {
      console.error("Application error:", error);
      setApplicationMessage("Something went wrong. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) {
      return "Not specified";
    }

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (
    value: number | string | null
  ) => {
    if (value === null || value === undefined || value === "") {
      return "Not specified";
    }

    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const requirements = campaign
    ? [
        campaign.preferred_niche
          ? `Preferred niche: ${campaign.preferred_niche}`
          : null,

        campaign.minimum_followers
          ? `Minimum ${Number(
              campaign.minimum_followers
            ).toLocaleString("en-IN")} followers`
          : null,

        campaign.platform
          ? `Platform: ${campaign.platform}`
          : null,

        campaign.content_type
          ? `Content type: ${campaign.content_type}`
          : null,

        campaign.preferred_location
          ? `Preferred location: ${campaign.preferred_location}`
          : null,

        campaign.target_audience
          ? `Target audience: ${campaign.target_audience}`
          : null,
      ].filter(Boolean) as string[]
    : [];

  const deliverables = campaign?.deliverables
    ? [campaign.deliverables]
    : [];

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05050d] px-4 text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-pink-500" />

          <p className="mt-4 text-sm text-white/50">
            Loading campaign...
          </p>
        </div>
      </main>
    );
  }

  if (fetchError || !campaign) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05050d] px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center sm:p-8">

          <div className="text-3xl">
            ⚠️
          </div>

          <h1 className="mt-4 text-xl font-semibold">
            Campaign unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-white/50">
            {fetchError || "This campaign could not be found."}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            ← Go Back
          </button>

        </div>
      </main>
    );
  }



  return (
    <main className="min-h-screen bg-[#05050d] text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-white/[0.02]">

        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">

          <button
            type="button"
            onClick={() => router.back()}
            className="shrink-0 text-sm text-white/50 transition hover:text-white"
          >
            ← Back
          </button>

          <div className="text-xl font-black sm:text-2xl">
            Kolab
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Z
            </span>
          </div>

        </div>

      </header>

      {/* Content */}
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">

        {/* Campaign Header */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

            <div className="min-w-0">

              <p className="text-sm text-pink-400">
                {campaign.product_brand || "Brand"}
              </p>

              <h1 className="mt-2 break-words text-2xl font-bold sm:text-4xl">
                {campaign.campaign_name}
              </h1>

              <span className="mt-4 inline-block rounded-full bg-pink-500/10 px-3 py-1 text-sm text-pink-400">
                {campaign.category}
              </span>

            </div>

            <div className="w-full shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 md:w-auto md:min-w-[180px] md:px-6">

              <p className="text-xs text-white/40">
                Total Budget
              </p>

              <p className="mt-1 text-lg font-bold sm:text-xl">
                {formatCurrency(campaign.total_budget)}
              </p>

            </div>

          </div>

        </section>

        {/* Main Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* Left */}
          <div className="space-y-6 lg:col-span-2">

            {/* Description */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

              <h2 className="text-xl font-semibold">
                About this campaign
              </h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-white/50">
                {campaign.description}
              </p>

            </section>

            {/* Requirements */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

              <h2 className="text-xl font-semibold">
                Creator Requirements
              </h2>

              {requirements.length > 0 ? (
                <div className="mt-4 space-y-3">

                  {requirements.map((requirement) => (
                    <div
                      key={requirement}
                      className="flex items-start gap-3 text-sm text-white/60"
                    >
                      <span className="mt-0.5 shrink-0 text-pink-400">
                        ✓
                      </span>

                      <span>
                        {requirement}
                      </span>
                    </div>
                  ))}

                </div>
              ) : (
                <p className="mt-4 text-sm text-white/40">
                  No specific creator requirements were provided.
                </p>
              )}

            </section>

            {/* Deliverables */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

              <h2 className="text-xl font-semibold">
                Deliverables
              </h2>

              {deliverables.length > 0 ? (
                <div className="mt-4 space-y-3">

                  {deliverables.map((deliverable) => (
                    <div
                      key={deliverable}
                      className="flex items-start gap-3 text-sm text-white/60"
                    >
                      <span className="mt-0.5 shrink-0 text-purple-400">
                        ◆
                      </span>

                      <span className="whitespace-pre-line">
                        {deliverable}
                      </span>
                    </div>
                  ))}

                </div>
              ) : (
                <p className="mt-4 text-sm text-white/40">
                  No specific deliverables were provided.
                </p>
              )}

            </section>

            {/* Additional Instructions */}
            {campaign.additional_instructions && (
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

                <h2 className="text-xl font-semibold">
                  Additional Instructions
                </h2>

                <p className="mt-4 whitespace-pre-line leading-7 text-white/50">
                  {campaign.additional_instructions}
                </p>

              </section>
            )}

          </div>

          {/* Right */}
          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 lg:sticky lg:top-6">

            <h2 className="text-lg font-semibold">
              Campaign Information
            </h2>

            <div className="mt-5 space-y-5">

              {/* Brand */}
              <div>
                <p className="text-xs text-white/40">
                  Brand
                </p>

                <p className="mt-1 font-medium">
                  {campaign.product_brand || "Brand"}
                </p>
              </div>

              {/* Category */}
              <div>
                <p className="text-xs text-white/40">
                  Category
                </p>

                <p className="mt-1 font-medium">
                  {campaign.category}
                </p>
              </div>

              {/* Platform */}
              <div>
                <p className="text-xs text-white/40">
                  Platform
                </p>

                <p className="mt-1 font-medium">
                  {campaign.platform}
                </p>
              </div>

              {/* Content Type */}
              <div>
                <p className="text-xs text-white/40">
                  Content Type
                </p>

                <p className="mt-1 font-medium">
                  {campaign.content_type}
                </p>
              </div>

              {/* Creators Required */}
              <div>
                <p className="text-xs text-white/40">
                  Creators Required
                </p>

                <p className="mt-1 font-medium">
                  {campaign.creators_required ?? "Not specified"}
                </p>
              </div>

              {/* Budget Per Creator */}
              <div>
                <p className="text-xs text-white/40">
                  Budget Per Creator
                </p>

                <p className="mt-1 font-medium">
                  {formatCurrency(campaign.budget_per_creator)}
                </p>
              </div>

              {/* Deadline */}
              <div>
                <p className="text-xs text-white/40">
                  Application Deadline
                </p>

                <p className="mt-1 font-medium">
                  {formatDate(campaign.application_deadline)}
                </p>
              </div>

              {/* Campaign Dates */}
              <div>
                <p className="text-xs text-white/40">
                  Campaign Dates
                </p>

                <p className="mt-1 text-sm font-medium leading-6">
                  {formatDate(campaign.start_date)}
                  {" → "}
                  {formatDate(campaign.end_date)}
                </p>
              </div>

              {/* Payment Terms */}
              {campaign.payment_terms && (
                <div>
                  <p className="text-xs text-white/40">
                    Payment Terms
                  </p>

                  <p className="mt-1 whitespace-pre-line text-sm font-medium leading-6">
                    {campaign.payment_terms}
                  </p>
                </div>
              )}

            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={applyToCampaign}
              disabled={
                applying ||
                campaign.who_can_apply !== "everyone"
              }
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-3 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {applying
                ? "Applying..."
                : campaign.who_can_apply === "everyone"
                  ? "Apply to Campaign"
                  : "Invite Only"}
            </button>

            {/* Application Message */}
            {applicationMessage && (
              <div
                className={`mt-3 rounded-xl border px-4 py-3 text-center text-sm ${
                  applicationMessage.includes("successfully")
                    ? "border-green-500/20 bg-green-500/10 text-green-400"
                    : "border-white/10 bg-white/[0.03] text-white/60"
                }`}
              >
                {applicationMessage}
              </div>
            )}

          </aside>

        </div>

      </div>

    </main>
  );
}