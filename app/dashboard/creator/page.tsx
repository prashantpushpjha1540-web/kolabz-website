"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CreatorDashboard() {
  const router = useRouter();
  const [name, setName] = useState("Creator");
  const [editName, setEditName] = useState("");
  const [activeSection, setActiveSection] = useState<string>("Overview");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [campaignError, setCampaignError] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<{
  brand: string;
  title: string;
  category: string;
  budget: string;
} | null>(null);

const [myApplications, setMyApplications] = useState<any[]>([]);
const [loadingApplications, setLoadingApplications] = useState(false);
const [conversations, setConversations] = useState<any[]>([]);
const [loadingConversations, setLoadingConversations] = useState(false);

const [showProjectAppMessage, setShowProjectAppMessage] = useState(false);
const [email, setEmail] = useState("");
const [niche, setNiche] = useState("");
const [showNicheDropdown, setShowNicheDropdown] = useState(false);
const [bio, setBio] = useState("");
const [instagram, setInstagram] = useState("");
const [instagramFollowers, setInstagramFollowers] = useState("");
const [youtube, setYoutube] = useState("");
const [location, setLocation] = useState("");
const [avatarUrl, setAvatarUrl] = useState("");
const [uploadingAvatar, setUploadingAvatar] = useState(false);
const profileFields = [
  name,
  email,
  niche,
  bio,
  instagram,
  instagramFollowers,
  youtube,
  location,
];

const completedFields = profileFields.filter(
  (field) => field.trim().length > 0
).length;

const profileCompletion = Math.round(
  (completedFields / profileFields.length) * 100
);

const [savingProfile, setSavingProfile] = useState(false);
const [profileMessage, setProfileMessage] = useState("");
const [emailNotifications, setEmailNotifications] = useState(true);
const [campaignUpdates, setCampaignUpdates] = useState(true);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [showChangePassword, setShowChangePassword] = useState(false);
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [currentPassword, setCurrentPassword] = useState("");
const [showForgotPassword, setShowForgotPassword] = useState(false);
const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [passwordError, setPasswordError] = useState("");
const [updatingPassword, setUpdatingPassword] = useState(false);
const [showDeleteAccount, setShowDeleteAccount] = useState(false);
const [deletePassword, setDeletePassword] = useState("");
const [showDeletePassword, setShowDeletePassword] = useState(false);
const [deleteError, setDeleteError] = useState("");
const [deletePasswordVerified, setDeletePasswordVerified] = useState(false);

const fetchCampaigns = async () => {
  setLoadingCampaigns(true);
  setCampaignError("");

  const today = new Date().toISOString().split("T")[0];
  
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("status", "published")
    .eq("who_can_apply", "everyone")
    .gte("application_deadline", today)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Campaign fetch error:", error);
    setCampaignError("Unable to load campaigns.");
    setCampaigns([]);
    setLoadingCampaigns(false);
    return;
  }

  setCampaigns(data || []);
  setLoadingCampaigns(false);
};

const fetchMyApplications = async () => {
  setLoadingApplications(true);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMyApplications([]);
      return;
    }

    const { data, error } = await supabase
      .from("campaign_applications")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Applications fetch error:", error);
      setMyApplications([]);
      return;
    }

    console.log(
  "Applications fetched:",
  data?.map((app) => ({
    id: app.id,
    status: app.status,
    project_status: app.project_status,
  }))
);

    setMyApplications(data || []);
  } catch (error) {
    console.error("Applications fetch error:", error);
    setMyApplications([]);
  } finally {
    setLoadingApplications(false);
  }
};

const fetchConversations = async () => {
  setLoadingConversations(true);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setConversations([]);
      return;
    }

    // Get conversations where the logged-in creator is involved
    const { data: conversationData, error: conversationError } =
      await supabase
        .from("conversations")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

    if (conversationError) {
      console.log(
  "Conversation fetch error:",
  JSON.stringify(conversationError, null, 2)
);
      setConversations([]);
      return;
    }

    if (!conversationData || conversationData.length === 0) {
      setConversations([]);
      return;
    }

    // Get brand profiles
    const brandIds = conversationData.map(
      (conversation) => conversation.brand_id
    );

    const { data: brandProfiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", brandIds);

    if (profileError) {
      console.error("Brand profile fetch error:", profileError);
    }

    // Get latest message for every conversation
    const conversationsWithMessages = await Promise.all(
      conversationData.map(async (conversation) => {
        const { data: messageData, error: messageError } =
          await supabase
            .from("messages")
            .select("content, created_at, sender_id")
            .eq("conversation_id", conversation.id)
            .eq("deleted", false)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (messageError) {
          console.error("Message fetch error:", messageError);
        }

        const brand = (brandProfiles || []).find(
          (profile) => profile.id === conversation.brand_id
        );

        return {
          ...conversation,
          brand_name: brand?.full_name || "Brand",
          brand_avatar: brand?.avatar_url || null,
          latest_message: messageData?.content || "No messages yet",
          latest_message_time: messageData?.created_at || conversation.created_at,
        };
      })
    );

    setConversations(conversationsWithMessages);
  } catch (error) {
    console.error("Conversation fetch error:", error);
    setConversations([]);
  } finally {
    setLoadingConversations(false);
  }
};

const acceptedApplications = myApplications.filter(
  (application) => application.status === "accepted"
);

const activeProjects = acceptedApplications.filter(
  (application) => application.project_status !== "completed"
);

const completedProjects = acceptedApplications.filter(
  (application) => application.project_status === "completed"
);

const overviewStats = [
  [String(campaigns.length), "Matches"],
  [String(myApplications.length), "Applications"],
  [String(activeProjects.length), "Active Projects"],
  [String(completedProjects.length), "Completed Projects"],
];

const handleMessageBrand = async (campaignId: string) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login again.");
      return;
    }

    // Find the accepted application for this campaign
    const { data: application, error: applicationError } =
      await supabase
        .from("campaign_applications")
        .select("id, status")
        .eq("campaign_id", campaignId)
        .eq("creator_id", user.id)
        .eq("status", "accepted")
        .maybeSingle();

    if (applicationError) {
      console.log(
        "Accepted application error:",
        JSON.stringify(applicationError, null, 2)
      );
      alert("Unable to verify your accepted application.");
      return;
    }

    if (!application) {
      alert("You don't have an accepted application for this project.");
      return;
    }

    // Get the brand ID directly from the campaign
    const { data: campaign, error: campaignError } =
      await supabase
        .from("campaigns")
        .select("id, brand_id")
        .eq("id", campaignId)
        .single();

    if (campaignError) {
      console.log(
        "Campaign fetch error:",
        JSON.stringify(campaignError, null, 2)
      );
      alert("Unable to find the brand for this project.");
      return;
    }

    if (!campaign?.brand_id) {
      alert("Brand information is missing for this project.");
      return;
    }

    // Check if conversation already exists
    const { data: existingConversation, error: checkError } =
      await supabase
        .from("conversations")
        .select("id")
        .eq("creator_id", user.id)
        .eq("brand_id", campaign.brand_id)
        .maybeSingle();

   if (checkError) {
  alert(
    `Conversation check failed:\n\n${checkError.message}\n\nCode: ${checkError.code || "N/A"}`
  );

  console.log(
    "Conversation check error:",
    JSON.stringify(checkError, null, 2)
  );

  return;
}

    let conversationId = existingConversation?.id;

    // Create a new conversation if one doesn't exist
    if (!conversationId) {
      const { data: newConversation, error: createError } =
        await supabase
          .from("conversations")
          .insert({
            creator_id: user.id,
            brand_id: campaign.brand_id,
          })
          .select("id")
          .single();

      if (createError) {
        console.log(
          "Conversation create error:",
          JSON.stringify(createError, null, 2)
        );
        alert("Unable to create the conversation.");
        return;
      }

      conversationId = newConversation.id;
    }

    router.push(
      `/dashboard/creator/messages/${conversationId}`
    );
  } catch (error) {
    console.log(
      "Message Brand error:",
      JSON.stringify(error, null, 2)
    );

    alert("Something went wrong while opening the conversation.");
  }
};

const handleMarkProjectCompleted = async (
  applicationId: string
) => {
  const confirmed = window.confirm(
    "Are you sure you want to mark this project as completed?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login again.");
      return;
    }

    const { error } = await supabase
      .from("campaign_applications")
      .update({
        project_status: "completed",
      })
      .eq("id", applicationId)
      .eq("creator_id", user.id);

    if (error) {
      console.error(
        "Project completion error:",
        JSON.stringify(error, null, 2)
      );
      alert("Unable to mark this project as completed.");
      return;
    }

    setMyApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              project_status: "completed",
            }
          : application
      )
    );
  } catch (error) {
    console.error(
      "Project completion error:",
      JSON.stringify(error, null, 2)
    );

    alert("Something went wrong.");
  }
};

const handleDeleteAccountVerification = async () => {
  setDeleteError("");

  if (!deletePassword) {
    setDeleteError("Please enter your current password.");
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    setDeleteError("Unable to verify your account.");
    return;
  }

  // Step 1: Verify current password
  const { error: verifyError } =
    await supabase.auth.signInWithPassword({
      email: user.email,
      password: deletePassword,
    });

  if (verifyError) {
    setDeleteError("Current password is incorrect.");
    return;
  }

  // Step 2: Call secure Edge Function
  const { data, error: functionError } =
    await supabase.functions.invoke("delete-account", {
      body: {},
    });

  if (functionError) {
    console.error("Delete account function error:", functionError);
    setDeleteError(
      functionError.message || "Unable to delete account."
    );
    return;
  }

  if (!data?.success) {
    setDeleteError(
      data?.error || "Unable to delete account."
    );
    return;
  }

  // Step 3: Account deleted successfully
  await supabase.auth.signOut();

  setShowDeleteAccount(false);
  setDeletePassword("");
  setDeletePasswordVerified(false);

  window.location.href = "/login";
};



const handleUpdatePassword = async () => {
  setPasswordError("");

  if (!currentPassword || !newPassword || !confirmPassword) {
  setPasswordError("Please enter all password fields.");
  return;
}

  if (newPassword !== confirmPassword) {
    setPasswordError("Passwords do not match.");
    return;
  }

  if (newPassword.length < 6) {
    setPasswordError("Password must be at least 6 characters.");
    return;
  }

  setUpdatingPassword(true);

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user || !user.email) {
  setUpdatingPassword(false);
  setPasswordError("Unable to verify your account.");
  return;
}

// Verify current password
const { error: verifyError } = await supabase.auth.signInWithPassword({
  email: user.email,
  password: currentPassword,
});

if (verifyError) {
  setUpdatingPassword(false);
  setPasswordError("Current password is incorrect.");
  return;
}

// Update to new password
const { error: updateError } = await supabase.auth.updateUser({
  password: newPassword,
});

setUpdatingPassword(false);

if (updateError) {
  setPasswordError(updateError.message);
  return;
}

  setCurrentPassword(""); 
  setNewPassword("");
  setConfirmPassword("");
  setShowCurrentPassword(false);
  setShowNewPassword(false);
  setShowConfirmPassword(false);
  setShowChangePassword(false);
};

const handleForgotPassword = async () => {
  setForgotPasswordMessage("");

  if (!email) {
    setForgotPasswordMessage("Unable to find your email.");
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/reset-password",
  });

  if (error) {
    setForgotPasswordMessage(error.message);
    return;
  }

  setForgotPasswordMessage(
    "Password reset link has been sent to your email."
  );
};

const handleAvatarUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setProfileMessage("Please select an image file.");
    return;
  }

  setUploadingAvatar(true);
  setProfileMessage("");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setProfileMessage("Please login again.");
    setUploadingAvatar(false);
    return;
  }

  const fileExt = file.name.split(".").pop();
  const filePath = `${user.id}/profile.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Avatar upload error:", uploadError);
    setProfileMessage("Unable to upload profile photo.");
    setUploadingAvatar(false);
    return;
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  const publicUrl = data.publicUrl;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      avatar_url: publicUrl,
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Avatar URL save error:", updateError);
    setProfileMessage("Photo uploaded, but profile could not be updated.");
    setUploadingAvatar(false);
    return;
  }

  setAvatarUrl(publicUrl);
  setProfileMessage("Profile photo updated ✓");
  setUploadingAvatar(false);
};

const handleSaveProfile = async () => {
  setSavingProfile(true);
  setProfileMessage("");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setProfileMessage("Please login again.");
    setSavingProfile(false);
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: editName,
      email: user.email,
      niche,
      bio,
      instagram,
      instagram_followers: instagramFollowers === "" ? 0 : Number(instagramFollowers),
      youtube,
      location,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile save error:", error);
    setProfileMessage("Unable to save profile. Please try again.");
    setSavingProfile(false);
    return;
  }
  setName(editName);
  setProfileMessage("Profile saved successfully ✓");
  setSavingProfile(false);
};

useEffect(() => {
  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Auth data
    setName(user.user_metadata?.name || "Creator");
    setEmail(user.email || "");

    // Profile data
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, email, niche, bio, instagram, instagram_followers, youtube, location, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Profile load error:", error);
      return;
    }

    if (data) {
      setName(data.full_name || user.user_metadata?.name || "Creator");
      setEditName(data.full_name || user.user_metadata?.name || "Creator");
      setEmail(data.email || user.email || "");
      setNiche(data.niche || "");
      setBio(data.bio || "");
      setInstagram(data.instagram || "");
      setInstagramFollowers(data.instagram_followers != null ? String(data.instagram_followers) : "");
      setYoutube(data.youtube || "");
      setLocation(data.location || "");
      setAvatarUrl(data.avatar_url || "");
    }

  const { data: settings, error: settingsError } = await supabase
  .from("user_settings")
  .select("email_notifications, campaign_updates")
  .eq("user_id", user.id)
  .maybeSingle();

if (settingsError) {
  console.error("Settings load error:", settingsError);
}

if (settings) {
  setEmailNotifications(settings.email_notifications);
  setCampaignUpdates(settings.campaign_updates);
}

  };

  loadProfile();
  fetchCampaigns();
  fetchMyApplications();
  fetchConversations();
}, []);

return (
        <div className="flex h-screen">

{mobileMenuOpen && (
  <>
    {/* Overlay */}
    <div
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] md:hidden"
      onClick={() => setMobileMenuOpen(false)}
    />

    {/* Mobile Sidebar */}
    <aside
      className="fixed left-0 top-0 z-50 h-screen w-[78%] max-w-[320px] border-r border-white/10 bg-[#080812] shadow-2xl shadow-black/50 md:hidden"
    >
      <div className="flex h-full flex-col p-5">

        {/* Logo */}
        <div className="mb-10 text-2xl font-black">
          Kolab<span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Z</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {[
            ["🏠", "Overview"],
            ["📢", "Campaigns"],
            ["📋", "My Applications"],
            ["💬", "Messages"],
            ["📁", "Projects"],
            ["✨", "In-App Features"],
            ["⚙️", "Settings"],
          ].map(([icon, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setActiveSection(label);
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                activeSection === label
                  ? "bg-purple-500/15 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

      </div>
    </aside>
  </>
)}

       {/* SIDEBAR */}
<aside className="hidden h-screen w-56 shrink-0 flex-col border-r border-white/10 bg-[#070711] p-5 md:flex">

  {/* Logo */}
  <div className="mb-10 text-2xl font-black">
    Kolab<span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Z</span>
  </div>

  {/* Navigation */}
  <nav className="space-y-2">

    {[
      ["🏠", "Overview"],
      ["📢", "Campaigns"],
      ["📋", "My Applications"],
      ["💬", "Messages"],
      ["📁", "Projects"],
      ["✨", "In-App Features"],
      ["⚙️", "Settings"],
    ].map(([icon, label], index) => (

      <button
  key={label}
  type="button"
  onClick={() => setActiveSection(label)}
  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
    activeSection === label
      ? "bg-pink-500/15 text-white"
      : "text-white/50 hover:bg-white/5 hover:text-white"
  }`}
>
        <span>{icon}</span>
        <span>{label}</span>
      </button>

    ))}

  </nav>

  {/* Subscription Card */}
<div className="my-2 rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-transparent p-2.5">
  <div className="flex items-center gap-2">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600">
      <span className="text-lg">✨</span>
    </div>

    <div className="min-w-0">
      <p className="text-sm font-bold text-white">
        KolabZ Pro
      </p>
      <p className="text-xs text-white/50">
        Unlock more opportunities
      </p>
    </div>
  </div>

  <p className="mt-2 text-xs leading-4 text-white/60">
    Discover premium tools and grow your collaborations.
  </p>

  <button
    type="button"
    onClick={() =>
      router.push("/dashboard/creator/subscription")
    }
    className="mt-2 w-full rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
  >
    Explore Plans →
  </button>

  <p className="mt-1.5 text-center text-[10px] text-white/40">
    Plans starting at ₹199/month
  </p>
</div>

  {/* Profile */}
  <div className="mt-auto border-t border-white/10 pt-5">

    <button
  type="button"
  onClick={() => setActiveSection("Profile")}
  className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/5"
>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-300 to-purple-500 font-semibold">
  {avatarUrl ? (
    <img
      src={avatarUrl}
      alt="Profile"
      className="h-full w-full object-cover"
    />
  ) : (
    name.charAt(0).toUpperCase()
  )}
</div>

      <div>
        <p className="text-sm font-semibold">
          {name}
        </p>

        <p className="text-[11px] text-white/40">
          Creator
        </p>
      </div>

    </button>

  </div>

</aside>

      <div className="min-w-0 flex-1 overflow-y-scroll">

      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-white/[0.02]">
        
      {/* Mobile Top Navigation */}
<div className="flex items-center justify-between px-5 py-4 md:hidden">
  <div className="text-2xl font-black">
    Kolab
    <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
      Z
    </span>
  </div>

  <div className="flex items-center gap-3">
    {/* Profile */}
    <button
      type="button"
      onClick={() => setActiveSection("Profile")}
      className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-purple-500"
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Profile"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-sm font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </button>

    {/* Menu */}
    <button
      type="button"
      onClick={() => setMobileMenuOpen(true)}
      className="flex h-9 w-9 items-center justify-center text-xl text-white/70 transition hover:text-white"
    >
      ☰
    </button>
  </div>
</div>

        <div className="mx-auto hidden max-w-7xl items-center justify-between px-6 py-4 md:flex">

          {/* Logo */}
          <div className="text-2xl font-black">
            Kolab<span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Z</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-5">

            {/* Profile */}
            <button
  type="button"
  onClick={() => setActiveSection("Profile")}
  className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-white/5"
>

  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-300 to-purple-500 text-sm font-bold">
  {avatarUrl ? (
    <img
      src={avatarUrl}
      alt="Profile"
      className="h-full w-full object-cover"
    />
  ) : (
    name.charAt(0).toUpperCase()
  )}
</div>

  <div className="hidden sm:block">
    <p className="text-sm font-medium">
      {name}
    </p>

    <p className="text-xs text-white/40">
      Creator
    </p>
  </div>

</button>

            </div>

          </div>

      </header>

      {/* Dashboard */}
      <div className="mx-auto max-w-7xl px-6 py-8">

       {activeSection === "Overview" && (

        <div>

        {/* Welcome */}
        <div>

          <h1 className="text-3xl font-bold">
            Welcome, {name} 👋
          </h1>

          <p className="mt-2 text-white/50">
            Here's what's happening with your collaborations.
          </p>

        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {overviewStats.map((stat) => (

            <div
              key={stat[1]}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >

              <p className="text-2xl font-bold">
                {stat[0]}
              </p>

              <p className="mt-1 text-sm text-white/40">
                {stat[1]}
              </p>

            </div>

          ))}

        </div>

        {/* Main Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* Recommended Campaigns */}
          <section className="lg:col-span-2">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Recommended Campaigns
              </h2>

              <button
  type="button"
  onClick={() => setActiveSection("Campaigns")}
  className="text-sm text-pink-400 hover:text-pink-300"
>
  View all →
</button>

            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">

              {campaigns.slice(0, 2).map((campaign) => (

                <div
                  key={campaign.campaign_name}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-pink-500/30"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs text-white/40">
                        {campaign.product_brand || "Brand"}
                      </p>

                      <h3 className="mt-2 font-semibold">
                        {campaign.campaign_name}
                      </h3>

                    </div>

                    <span className="rounded-full bg-pink-500/10 px-2 py-1 text-xs text-pink-400">
                      {campaign.category}
                    </span>

                  </div>

                  <p className="mt-5 text-sm text-white/50">
                    Budget
                  </p>

                  <p className="mt-1 font-semibold">
                    ₹{campaign.budget_per_creator || campaign.total_budget || "—"}
                  </p>

                 <button
  type="button"
 onClick={() =>
  router.push(
    `/dashboard/creator/campaigns/${campaign.id}`
  )
}
  className="mt-5 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-2.5 text-sm font-semibold transition hover:opacity-90"
>
  View Campaign
</button>
                </div>

              ))}

            </div>

          </section>

          {selectedCampaign && (
  <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-pink-400">
          {selectedCampaign.brand}
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          {selectedCampaign.title}
        </h2>
      </div>

      <button
        type="button"
        onClick={() => setSelectedCampaign(null)}
        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
      >
        ← Back
      </button>
    </div>

    <div className="mt-6 grid gap-4 sm:grid-cols-3">

      <div className="rounded-xl border border-white/10 p-4">
        <p className="text-xs text-white/40">Category</p>
        <p className="mt-1 font-semibold">
          {selectedCampaign.category}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 p-4">
        <p className="text-xs text-white/40">Budget</p>
        <p className="mt-1 font-semibold">
          {selectedCampaign.budget}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 p-4">
        <p className="text-xs text-white/40">Status</p>
        <p className="mt-1 font-semibold text-pink-400">
          Open
        </p>
      </div>

    </div>

    <div className="mt-6">
      <h3 className="text-lg font-semibold">
        About this Campaign
      </h3>

      <p className="mt-2 text-sm leading-6 text-white/50">
        {selectedCampaign.title} is a collaboration opportunity
        from {selectedCampaign.brand}. Create engaging content
        that matches the campaign requirements and connects with
        your audience.
      </p>
    </div>

    <div className="mt-6">
      <h3 className="text-lg font-semibold">
        Requirements
      </h3>

      <ul className="mt-3 space-y-2 text-sm text-white/50">
        <li>• Relevant creator profile</li>
        <li>• Original and engaging content</li>
        <li>• Follow campaign guidelines</li>
        <li>• Submit content before the deadline</li>
      </ul>
    </div>

    <button
  type="button"
  onClick={() => {
  router.push("/dashboard/creator/install-app");
}}
  className="mt-8 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-3 font-semibold transition hover:opacity-90"
>
  Apply Now
</button>

  </section>
)}


          {/* Recent Messages */}
          <section>

            <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Recent Messages
            </h2>

            <button
            type="button"
            onClick={() => setActiveSection("Messages")}
            className="text-sm text-pink-400 transition hover:text-pink-300"
          >
            View all →
          </button>
          </div>


            <div className="mt-4 space-y-3">

              {conversations.length === 0 ? (
  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center">
    <p className="text-sm text-white/40">
      No conversations yet.
    </p>
  </div>
) : (
  conversations.slice(0, 3).map((conversation) => (

                <div
  key={conversation.id}
  onClick={() =>
  router.push(
    `/dashboard/creator/messages/${conversation.id}`
  )
}
  className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-pink-500/30 hover:bg-white/5"
>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-xs font-bold">
                    {conversation.brand_name?.charAt(0)?.toUpperCase() || "B"}
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-medium">
                      {conversation.brand_name}
                    </p>

                    <p className="truncate text-xs text-white/40">
                      {conversation.latest_message}
                    </p>

                  </div>

                </div>

              ))
            )}

            </div>

          </section>

        </div>

{/* Active Projects */}
<section className="mt-8">

  <div className="flex items-center justify-between gap-3">

    <h2 className="text-xl font-semibold">
      Active Projects
    </h2>

    <button
      type="button"
      onClick={() => setActiveSection("Projects")}
      className="shrink-0 text-xs text-pink-400 transition hover:text-pink-300 sm:text-sm"
    >
      View all →
    </button>

  </div>

  <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

    {acceptedApplications.length === 0 ? (

      <div className="p-6 text-center">
        <p className="text-sm text-white/40">
          No active projects yet.
        </p>

        <p className="mt-1 text-xs text-white/30">
          Accepted campaign applications will appear here.
        </p>
      </div>

    ) : (

      acceptedApplications.map((application) => {

        const campaign = campaigns.find(
          (item) => item.id === application.campaign_id
        );

        if (!campaign) return null;

        return (
          <div
            key={application.id}
            className="border-b border-white/10 p-4 last:border-0 sm:p-5"
          >

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <p className="truncate font-medium">
                  {campaign.campaign_name}
                </p>

                <p className="mt-1 text-xs text-white/40">
                  {campaign.product_brand || "Brand"}
                </p>

              </div>

              <span className="shrink-0 rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-medium text-green-400 sm:text-xs">
                Active
              </span>

            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <p className="text-[10px] text-white/30">
                  Budget
                </p>

                <p className="mt-1 text-sm font-medium text-white">
                  ₹{campaign.budget_per_creator || campaign.total_budget || "—"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <p className="text-[10px] text-white/30">
                  Platform
                </p>

                <p className="mt-1 text-sm font-medium text-white">
                  {campaign.platform || "—"}
                </p>
              </div>

            </div>

          </div>
        );
      })

    )}

  </div>

</section>


    </div>
       )}

       {/* IN-APP FEATURES */}

{activeSection === "In-App Features" && (
  <section>
    {/* Header */}
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">
          In-App Features
        </h1>

        <p className="mt-2 text-sm text-white/50">
          Everything you need to grow, collaborate & earn.
        </p>
      </div>

      <button
  type="button"
  onClick={() => setActiveSection("Overview")}
  className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-white/10 bg-white/[0.04] 
  px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white sm:px-4"
>
  ← Back
</button>
    </div>

    {/* Intro */}
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm leading-6 text-white/60">
        The KolabZ mobile app will bring the complete creator
        experience to your fingertips.
      </p>
    </div>

    {/* Feature Cards */}
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

      {/* Discover */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-2xl">
          🔍
        </div>

        <h3 className="text-lg font-semibold text-white">
          Discover
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/50">
          Discover relevant brands and campaigns that match your
          niche and audience.
        </p>

        <span className="mt-5 inline-flex rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
          Coming Soon
        </span>
      </div>

      {/* Matches */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-2xl">
          🤝
        </div>

        <h3 className="text-lg font-semibold text-white">
          Matches
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/50">
          AI-powered matches that connect you with the right brands
          and opportunities.
        </p>

        <span className="mt-5 inline-flex rounded-full bg-pink-500/10 px-3 py-1 text-xs font-medium text-pink-300">
          Coming Soon
        </span>
      </div>

      {/* Messages */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
          💬
        </div>

        <h3 className="text-lg font-semibold text-white">
          Messages
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/50">
          Chat with brands in real-time, share ideas and manage
          collaborations easily.
        </p>

        <span className="mt-5 inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
          Coming Soon
        </span>
      </div>

      {/* Analytics */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-2xl">
          📊
        </div>

        <h3 className="text-lg font-semibold text-white">
          Analytics
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/50">
          Track your performance, campaign insights and earnings.
        </p>

        <span className="mt-5 inline-flex rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-300">
          Coming Soon
        </span>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-2xl">
          🔔
        </div>

        <h3 className="text-lg font-semibold text-white">
          Notifications
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/50">
          Stay updated with campaigns, messages, payments and
          important alerts.
        </p>

        <span className="mt-5 inline-flex rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300">
          Coming Soon
        </span>
      </div>

      {/* Earnings */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-2xl">
          💰
        </div>

        <h3 className="text-lg font-semibold text-white">
          Earnings
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/50">
          View your earnings, payment history and withdrawals
          seamlessly.
        </p>

        <span className="mt-5 inline-flex rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
          Coming Soon
        </span>
      </div>

    </div>

{/* APP BANNER */}
<div className="mt-6 w-full overflow-hidden rounded-2xl border border-purple-400/20 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 px-2.5 py-4 sm:px-5 sm:py-6 md:px-7 md:py-7">

  <div className="flex w-full flex-row flex-nowrap items-center gap-2 sm:gap-4 md:gap-6">

    {/* LEFT — MOBILE PREVIEW */}
    <div className="flex shrink-0 items-center justify-center">

      <div className="relative h-32 w-16 rotate-[-7deg] rounded-[1rem] border border-white/15 bg-[#090812] p-1.5 shadow-2xl shadow-purple-700/30 sm:h-40 sm:w-20 sm:rounded-[1.2rem] sm:p-2 md:h-52 md:w-24 md:rounded-[1.4rem]">

        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[0.75rem] border border-white/10 bg-gradient-to-b from-[#171124] via-[#0d0b18] to-[#08070d] sm:rounded-[0.9rem] md:rounded-[1rem]">

          {/* Speaker */}
          <div className="absolute top-1.5 h-0.5 w-5 rounded-full bg-white/15 sm:top-2 sm:h-1 sm:w-6 md:w-7" />

          {/* Logo */}
          <div className="flex flex-col items-center">

            <div className="relative flex h-8 w-8 items-center justify-center sm:h-10 sm:w-10 md:h-12 md:w-12">

              <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 opacity-25 blur-md" />

              <span className="relative bg-gradient-to-br from-pink-400 via-fuchsia-400 to-purple-400 bg-clip-text text-3xl font-black leading-none text-transparent sm:text-4xl md:text-5xl">
                Z
              </span>

            </div>

            <p className="mt-1 text-[8px] font-bold tracking-wide text-white sm:text-[10px] md:mt-2 md:text-[13px]">
              Kolab
              <span className="bg-gradient-to-br from-pink-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                Z
              </span>
            </p>

          </div>

          {/* Bottom indicator */}
          <div className="absolute bottom-1 h-0.5 w-5 rounded-full bg-white/15 sm:bottom-2 sm:h-1 sm:w-7" />

        </div>

      </div>

    </div>


    {/* CENTER — BANNER CONTENT */}
    <div className="min-w-0 flex-1">

      <span className="inline-flex whitespace-nowrap rounded-full border border-pink-400/20 bg-pink-400/10 px-2 py-0.5 text-[8px] font-medium text-pink-300 sm:px-3 sm:py-1 sm:text-xs">
        Coming Soon
      </span>

      <h2 className="mt-2 text-[13px] font-bold leading-5 text-white sm:mt-3 sm:text-xl sm:leading-6 md:mt-4 md:text-3xl md:leading-9">
        🚀 Coming to the KolabZ App
      </h2>

      <p className="mt-1.5 max-w-xl text-[8px] leading-3.5 text-white/50 sm:mt-2 sm:text-xs sm:leading-5 md:mt-3 md:text-sm md:leading-6">
        We&apos;re building the ultimate platform for creators.
        Discover brands, find your perfect matches, manage
        collaborations and track your earnings - all in one place.
      </p>

      <div className="mt-2 sm:mt-4 md:mt-5">

        <span className="inline-flex whitespace-nowrap rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[8px] font-medium text-white/70 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs md:px-4 md:py-2 md:text-sm">
          📱 Mobile App - Coming Soon
        </span>

      </div>

    </div>


    {/* RIGHT — DISCOVER + EARNINGS */}
    <div className="flex shrink-0 flex-row flex-nowrap items-stretch gap-1.5 sm:gap-3">

      {/* DISCOVER */}
      <div className="w-[clamp(72px,17vw,176px)] overflow-hidden rounded-xl border border-white/10 bg-black/25 p-1.5 shadow-xl sm:rounded-2xl sm:p-2.5 md:p-3">

        <div className="flex items-center justify-between gap-1">

          <span className="truncate text-[8px] font-semibold text-white sm:text-[10px] md:text-xs">
            Discover
          </span>

          <span className="shrink-0 text-[6px] text-white/30 sm:text-[8px] md:text-[10px]">
            See all
          </span>

        </div>


        {/* Campaign Image */}
        <div className="mt-1.5 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] sm:mt-2 md:mt-3">

          <div className="relative h-12 w-full overflow-hidden sm:h-16 md:h-24">

            <img
              src="/summer-lifestyle-v2.png.png"
              alt="Summer Lifestyle Campaign"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <span className="absolute right-1 top-1 rounded-full bg-black/50 px-1 py-0.5 text-[5px] text-white/80 sm:right-1.5 sm:top-1.5 sm:px-1.5 sm:text-[7px] md:right-2 md:top-2 md:px-2 md:py-1 md:text-[8px]">
              New
            </span>

          </div>


          {/* Campaign Details */}
          <div className="p-1.5 sm:p-2 md:p-2.5">

            <p className="truncate text-[6px] font-medium text-white/40 sm:text-[8px] md:text-[9px]">
              NovaBrand
            </p>

            <p className="mt-0.5 truncate text-[8px] font-semibold leading-3 text-white sm:text-[10px] sm:leading-4 md:mt-1 md:text-[11px]">
              Summer Lifestyle
            </p>

            <div className="mt-1 flex items-center justify-between gap-1 sm:mt-1.5 md:mt-2">

              <span className="truncate rounded-md bg-purple-500/10 px-1 py-0.5 text-[5px] text-purple-300 sm:px-1.5 sm:py-1 sm:text-[7px] md:text-[8px]">
                Lifestyle
              </span>

              <span className="shrink-0 text-[6px] font-medium text-white/70 sm:text-[8px] md:text-[9px]">
                ₹15K–25K
              </span>

            </div>

          </div>

        </div>


        <div className="mt-1 flex items-center justify-between sm:mt-1.5 md:mt-2">

          <span className="text-[5px] text-white/30 sm:text-[7px] md:text-[8px]">
            92% match
          </span>

          <span className="text-[10px] text-pink-400 sm:text-xs md:text-sm">
            ♡
          </span>

        </div>

      </div>


      {/* EARNINGS */}
      <div className="w-[clamp(72px,17vw,176px)] rounded-xl border border-white/10 bg-black/25 p-1.5 shadow-xl sm:rounded-2xl sm:p-2.5 md:p-3">

        <div className="flex items-center justify-between gap-1">

          <span className="text-[8px] font-semibold text-white sm:text-[10px] md:text-xs">
            Earnings
          </span>

        </div>


        {/* Amount */}
        <div className="mt-2 sm:mt-3 md:mt-4">

          <p className="text-[6px] text-white/40 sm:text-[8px] md:text-[9px]">
            Total Earnings
          </p>

          <p className="mt-0.5 text-sm font-bold text-white sm:text-xl md:mt-1 md:text-2xl">
            ₹24.5K
          </p>

          <p className="mt-0.5 whitespace-nowrap text-[6px] text-green-400 sm:mt-1 sm:text-[8px] md:text-[9px]">
            ↑ 12.5% from last month
          </p>

        </div>


        {/* Chart */}
        <div className="mt-3 flex h-10 items-end gap-0.5 sm:mt-4 sm:h-14 sm:gap-1 md:mt-5 md:h-20 md:gap-1.5">

          <div className="h-2.5 w-1 rounded-t bg-purple-400/30 sm:h-4 sm:w-1.5 md:h-5 md:w-2" />

          <div className="h-4 w-1 rounded-t bg-purple-400/40 sm:h-6 sm:w-1.5 md:h-8 md:w-2" />

          <div className="h-3 w-1 rounded-t bg-pink-400/40 sm:h-5 sm:w-1.5 md:h-6 md:w-2" />

          <div className="h-5 w-1 rounded-t bg-pink-400/50 sm:h-8 sm:w-1.5 md:h-11 md:w-2" />

          <div className="h-4 w-1 rounded-t bg-purple-400/50 sm:h-6 sm:w-1.5 md:h-8 md:w-2" />

          <div className="h-6 w-1 rounded-t bg-pink-400/60 sm:h-10 sm:w-1.5 md:h-14 md:w-2" />

          <div className="h-5 w-1 rounded-t bg-purple-400/60 sm:h-8 sm:w-1.5 md:h-12 md:w-2" />

          <div className="h-7 w-1 rounded-t bg-pink-400/70 sm:h-11 sm:w-1.5 md:h-16 md:w-2" />

        </div>


        {/* Bottom Info */}
        <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-1.5 sm:mt-2.5 sm:pt-2 md:mt-3 md:pt-3">

          <span className="text-[5px] text-white/30 sm:text-[7px] md:text-[8px]">
            Available
          </span>

          <span className="text-[6px] font-semibold text-white/70 sm:text-[8px] md:text-[9px]">
            ₹18.2K
          </span>

        </div>

      </div>

    </div>

  </div>

</div>

   </section>
)}

{/* SETTINGS */}
{activeSection === "Settings" && (
  <section>
    <div className="mb-8 flex items-center justify-between">
  <h1 className="text-3xl font-bold text-white">
    Settings
  </h1>

  <button
    onClick={() => setActiveSection("Overview")}
    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white"
  >
    ← Back
  </button>
</div>


{/* Account */}
<div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
  <h2 className="text-lg font-semibold text-white">
    Account
  </h2>

  <div className="mt-5 space-y-4">
    <div>
      <label className="text-xs text-white/40">
        Email
      </label>

      <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
        {email}
      </div>
    </div>

    <button
      type="button"
      onClick={() => setShowChangePassword(! showChangePassword)}
      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 
      text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white"
    >
      <span>Change Password</span>
      <span className="text-white/30">→</span>
    </button>
  </div>
</div>

{showChangePassword && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c0b18] p-5 shadow-2xl shadow-black/50">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Change Password
          </h3>

          <p className="mt-1 text-xs text-white/40">
            Enter your new password below.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowChangePassword(false);
            setPasswordError("");
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.06] hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Current Password */}
<div className="relative mb-3">
  <input
    type={showCurrentPassword ? "text" : "password"}
    placeholder="Current Password"
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-white/30 focus:border-purple-400/50"
  />

  <button
    type="button"
    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white/80"
  >
    {showCurrentPassword ? "🙈" : "👁️"}
  </button>
</div>

      {/* New Password */}
      <div className="relative mb-3">
        <input
          type={showNewPassword ? "text" : "password"}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-white/30 focus:border-purple-400/50"
        />

        <button
          type="button"
          onClick={() => setShowNewPassword(!showNewPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white/80"
        >
          {showNewPassword ? "🙈" : "👁️"}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-white/30 focus:border-purple-400/50"
        />

        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white/80"
        >
          {showConfirmPassword ? "🙈" : "👁️"}
        </button>
      </div>

      {/* Error */}
      {passwordError && (
        <p className="mt-3 text-xs text-red-400">
          {passwordError}
        </p>
      )}

      {/* Update Button */}
      <button
        type="button"
        onClick={handleUpdatePassword}
        disabled={updatingPassword}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {updatingPassword ? "Updating..." : "Update Password"}
      </button>

      <button
  type="button"
  onClick={() => {
  setShowChangePassword(false);
  setPasswordError("");
  setForgotPasswordMessage("");
  setShowForgotPassword(true);
}}
  className="mt-3 w-full text-center text-xs text-purple-400 transition hover:text-purple-300"
>
  Forgot Password?
</button>

    </div>
  </div>
)}

    {showForgotPassword && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c0b18] p-5 shadow-2xl shadow-black/50">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Reset Password
          </h3>

          <p className="mt-1 text-xs text-white/40">
            We'll send a password reset link to your email.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForgotPassword(false);
            setForgotPasswordMessage("");
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.06] hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Email */}
      <input
        type="email"
        value={email}
        readOnly
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60 outline-none"
      />

      {/* Message */}
      {forgotPasswordMessage && (
        <p className="mt-3 text-xs text-purple-300">
          {forgotPasswordMessage}
        </p>
      )}

      {/* Send Reset Link */}
      <button
        type="button"
        onClick={handleForgotPassword}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Send Reset Link
      </button>

    </div>
  </div>
)}
  
{/* Notifications */}
<div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
  <h2 className="text-lg font-semibold text-white">
    Notifications
  </h2>

  <div className="mt-5 space-y-3">
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <span className="text-sm text-white/70">
        Email Notifications
      </span>

      <button
  type="button"
  onClick={async () => {
  const nextValue = !emailNotifications;

  setEmailNotifications(nextValue);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("user_settings")
    .upsert(
      {
        user_id: user.id,
        email_notifications: nextValue,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Email notification update error:", error);
  }
}}
  className={`h-5 w-9 rounded-full p-0.5 transition ${
    emailNotifications
      ? "bg-purple-500/30"
      : "bg-white/10"
  }`}
>
  <div
    className={`h-4 w-4 rounded-full transition ${
      emailNotifications
        ? "ml-4 bg-purple-400"
        : "ml-0 bg-white/70"
    }`}
  />
</button>
    
    </div>

    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <span className="text-sm text-white/70">
        Campaign Updates
      </span>

      <button
  type="button"
  onClick={async () => {
  const nextValue = !campaignUpdates;

  setCampaignUpdates(nextValue);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("user_settings")
    .upsert(
      {
        user_id: user.id,
        campaign_updates: nextValue,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Campaign updates error:", error);
  }
}}
  className={`h-5 w-9 rounded-full p-0.5 transition ${
    campaignUpdates
      ? "bg-purple-500/30"
      : "bg-white/10"
  }`}
>
  <div
    className={`h-4 w-4 rounded-full transition ${
      campaignUpdates
        ? "ml-4 bg-purple-400"
        : "ml-0 bg-white/70"
    }`}
  />
</button>
    </div>
  </div>
</div>

{/* Account Actions */}
<div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
  <h2 className="text-lg font-semibold text-white">
    Account Actions
  </h2>

  <div className="mt-5 space-y-3">
    <button
      type="button"
      onClick={async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(
        "Logout error:",
        JSON.stringify(error, null, 2)
      );
      return;
    }

    router.push("/login");
  } catch (error) {
    console.log(
      "Logout request failed:",
      JSON.stringify(error, null, 2)
    );
  }
}}
      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 
      text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white"
    >
      <span>Log Out</span>
      <span className="text-white/30">→</span>
    </button>

    <button
      type="button"
      onClick={() => setShowDeleteAccount(true)}
      className="flex w-full items-center justify-between rounded-xl border border-red-500/20 bg-red-500/[0.03] px-4 
      py-3 text-sm text-red-400 transition hover:bg-red-500/[0.08]"
    >
      <span>Delete Account</span>
      <span className="text-red-400/50">→</span>
    </button>
  </div>
</div>

        {showDeleteAccount && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
    <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#0c0b18] p-5 shadow-2xl shadow-black/50">

      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Delete Account
          </h3>

          <p className="mt-1 text-xs text-white/40">
            This action will permanently delete your KolabZ account.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowDeleteAccount(false)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.06] hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4">
        <p className="text-sm leading-6 text-red-300/80">
          Your profile, account access and associated data may be permanently
          deleted. This action cannot be undone.
        </p>
      </div>

      <div className="relative mt-4">
  <input
    type={showDeletePassword ? "text" : "password"}
    placeholder="Enter current password"
    value={deletePassword}
    onChange={(e) => setDeletePassword(e.target.value)}
    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-400/50"
  />

  <button
    type="button"
    onClick={() => setShowDeletePassword(!showDeletePassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white/80"
  >
    {showDeletePassword ? "🙈" : "👁️"}
  </button>
</div>

      {deleteError && ( <p className="mt-3 text-xs text-red-400">{deleteError}</p>)}

      {deletePasswordVerified && (
  <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4">
    <p className="text-sm font-medium text-red-300">
      Password verified ✓
    </p>

    <p className="mt-1 text-xs leading-5 text-white/50">
      Your password has been verified. Click Delete Account again to continue.
    </p>
  </div>
)}

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => setShowDeleteAccount(false)}
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/70 
          transition hover:bg-white/[0.07] hover:text-white"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDeleteAccountVerification}
          className="flex-1 rounded-xl bg-red-500/80 px-4 py-3 text-sm font-semibold text-white transition 
          hover:bg-red-500"
        >
          Delete Account
        </button>

      </div>

    </div>
  </div>
)}

</section>
)}


{/* PROFILE */}
{activeSection === "Profile" && (
  <section>

    {/* Header */}
    <div className="flex items-start justify-between gap-3">

      <div className="min-w-0">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Creator Profile
        </h1>

        <p className="mt-1 text-sm text-white/50 sm:mt-2">
          Manage your creator information and profile details.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setActiveSection("Overview")}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-xs text-white/70 transition hover:border-pink-500/30 hover:bg-white/5 hover:text-white sm:gap-2 sm:rounded-xl sm:px-3.5 sm:py-2.5 sm:text-sm"
      >
        <span>←</span>
        <span>Back</span>
      </button>

    </div>

    {/* Profile Card */}
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">

      {/* Avatar */}
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">

        <div className="relative shrink-0">

  <label
    htmlFor="avatar-upload"
    className="group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-300 to-purple-500 text-3xl font-bold"
  >

    {avatarUrl ? (
      <img
        src={avatarUrl}
        alt="Profile"
        className="h-full w-full object-cover"
      />
    ) : (
      name.charAt(0).toUpperCase()
    )}

    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium opacity-0 transition group-hover:opacity-100">
      Change
    </div>

  </label>

  <input
    id="avatar-upload"
    type="file"
    accept="image/*"
    onChange={handleAvatarUpload}
    disabled={uploadingAvatar}
    className="hidden"
  />

</div>

        <div className="mt-4 sm:ml-5 sm:mt-0">
          <h2 className="text-xl font-bold">
            {name}
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Creator
          </p>
        </div>

      </div>

      {/* Profile Information */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2">

        {/* Full Name */}
        <div>
          <label className="text-sm text-white/50">
            Full Name
          </label>

          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500/50"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-white/50">
            Email
          </label>

          <input
            type="email"
            value={email}
            disabled
            placeholder="Your email"
            className="mt-2 w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/40 outline-none"
          />
        </div>

        {/* Niche */}
        <div>
          <label className="text-sm text-white/50">
            Creator Niche
          </label>

<div className="relative mt-2">

  {/* Selected Niche */}
  <button
    type="button"
    onClick={() => setShowNicheDropdown((prev) => !prev)}
    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white outline-none transition hover:border-pink-500/40"
  >
    <span className={niche ? "text-white" : "text-white/30"}>
      {niche || "Select your niche"}
    </span>

    <span
      className={`text-white/40 transition-transform ${
        showNicheDropdown ? "rotate-180" : ""
      }`}
    >
      ▼
    </span>
  </button>

  {/* Dropdown */}
  {showNicheDropdown && (
    <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0b0b16] shadow-2xl">

      <div className="max-h-56 overflow-y-auto">

        {[
          "Technology",
          "Gaming",
          "Fashion",
          "Beauty",
          "Lifestyle",
          "Fitness",
          "Food",
          "Travel",
          "Education",
          "Finance",
          "Entertainment",
          "Music",
          "Photography",
          "Comedy",
          "Sports",
          "Art & Design",
          "Health & Wellness",
          "Business",
          "Vlogs",
          "Other",
        ].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setNiche(option);
              setShowNicheDropdown(false);
            }}
            className={`w-full px-4 py-3 text-left text-sm transition hover:bg-pink-500/10 hover:text-pink-300 ${
              niche === option
                ? "bg-pink-500/10 text-pink-400"
                : "text-white/70"
            }`}
          >
            {option}
          </button>
        ))}

      </div>

    </div>
  )}

</div>

        </div>

        {/* Location */}
        <div>
          <label className="text-sm text-white/50">
            Location
          </label>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Darbhanga, Bihar"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-pink-500/50"
          />
        </div>

        {/* Instagram */}
        <div>
          <label className="text-sm text-white/50">
            Instagram
          </label>

          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@username"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-pink-500/50"
          />
        </div>

        {/* Instagram Followers */}
<div>
  <label className="text-sm text-white/50">
    Instagram Followers
  </label>

  <input
    type="number"
    min="0"
    value={instagramFollowers}
    onChange={(e) => setInstagramFollowers(e.target.value)}
    placeholder="e.g. 12500"
    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-pink-500/50"
  />
</div>

        {/* YouTube */}
        <div>
          <label className="text-sm text-white/50">
            YouTube
          </label>

          <input
            type="text"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            placeholder="Channel name or URL"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-pink-500/50"
          />
        </div>

      </div>

      {/* Bio */}
      <div className="mt-5">

        <label className="text-sm text-white/50">
          Bio
        </label>

        <textarea
          rows={5}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell brands a little about yourself..."
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-pink-500/50"
        />

      </div>

      {/* Profile Completion */}
      <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm font-semibold">
              Profile Completion
            </p>

            <p className="mt-1 text-xs text-white/40">
              Complete your profile to improve your chances of collaboration.
            </p>
          </div>

          <span className="text-sm font-semibold text-pink-400">
  {profileCompletion}%
</span>

        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
           style={{ width: `${profileCompletion}%` }}
          />

        </div>

      </div>

      {/* Save */}
      <button
  type="button"
  onClick={handleSaveProfile}
  disabled={savingProfile}
  className="mt-6 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-3 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
>
  {savingProfile ? "Saving..." : "Save Profile"}
</button>

     {profileMessage && (
  <p className="mt-3 text-center text-sm text-white/60">
    {profileMessage}
  </p>
)}

    </div>

  </section>
)}

{/* CAMPAIGNS */}

{activeSection === "Campaigns" && (
  <section>

    <div className="flex items-start justify-between gap-3">

      <div className="min-w-0">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Campaigns
        </h1>

        <p className="mt-1 text-sm text-white/50 sm:mt-2">
          Explore collaboration opportunities from brands.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setActiveSection("Overview")}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-xs text-white/70 transition hover:border-pink-500/30 hover:bg-white/5 hover:text-white sm:gap-2 sm:rounded-xl sm:px-3.5 sm:py-2.5 sm:text-sm"
      >
        <span>←</span>
        <span>Back</span>
      </button>

    </div>

    <div className="mt-8">

      {loadingCampaigns ? (

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="text-sm text-white/50">
            Loading campaigns...
          </p>
        </div>

      ) : campaignError ? (

        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-400">
          {campaignError}
        </div>

      ) : campaigns.length === 0 ? (

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="text-sm text-white/50">
            No campaigns available right now.
          </p>
        </div>

      ) : (

        <div className="grid gap-5 md:grid-cols-2">

          {campaigns.map((campaign) => (

            <div
              key={campaign.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-pink-500/30"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                  <p className="text-sm text-pink-400">
                    {campaign.product_brand || "Brand"}
                  </p>

                  <h2 className="mt-2 min-h-[56px] text-xl font-semibold leading-7">
                    {campaign.campaign_name}
                  </h2>

                </div>

                <span className="shrink-0 rounded-full bg-pink-500/10 px-3 py-1 text-xs text-pink-400">
                  {campaign.category}
                </span>

              </div>

              <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/50">
                {campaign.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">

                <div>
                  <p className="text-xs text-white/40">
                    Budget
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    ₹{Number(campaign.total_budget || 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-white/40">
                    Deadline
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {campaign.application_deadline
                      ? new Date(
                          `${campaign.application_deadline}T00:00:00`
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "No deadline"}
                  </p>
                </div>

              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">

                <div>
                  <p className="text-xs text-white/40">
                    Platform
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {campaign.platform}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-white/40">
                    Content
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {campaign.content_type}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/dashboard/creator/campaigns/${campaign.id}`
                  )
                }
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-3 text-sm font-semibold transition hover:opacity-90"
              >
                View Campaign
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  </section>
)}


{/* My Applications */}

{String(activeSection) === "My Applications" && (
  <div className="mt-8">
    <div className="mb-5">
      <h2 className="text-xl font-bold text-white">
        My Applications
      </h2>

      <p className="mt-1 text-sm text-gray-400">
        Track the status of your campaign applications
      </p>
    </div>

    {loadingApplications ? (
      <div className="rounded-2xl border border-gray-800 bg-[#111111] p-6 text-center">
        <p className="text-sm text-gray-400">
          Loading applications...
        </p>
      </div>
    ) : myApplications.filter(
        (application) =>
          application.status === "pending" ||
          application.status === "accepted"
      ).length === 0 ? (
      <div className="rounded-2xl border border-gray-800 bg-[#111111] p-8 text-center">
        <p className="text-sm text-gray-400">
          You haven't applied to any campaigns yet.
        </p>  k
      </div>
    ) : (
      <div className="space-y-4">
        {myApplications
          .filter(
            (application) =>
              application.status === "pending" ||
              application.status === "accepted"
          )
          .map((application) => {
            const campaign = campaigns.find(
              (item) => item.id === application.campaign_id
            );

            return (
              <div
                key={application.id}
                className="rounded-2xl border border-gray-800 bg-[#111111] p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {campaign?.campaign_name || "Campaign"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      {campaign?.product_brand || "Brand"}{" "}
                      {campaign?.category
                        ? `• ${campaign.category}`
                        : ""}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      Applied on{" "}
                      {new Date(
                        application.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
  {application.status === "accepted" && (
    <button
      type="button"
      onClick={() => setActiveSection("Projects")}
      className="w-fit rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400 transition hover:bg-purple-500/20"
    >
      View Project
    </button>
  )}

  <span
    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
      application.status === "accepted"
        ? "bg-green-500/10 text-green-400"
        : "bg-yellow-500/10 text-yellow-400"
    }`}
  >
    {application.status === "accepted"
      ? "Accepted"
      : "Pending"}
  </span>
</div>
                </div>
              </div>
            );
          })}
      </div>
    )}
  </div>
)}

{/* PROJECTS */}

{String(activeSection) === "Projects" && (
  <section className="mt-8">

    {/* Header */}
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold text-white">
          Projects
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Track your active collaborations
        </p>
      </div>

      <button
        type="button"
        onClick={() => setActiveSection("Overview")}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/70 transition hover:border-pink-500/30 hover:bg-white/5 hover:text-white sm:text-sm"
      >
        <span>←</span>
        <span>Back</span>
      </button>
    </div>

    {/* Accepted Projects */}
    <div className="mt-6 space-y-4">

      {myApplications.filter(
        (application) => application.status === "accepted"
      ).length === 0 ? (

        <div className="rounded-2xl border border-gray-800 bg-[#111111] p-8 text-center">
          <p className="text-sm text-gray-400">
            No active projects yet.
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Accepted campaign applications will appear here.
          </p>
        </div>

      ) : (

        myApplications
          .filter(
            (application) => application.status === "accepted"
          )
          .map((application) => {

            const campaign = campaigns.find(
              (item) => item.id === application.campaign_id
            );

            return (
              <div
                key={application.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-pink-500/30 sm:p-6"
              >

                {/* Project Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div className="min-w-0">

                    <h3 className="break-words text-base font-semibold text-white sm:text-lg">
                      {campaign?.campaign_name || "Project"}
                    </h3>

                    <p className="mt-1 text-sm text-white/40">
                      {campaign?.product_brand || "Brand"}
                      {campaign?.category
                        ? ` • ${campaign.category}`
                        : ""}
                    </p>

                  </div>

                  <span
  className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
    application.project_status === "completed"
      ? "bg-blue-500/10 text-blue-400"
      : "bg-green-500/10 text-green-400"
  }`}
>
  {application.project_status === "completed"
    ? "Completed"
    : "Active"}
</span>

                </div>

                {/* Project Info */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <p className="text-[11px] text-white/30">
                      Budget
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      ₹{campaign?.budget_per_creator || campaign?.total_budget || "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <p className="text-[11px] text-white/30">
                      Platform
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {campaign?.platform || "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <p className="text-[11px] text-white/30">
                      Content Type
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {campaign?.content_type || "—"}
                    </p>
                  </div>

                </div>

                <div className="mt-5 flex flex-wrap justify-end gap-2">
  <button
    type="button"
    onClick={() =>
      handleMessageBrand(campaign?.id)
    }
    disabled={!campaign?.id}
    className="rounded-xl border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-400 transition hover:bg-pink-500/20 disabled:cursor-not-allowed disabled:opacity-40"
  >
    Message Brand
  </button>

  {application.project_status !== "completed" && (
    <button
      type="button"
      onClick={() =>
        handleMarkProjectCompleted(application.id)
      }
      className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400 transition hover:bg-green-500/20"
    >
      Mark as Completed
    </button>
  )}
</div>

              </div>
            );
          })

      )}

    </div>

  </section>
)}

{/* MESSAGES */}

{activeSection === "Messages" && (
<section>

  <div className="flex items-center justify-between gap-3">

    <div className="min-w-0">
      <h1 className="text-2xl font-bold sm:text-3xl">
        Messages
      </h1>

      <p className="mt-1 text-sm text-white/50 sm:mt-2">
        Your conversations and collaboration messages.
      </p>
    </div>


    <button
      type="button"
      onClick={() => setActiveSection("Overview")}
      className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 
      text-xs text-white/70 transition hover:border-pink-500/30 hover:bg-white/5 hover:text-white sm:gap-2 sm:rounded-xl sm:px-3.5 sm:py-2.5 sm:text-sm"
    >
      <span>←</span>
      <span>Back</span>
    </button>

  </div>
    <div className="mt-8 space-y-3">

{loadingConversations ? (

  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
    <p className="text-sm text-white/40">
      Loading conversations...
    </p>
  </div>

) : conversations.length === 0 ? (

  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-xl">
      💬
    </div>

    <h3 className="mt-4 text-base font-semibold text-white">
      No conversations yet
    </h3>

    <p className="mt-2 text-sm text-white/40">
      Your conversations with brands will appear here.
    </p>
  </div>

) : (

  conversations.map((chat) => (

    <button
      key={chat.id}
      type="button"
      onClick={() =>
        router.push(
          `/dashboard/creator/messages/${chat.id}`
        )
      }
      className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-pink-500/30 hover:bg-white/5"
    >

      {/* Avatar */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-sm font-bold">

        {chat.brand_avatar ? (
          <img
            src={chat.brand_avatar}
            alt={chat.brand_name}
            className="h-full w-full object-cover"
          />
        ) : (
          chat.brand_name?.charAt(0)?.toUpperCase() || "B"
        )}

      </div>

      {/* Message */}
      <div className="min-w-0 flex-1">

        <div className="flex items-center justify-between gap-3">

          <p className="truncate font-semibold text-white">
            {chat.brand_name}
          </p>

          <span className="shrink-0 text-xs text-white/30">
            {new Date(
              chat.latest_message_time
            ).toLocaleDateString()}
          </span>

        </div>

        <p className="mt-1 truncate text-sm text-white/40">
          {chat.latest_message}
        </p>

      </div>

    </button>

  ))

)}
</div>



  </section>
)}

      </div>

      </div>

    </div>
  );
}