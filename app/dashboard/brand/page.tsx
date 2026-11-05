"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function BrandDashboard() {
  const router = useRouter();
  const [name, setName] = useState("Brand");
  const [editName, setEditName] = useState("");
  const [email, setEmail] = useState("");
  const [activeSection, setActiveSection] = useState("Overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
const [productBrand, setProductBrand] = useState("");
const [campaignCategory, setCampaignCategory] = useState("");
const [campaignDescription, setCampaignDescription] = useState("");

const [campaignPlatform, setCampaignPlatform] = useState("");
const [contentType, setContentType] = useState("");
const [creatorsRequired, setCreatorsRequired] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [deliverables, setDeliverables] = useState("");

const [preferredNiche, setPreferredNiche] = useState("");
const [minimumFollowers, setMinimumFollowers] = useState("");
const [preferredLocation, setPreferredLocation] = useState("");
const [targetAudience, setTargetAudience] = useState("");

const [totalBudget, setTotalBudget] = useState("");
const [budgetPerCreator, setBudgetPerCreator] = useState("");
const [paymentTerms, setPaymentTerms] = useState("");

const [applicationDeadline, setApplicationDeadline] = useState("");
const [whoCanApply, setWhoCanApply] = useState("everyone");
const [additionalInstructions, setAdditionalInstructions] = useState("");

const [publishingCampaign, setPublishingCampaign] = useState(false);
const [campaignMessage, setCampaignMessage] = useState("");

  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [brandCategory, setBrandCategory] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState(""); 
  const [location, setLocation] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const [emailNotifications, setEmailNotifications] = useState(true);
  useEffect(() => {
  const loadBrandSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;
    setBrandEmail(user.email ?? "");

    const { data, error } = await supabase
      .from("brand_settings")
      .select("email_notifications, campaign_updates")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error(
  "Settings load error: " +
  error.message +
  " | Code: " +
  error.code +
  " | Details: " +
  error.details +
  " | Hint: " +
  error.hint
);
      return;
    }

    if (data) {
      setEmailNotifications(data.email_notifications);
      setCampaignUpdates(data.campaign_updates);
    }
  };

  loadBrandSettings();
  loadBrandProfile();
}, []);

const handleSaveBrandProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("User not found.");
    return;
  }

  const { error } = await supabase
    .from("brand_profiles")
    .upsert({
      user_id: user.id,
      brand_name: brandName,
      username,
      category,
      business_type: businessType,
      description,
      instagram,
      youtube,
      linkedin,
      country,
      state,
      business_email: businessEmail,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Error saving brand profile:", error);
    alert("Failed to save profile.");
    return;
  }

  alert("Brand profile saved successfully!");
};

const handleLogoUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image file.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Image size must be less than 5MB.");
    return;
  }

  setLogoUploading(true);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("User not found.");
      return;
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/logo-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("brand-logos")
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
  console.error("Logo upload error:", uploadError);
  alert(`Upload failed: ${uploadError.message}`);
  return;
}

    const { data: publicUrlData } = supabase.storage
      .from("brand-logos")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    const { error: profileError } = await supabase
      .from("brand_profiles")
      .upsert({
        user_id: user.id,
        logo_url: publicUrl,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error("Logo profile save error:", profileError);
      alert("Logo uploaded but profile could not be updated.");
      return;
    }

    setLogoUrl(publicUrl);

    alert("Brand logo uploaded successfully!");
  } catch (error) {
    console.error("Logo upload error:", error);
    alert("Something went wrong while uploading the logo.");
  } finally {
    setLogoUploading(false);
    e.target.value = "";
  }
};

const loadBrandProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("brand_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error loading brand profile:", error);
    return;
  }

  if (!data) return;

  setBrandName(data.brand_name || "");
  setUsername(data.username || "");
  setCategory(data.category || "");
  setBusinessType(data.business_type || "");

  setDescription(data.description || "");

  setInstagram(data.instagram || "");
  setYoutube(data.youtube || "");
  setLinkedin(data.linkedin || "");

  setCountry(data.country || "");
  setState(data.state || "");
  setBusinessEmail(data.business_email || "");
};
  
const [confirmNewPassword, setConfirmNewPassword] = useState("");
const [passwordMessage, setPasswordMessage] = useState("");
const [passwordLoading, setPasswordLoading] = useState(false);

const [brandName, setBrandName] = useState("");
const [username, setUsername] = useState("");
const [category, setCategory] = useState("");
const [businessType, setBusinessType] = useState("");


const [instagram, setInstagram] = useState("");
const [youtube, setYoutube] = useState("");
const [linkedin, setLinkedin] = useState("");

const [country, setCountry] = useState("");
const [state, setState] = useState("");
const [businessEmail, setBusinessEmail] = useState("");
  
  const [brandEmail, setBrandEmail] = useState("");
  const [campaignUpdates, setCampaignUpdates] = useState(true);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [deletePasswordVerified, setDeletePasswordVerified] = useState(false);
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<any | null>(null);
  const [creatorProfiles, setCreatorProfiles] = useState<any[]>([]);

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [campaignTab, setCampaignTab] = useState("All");
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);

  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [updatingApplication, setUpdatingApplication] = useState(false);

  const [applicationsCount, setApplicationsCount] = useState(0);

  const [conversations, setConversations] = useState<any[]>([]);
const [loadingConversations, setLoadingConversations] = useState(false);

const [chatMessages, setChatMessages] = useState<any[]>([]);
const [chatInput, setChatInput] = useState("");
const [loadingChatMessages, setLoadingChatMessages] = useState(false);
const [sendingMessage, setSendingMessage] = useState(false);

const fetchChatMessages = async () => {
  if (!selectedConversation) return;

  setLoadingChatMessages(true);

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setChatMessages([]);
      return;
    }

    // Verify that this conversation belongs to the logged-in brand.
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", selectedConversation)
      .eq("brand_id", user.id)
      .maybeSingle();

      

    if (conversationError || !conversation) {
      console.error(
        "Conversation verification error:",
        conversationError
      );
      setChatMessages([]);
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .select("id, conversation_id, sender_id, sender_type, content, created_at, deleted")
      .eq("conversation_id", selectedConversation)
      .eq("deleted", false)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Chat messages fetch error:", error);
      setChatMessages([]);
      return;
    }

    setChatMessages(data || []);
  } catch (error) {
    console.error("Fetch chat messages error:", error);
    setChatMessages([]);
  } finally {
    setLoadingChatMessages(false);
  }
};

const handleSendMessage = async () => {
  const content = chatInput.trim();

  if (!content || !selectedConversation || sendingMessage) return;

  setSendingMessage(true);

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Please log in again to send a message.");
      return;
    }

    // Verify conversation ownership before inserting a message.
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", selectedConversation)
      .eq("brand_id", user.id)
      .maybeSingle();

    if (conversationError || !conversation) {
  console.error("Conversation verification details:", {
    selectedConversation,
    loggedInBrandId: user.id,
    conversation,
    conversationError,
  });

  setChatMessages([]);
  return;
}

    const { data: newMessage, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: selectedConversation,
        sender_id: user.id,
        sender_type: "brand",
        content,
      })
      .select("id, conversation_id, sender_id, sender_type, content, created_at, deleted")
      .single();

    if (error) {
      console.error("Send message error:", error);
      alert(`Message send failed: ${error.message}`);
      return;
    }

    setChatMessages((previous) => [...previous, newMessage]);
    setChatInput("");

    // Refresh the conversation list so its latest message updates.
    await fetchConversations();
  } catch (error) {
    console.error("Send message error:", error);
    alert("Something went wrong while sending the message.");
  } finally {
    setSendingMessage(false);
  }
};

useEffect(() => {
  if (!selectedConversation) {
    setChatMessages([]);
    setChatInput("");
    return;
  }

  setChatMessages([]);
  setChatInput("");
  void fetchChatMessages();
}, [selectedConversation]);

const fetchConversations = async () => {
  setLoadingConversations(true);

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setConversations([]);
      return;
    }

    // Fetch conversations belonging to this brand
    const { data: conversationData, error: conversationError } =
      await supabase
        .from("conversations")
        .select("id, creator_id, brand_id, created_at")
        .eq("brand_id", user.id)
        .order("created_at", { ascending: false });

    if (conversationError) {
      console.error("Brand conversations fetch error:", conversationError);
      setConversations([]);
      return;
    }

    const conversationList = conversationData || [];

    if (conversationList.length === 0) {
      setConversations([]);
      return;
    }

    // Fetch creator profiles
    const creatorIds = [
      ...new Set(conversationList.map((conversation) => conversation.creator_id)),
    ];

    const { data: creatorProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", creatorIds);

    if (profilesError) {
      console.error("Creator profiles fetch error:", profilesError);
    }

    // Fetch the latest message for each conversation
    const conversationsWithMessages = await Promise.all(
      conversationList.map(async (conversation) => {
        const { data: messageData, error: messageError } = await supabase
          .from("messages")
          .select("content, created_at, sender_id")
          .eq("conversation_id", conversation.id)
          .eq("deleted", false)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (messageError) {
          console.error("Latest message fetch error:", messageError);
        }

        const creator = (creatorProfiles || []).find(
          (profile) => profile.id === conversation.creator_id
        );

        return {
          ...conversation,
          creator_name: creator?.full_name || "Creator",
          creator_avatar: creator?.avatar_url || null,
          latest_message: messageData?.content || "No messages yet",
          latest_message_time:
            messageData?.created_at || conversation.created_at,
        };
      })
    );

    setConversations(conversationsWithMessages);
  } catch (error) {
    console.error("Brand conversations error:", error);
    setConversations([]);
  } finally {
    setLoadingConversations(false);
  }
};

  const publishCampaign = async () => {
  setCampaignMessage("");

  if (
    !campaignName.trim() ||
    !campaignCategory ||
    !campaignDescription.trim() ||
    !campaignPlatform ||
    !contentType ||
    !totalBudget
  ) {
    setCampaignMessage("Please fill all required fields.");
    return;
  }

  setPublishingCampaign(true);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCampaignMessage("You must be logged in.");
      return;
    }

    const { error } = await supabase
      .from("campaigns")
      .insert({
        brand_id: user.id,
        campaign_name: campaignName.trim(),
        product_brand: productBrand.trim() || null,
        category: campaignCategory,
        description: campaignDescription.trim(),
        platform: campaignPlatform,
        content_type: contentType,
        creators_required: creatorsRequired
          ? Number(creatorsRequired)
          : null,
        start_date: startDate || null,
        end_date: endDate || null,
        deliverables: deliverables.trim() || null,
        preferred_niche: preferredNiche || null,
        minimum_followers: minimumFollowers
          ? Number(minimumFollowers)
          : null,
        preferred_location: preferredLocation.trim() || null,
        target_audience: targetAudience.trim() || null,
        total_budget: Number(totalBudget),
        budget_per_creator: budgetPerCreator
          ? Number(budgetPerCreator)
          : null,
        payment_terms: paymentTerms.trim() || null,
        application_deadline: applicationDeadline || null,
        who_can_apply: whoCanApply,
        additional_instructions:
          additionalInstructions.trim() || null,
        status: "published",
      });

    if (error) {
      console.error(error);
      setCampaignMessage(error.message);
      return;
    }

    setCampaignMessage("Campaign published successfully.");
    setActiveSection("Campaigns");
  } catch (error) {
    console.error(error);
    setCampaignMessage("Something went wrong.");
  } finally {
    setPublishingCampaign(false);
  }
};

const fetchCampaigns = async () => {
  setLoadingCampaigns(true);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("brand_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setCampaigns(data || []);
    const campaignIds = (data || []).map((campaign) => campaign.id);

if (campaignIds.length === 0) {
  setApplicationsCount(0);
} else {
  const { count, error: applicationsError } = await supabase
    .from("campaign_applications")
    .select("id", { count: "exact", head: true })
    .in("campaign_id", campaignIds);

  if (applicationsError) {
    console.error("Applications count error:", applicationsError);
    setApplicationsCount(0);
  } else {
    setApplicationsCount(count ?? 0);
  }
}
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingCampaigns(false);
  }
};

const fetchApplications = async () => {
  setLoadingApplications(true);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setApplications([]);
      return;
    }

    // Get campaigns owned by the current brand
    const { data: brandCampaigns, error: campaignsError } = await supabase
      .from("campaigns")
      .select("id")
      .eq("brand_id", user.id);

    if (campaignsError) {
      console.error("Brand campaigns fetch error:", campaignsError);
      setApplications([]);
      return;
    }

    const campaignIds = (brandCampaigns || []).map(
      (campaign) => campaign.id
    );

    // Brand has no campaigns
    if (campaignIds.length === 0) {
      setApplications([]);
      return;
    }

    // Get applications only for this brand's campaigns
    const { data, error } = await supabase
      .from("campaign_applications")
      .select("*")
      .in("campaign_id", campaignIds)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Applications fetch error:", error);
      setApplications([]);
      return;
    }

    setApplications(data || []);
  } catch (error) {
    console.error("Applications fetch error:", error);
    setApplications([]);
  } finally {
    setLoadingApplications(false);
  }
};

const updateApplicationStatus = async (
  applicationId: string,
  status: "accepted" | "rejected"
) => {
  if (!selectedApplication) return;

  setUpdatingApplication(true);

  const { error } = await supabase
    .from("campaign_applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) {
    console.error("Application status update error:", error);
    setUpdatingApplication(false);
    return;
  }

  // Update the selected application on screen
  setSelectedApplication({
    ...selectedApplication,
    status,
  });

  // Update the application in the list
  setApplications((currentApplications) =>
    currentApplications.map((application) =>
      application.id === applicationId
        ? { ...application, status }
        : application
    )
  );

  setUpdatingApplication(false);
};

  useEffect(() => {
  const loadCreators = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, full_name, email, niche, bio, instagram, instagram_followers, youtube, location, avatar_url"
      )
      .eq("role", "creator")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading creators:", error);
      return;
    }

    setCreatorProfiles(data || []);
  };

  loadCreators();
}, []);

  useEffect(() => {
    const loadBrandProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setName(user.user_metadata?.name || "Brand");
      setEditName(user.user_metadata?.name || "Brand");
      setEmail(user.email || "");

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "full_name, email, niche, bio, instagram, youtube, location, avatar_url, role"
        )
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Brand profile load error:", error);
        return;
      }

      if (data) {
        setName(data.full_name || "Brand");
        setEditName(data.full_name || "Brand");
        setEmail(data.email || user.email || "");
        setBrandCategory(data.niche || "");
        setDescription(data.bio || "");
        setWebsite(data.youtube || "");
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
    fetchCampaigns();
    loadBrandProfile();
  }, []);

  useEffect(() => {
  fetchConversations();
}, []);

  useEffect(() => {
  if (activeSection === "Applications") {
    fetchApplications();
  }
}, [activeSection]);

  const getCampaignStatus = (deadline: string | null) => {
  if (!deadline) return "Active";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(`${deadline}T00:00:00`);
  deadlineDate.setHours(0, 0, 0, 0);

  return deadlineDate >= today ? "Active" : "Completed";
};

 const filteredCampaigns = campaigns.filter((campaign) => {
  const status = getCampaignStatus(campaign.application_deadline);

  return campaignTab === "All" || status === campaignTab;
});

const handleChangePassword = async () => {
  setPasswordError("");

  if (!currentPassword || !newPassword || !confirmPassword) {
    setPasswordError("Please fill all password fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordError("New passwords do not match.");
    return;
  }

  if (newPassword.length < 6) {
    setPasswordError("Password must be at least 6 characters.");
    return;
  }

  setUpdatingPassword(true);

  try {
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: brandEmail,
      password: currentPassword,
    });

    if (verifyError) {
      setPasswordError("Current password is incorrect.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setPasswordError(updateError.message);
      return;
    }

    setShowChangePassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");

    alert("Password updated successfully!");
  } catch {
    setPasswordError("Something went wrong. Please try again.");
  } finally {
    setUpdatingPassword(false);
  }
};

const handleForgotPassword = async () => {
  setForgotPasswordMessage("");

  if (!brandEmail) {
    setForgotPasswordMessage("Brand email not found.");
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(
    brandEmail,
    {
      redirectTo: `${window.location.origin}/reset-password`,
    }
  );

  if (error) {
    setForgotPasswordMessage(error.message);
    return;
  }

  setForgotPasswordMessage(
    "Password reset link sent! Please check your email."
  );
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

  return (
    <div className="flex h-screen bg-[#050509] text-white">

  {/* MOBILE SIDEBAR OVERLAY */}
  {mobileMenuOpen && activeSection !== "Create Campaign" && (
  <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] md:hidden"
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside className="fixed left-0 top-0 z-50 h-screen w-[78%] max-w-[320px] border-r border-white/10 bg-[#080812] shadow-2xl shadow-black/50 md:hidden">
        <div className="flex h-full flex-col p-5">

          {/* Logo */}
          <div className="mb-10 text-2xl font-black">
            Kolab
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Z
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">

            {[
              ["🏠", "Overview"],
              ["📢", "Campaigns"],
              ["📋", "Applications"],
              ["💬", "Messages"],
              ["👥", "Creator Pool"],
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
                    ? "bg-pink-500/15 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-base">
                  {icon}
                </span>

                <span>
                  {label}
                </span>
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
      router.push("/dashboard/brand/brand-subscription")
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
              onClick={() => {
                setActiveSection("Profile");
                setMobileMenuOpen(false);
              }}
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

              <div className="min-w-0">

                <p className="truncate text-sm font-semibold">
                  {name}
                </p>

                <p className="text-[11px] text-white/40">
                  Brand
                </p>

              </div>

            </button>

          </div>

        </div>
      </aside>
    </>
  )}


  {/* DESKTOP SIDEBAR */}
 <aside
  className={`${
    activeSection === "Create Campaign" ||
    (activeSection === "Messages" && selectedConversation) ||
    selectedCreator
      ? "hidden"
      : "hidden h-screen w-56 shrink-0 flex-col border-r border-white/10 bg-[#070711] p-5 md:flex"
  }`}
>

    {/* Logo */}
    <div className="mb-10 text-2xl font-black">
      Kolab
      <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
        Z
      </span>
    </div>

    {/* Navigation */}
    <nav className="space-y-2">

      {[
        ["🏠", "Overview"],
        ["📢", "Campaigns"],
        ["📋", "Applications"],
        ["💬", "Messages"],
        ["👥", "Creator Pool"],
        ["✨", "In-App Features"],
        ["⚙️", "Settings"],
      ].map(([icon, label]) => (

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

          <span>
            {icon}
          </span>

          <span>
            {label}
          </span>

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
      router.push("/dashboard/brand/brand-subscription")
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

        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-300 to-purple-500 text-sm font-semibold">

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

        <div className="min-w-0">

          <p className="truncate text-sm font-semibold">
            {name}
          </p>

          <p className="text-[11px] text-white/40">
            Brand
          </p>

        </div>

      </button>

    </div>

    

  </aside>


  {/* MAIN AREA */}
  <div className="min-w-0 flex-1 overflow-y-scroll">

    {/* TOP NAVIGATION */}
    <header className="border-b border-white/10 bg-white/[0.02]">

      {/* Mobile Header */}
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
          {activeSection !== "Create Campaign" && (
  <button
    type="button"
    onClick={() => setMobileMenuOpen(true)}
    className="flex h-9 w-9 items-center justify-center text-xl text-white/70 transition hover:text-white"
  >
    ☰
  </button>
)}

        </div>

      </div>


      {/* Desktop Header */}
      <div className="mx-auto hidden max-w-7xl items-center justify-between px-6 py-4 md:flex">

        {/* Logo */}
        <div className="text-2xl font-black">
          Kolab
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Z
          </span>
        </div>

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
              Brand
            </p>

          </div>

        </button>

      </div>

    </header>


    {/* DASHBOARD CONTENT */}
    <div className="mx-auto max-w-7xl px-6 py-8">

      {activeSection === "Overview" && (
  <div>

    {/* Welcome */}
    <div>
      <h1 className="text-3xl font-bold">
        Welcome, {name} 👋
      </h1>

      <p className="mt-2 text-white/50">
        Here&apos;s what&apos;s happening with your brand.
      </p>
    </div>


    {/* Stats */}
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {[
  [
    String(
      campaigns.filter(
        (campaign) =>
          getCampaignStatus(campaign.application_deadline) === "Completed"
      ).length
    ),
    "Completed Campaigns",
  ],
  [String(applicationsCount), "Applications Received"],
  [
    String(
      campaigns.filter(
        (campaign) =>
          getCampaignStatus(campaign.application_deadline) === "Active"
      ).length
    ),
    "Active Campaigns",
  ],
  ["₹0", "Total Spend"],
].map((stat) => (

        <div
          key={stat[1]}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-pink-500/20"
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


{/* Recommended Creators */}

<section className="lg:col-span-2">
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-semibold">
      Recommended Creators
    </h2><button
  type="button"
  onClick={() => {
    setSelectedCreator(null);
    setActiveSection("Creator Pool");
  }}
  className="text-sm text-pink-400 transition hover:text-pink-300"
>
  Discover all →
</button>

  </div>  <div className="mt-4 grid gap-4 md:grid-cols-2">
    {creatorProfiles.slice(0, 2).map((creator) => (
      <div
        key={creator.id}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-pink-500/30"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-sm font-bold">
              {creator.avatar_url ? (
                <img
                  src={creator.avatar_url}
                  alt={creator.full_name || "Creator"}
                  className="h-full w-full object-cover"
                />
              ) : (
                creator.full_name?.charAt(0).toUpperCase() || "C"
              )}
            </div>        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {creator.full_name || "Unnamed Creator"}
          </p>

          <p className="mt-1 truncate text-xs text-white/40">
            {creator.instagram
              ? `@${creator.instagram.replace(/^@/, "")}`
              : creator.youtube || creator.email || "Creator"}
          </p>
        </div>
      </div>

      {creator.niche && (
        <span className="shrink-0 rounded-full bg-purple-500/10 px-2 py-1 text-[10px] font-medium text-purple-300">
          {creator.niche}
        </span>
      )}
    </div>

    <div className="mt-5">
      <p className="text-xs text-white/40">Location</p>
      <p className="mt-1 truncate text-sm font-semibold">
        {creator.location || "Not specified"}
      </p>
    </div>

    <div className="mt-3">
      <p className="text-xs text-white/40">About</p>
      <p className="mt-1 line-clamp-2 text-sm text-white/60">
        {creator.bio || "No bio added yet."}
      </p>
    </div>

    <button
      type="button"
      onClick={() => {
        setSelectedCreator(creator);
        setActiveSection("Creator Pool");
      }}
      className="mt-5 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-2.5 text-sm font-semibold transition hover:opacity-90"
    >
      View Creator
    </button>
  </div>
))}

  </div>{!creatorProfiles.length && (
<div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
<p className="text-sm text-white/50">
No creators available yet.
</p>
</div>
)}

</section>

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


{loadingConversations ? (
  <p className="py-3 text-sm text-white/50">
    Loading messages...
  </p>
) : conversations.length === 0 ? (
  <p className="py-3 text-sm text-white/50">
    No messages yet.
  </p>
) : (
  conversations.slice(0, 3).map((chat) => (
    <button
      key={chat.id}
      type="button"
      onClick={() => {
        setSelectedConversation(String(chat.id));
        setActiveSection("Messages");
      }}
      className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:bg-white/[0.07]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 font-semibold">
        {(chat.creator_name || "C").charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {chat.creator_name || "Creator"}
        </p>

        <p className="truncate text-xs text-white/50">
          {chat.latest_message || "No messages yet"}
        </p>
      </div>
    </button>
  ))
)}
        </div>

      </section>

    </div>


    {/* Active Campaigns */}
    <section className="mt-8">

      <div className="flex items-center justify-between gap-3">

        <h2 className="text-xl font-semibold">
          Active Campaigns
        </h2>

        <button
          type="button"
          onClick={() => setActiveSection("Campaigns")}
          className="shrink-0 text-xs text-pink-400 transition hover:text-pink-300 sm:text-sm"
        >
          View all →
        </button>

      </div>


      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">


       {campaigns
  .filter(
    (campaign) =>
      getCampaignStatus(campaign.application_deadline) === "Active"
  )
  .slice(0, 3)
  .map((campaign) => (

          <div
            key={campaign.id}
            className="border-b border-white/10 p-4 last:border-0 sm:p-5"
          >

            {/* Top Row */}
            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <p className="truncate font-medium">
                  {campaign.campaign_name}
                </p>

                <p className="mt-1 text-xs text-white/40">
                  {campaign.creators_required} creators required
                </p>

              </div>


              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium sm:text-xs ${
  getCampaignStatus(campaign.application_deadline) === "Active"
    ? "bg-green-500/10 text-green-400"
    : "bg-purple-500/10 text-purple-400"
}`}
>
  {getCampaignStatus(campaign.application_deadline)}
              </span>

            </div>


            {/* Campaign Details */}
<div className="mt-4 flex flex-wrap items-center justify-between gap-2">
  <span className="text-xs text-white/50">
    Total Budget
  </span>

  <span className="text-sm font-semibold text-white">
    ₹{Number(campaign.total_budget || 0).toLocaleString("en-IN")}
  </span>
</div>

          </div>

        ))}

      </div>

    </section>

  </div>
)}

{/* Campaigns */}
{activeSection === "Campaigns" && ! selectedCampaign && (
  <section>
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Campaigns
        </h1>

        <p className="mt-1 text-sm text-white/50 sm:mt-2">
          Create, manage and track your brand campaigns.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setActiveSection("Create Campaign")}
        className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
      >
        + Create Campaign
      </button>
    </div>

    {/* Campaign Stats */}
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        [String(campaigns.length), "Total Campaigns"],
        [
  String(
    campaigns.filter(
      (campaign) =>
        getCampaignStatus(campaign.application_deadline) === "Active"
    ).length
  ),
  "Active",
],
       [
  String(
    campaigns.filter(
      (campaign) =>
        getCampaignStatus(campaign.application_deadline) === "Completed"
    ).length
  ),
  "Completed",
],
        [String(applicationsCount), "Applications"],
      ].map(([value, label]) => (
        <div
          key={label}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        >
          <p className="text-2xl font-bold">{value}</p>
          <p className="mt-1 text-sm text-white/40">{label}</p>
        </div>
      ))}
    </div>

    {/* Campaign Tabs */}
    <div className="mt-8 flex gap-6 border-b border-white/10">
      {["All", "Active", "Completed"].map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setCampaignTab(tab)}
          className={`border-b-2 pb-3 text-sm font-medium ${
  campaignTab === tab
    ? "border-pink-500 text-white"
    : "border-transparent text-white/40 hover:text-white"
}`}
        >
          {tab}
        </button>
      ))}
    </div>


    {/* Campaign Cards */}
    <div className="mt-6 grid gap-5 lg:grid-cols-2">
      {filteredCampaigns.map((campaign) => (
        <div
          key={campaign.campaign_name}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-pink-500/30 hover:bg-white/[0.05]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold">
                {campaign.campaign_name}
              </h3>

              <p className="mt-1 text-sm text-white/40">
                {campaign.category}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs ${
                getCampaignStatus(campaign.application_deadline) === "Active"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {getCampaignStatus(campaign.application_deadline)}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/30">
                Creators
              </p>

              <p className="mt-1 text-sm font-medium">
                {campaign.creators_required
                  ? `${campaign.creators_required} creators`: "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs text-white/30">
                Budget
              </p>

              <p className="mt-1 text-sm font-medium">
                ₹{Number(campaign.total_budget).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedCampaign(campaign)}
            className="mt-5 w-full rounded-lg border border-white/10 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            View Campaign
          </button>
        </div>
      ))}
    </div>
  </section>
)}

{/* Campaign Detail */}
{activeSection === "Campaigns" && selectedCampaign && (
  <section>
    {/* Header */}
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {selectedCampaign.campaign_name}
        </h1>

        <p className="mt-1 text-sm text-white/50 sm:mt-2">
          {selectedCampaign.category}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setSelectedCampaign(null)}
        className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
      >
        ← Back
      </button>
    </div>

    {/* Campaign Details Card */}
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

      {/* Status */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
        <span className="text-sm text-white/40">
          Campaign Status
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            getCampaignStatus(selectedCampaign.application_deadline) === "Active"
              ? "bg-green-500/10 text-green-400"
              : "bg-white/10 text-white/50"
          }`}
        >
          {getCampaignStatus(selectedCampaign.application_deadline)}
        </span>
      </div>

      {/* Description */}
      <div className="mt-6">
        <p className="text-sm font-medium text-white/40">
          Description
        </p>

        <p className="mt-2 text-sm leading-6 text-white/70">
          {selectedCampaign.description || "Not specified"}
        </p>
      </div>

      {/* Deliverables */}
      {selectedCampaign.deliverables && (
        <div className="mt-6 border-t border-white/10 pt-6">
          <p className="text-sm font-medium text-white/40">
            Deliverables / Requirements
          </p>

          <p className="mt-2 text-sm leading-6 text-white/70">
            {selectedCampaign.deliverables}
          </p>
        </div>
      )}

      {/* Main Details */}
      <div className="mt-6 grid gap-x-8 gap-y-6 border-t border-white/10 pt-6 sm:grid-cols-2">

        {/* Platform */}
        <div>
          <p className="text-xs text-white/30">
            Platform
          </p>

          <p className="mt-1 text-sm">
            {selectedCampaign.platform || "Not specified"}
          </p>
        </div>

        {/* Content Type */}
        <div>
          <p className="text-xs text-white/30">
            Content Type
          </p>

          <p className="mt-1 text-sm">
            {selectedCampaign.content_type || "Not specified"}
          </p>
        </div>

        {/* Creators Required */}
        <div>
          <p className="text-xs text-white/30">
            Creators Required
          </p>

          <p className="mt-1 text-sm">
            {selectedCampaign.creators_required || "Not specified"}
          </p>
        </div>

        {/* Total Budget */}
        <div>
          <p className="text-xs text-white/30">
            Total Budget
          </p>

          <p className="mt-1 text-sm font-medium">
            ₹{Number(selectedCampaign.total_budget).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Budget Per Creator */}
        <div>
          <p className="text-xs text-white/30">
            Budget Per Creator
          </p>

          <p className="mt-1 text-sm">
            {selectedCampaign.budget_per_creator
              ? `₹${Number(selectedCampaign.budget_per_creator).toLocaleString("en-IN")}`
              : "Not specified"}
          </p>
        </div>

        {/* Application Deadline */}
        <div>
          <p className="text-xs text-white/30">
            Application Deadline
          </p>

          <p className="mt-1 text-sm">
            {selectedCampaign.application_deadline || "Not specified"}
          </p>
        </div>

        {/* Preferred Niche */}
        <div>
          <p className="text-xs text-white/30">
            Preferred Niche
          </p>

          <p className="mt-1 text-sm">
            {selectedCampaign.preferred_niche || "Not specified"}
          </p>
        </div>

        {/* Minimum Followers */}
        <div>
          <p className="text-xs text-white/30">
            Minimum Followers
          </p>

          <p className="mt-1 text-sm">
            {selectedCampaign.minimum_followers
              ? selectedCampaign.minimum_followers.toLocaleString("en-IN")
              : "Not specified"}
          </p>
        </div>

        {/* Preferred Location */}
        <div>
          <p className="text-xs text-white/30">
            Preferred Location
          </p>

          <p className="mt-1 text-sm">
            {selectedCampaign.preferred_location || "Not specified"}
          </p>
        </div>

        {/* Target Audience */}
        <div>
          <p className="text-xs text-white/30">
            Target Audience
          </p>

          <p className="mt-1 text-sm">
            {selectedCampaign.target_audience || "Not specified"}
          </p>
        </div>

        {/* Who Can Apply */}
        <div>
          <p className="text-xs text-white/30">
            Who Can Apply
          </p>

          <p className="mt-1 text-sm">
            {selectedCampaign.who_can_apply === "invite"
              ? "Invite Only"
              : "Everyone"}
          </p>
        </div>

        {/* Product / Brand */}
        <div>
          <p className="text-xs text-white/30">
            Product / Brand
          </p>

          <p className="mt-1 text-sm">
            {selectedCampaign.product_brand || "Not specified"}
          </p>
        </div>

        {/* Campaign Dates */}
        <div>
          <p className="text-xs text-white/30">
            Campaign Dates
          </p>

          <p className="mt-1 text-sm">
            {selectedCampaign.start_date || "Not specified"}
            {" → "}
            {selectedCampaign.end_date || "Not specified"}
          </p>
        </div>

        {/* Payment Terms */}
        <div>
          <p className="text-xs text-white/30">
            Payment Terms
          </p>

          <p className="mt-1 text-sm leading-6 text-white/70">
            {selectedCampaign.payment_terms || "Not specified"}
          </p>
        </div>
      </div>

      {/* Additional Instructions */}
      <div className="mt-6 border-t border-white/10 pt-6">
        <p className="text-sm font-medium text-white/40">
          Additional Instructions
        </p>

        <p className="mt-2 text-sm leading-6 text-white/70">
          {selectedCampaign.additional_instructions || "Not specified"}
        </p>
      </div>

    </div>
  </section>
)}

{/* Creator Pool */}
{activeSection === "Creator Pool" && ! selectedCreator && (
  <section>
    {/* Header */}
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Creator Pool
        </h1>

        <p className="mt-1 text-sm text-white/50 sm:mt-2">
          Discover creators and find the right people for your campaigns.
        </p>
      </div>
    </div>

{/* Creator Cards */}
<div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
  {creatorProfiles.map((creator) => (
    <div
      key={creator.id}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-sm font-bold">
            {creator.avatar_url ? (
              <img
                src={creator.avatar_url}
                alt={creator.full_name || "Creator"}
                className="h-full w-full object-cover"
              />
            ) : (
              creator.full_name?.charAt(0).toUpperCase() || "C"
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold">
              {creator.full_name || "Unnamed Creator"}
            </p>

            <p className="truncate text-xs text-white/40">
              {creator.instagram
                ? `@${creator.instagram.replace(/^@/, "")}`
                : "Creator"}
            </p>
          </div>
        </div>

        {creator.niche && (
          <span className="shrink-0 rounded-full bg-pink-500/10 px-3 py-1 text-[10px] font-medium text-pink-300">
            {creator.niche}
          </span>
        )}
      </div>

      <div className="mt-6">
        <p className="text-xs text-white/40">
          Location
        </p>

        <p className="mt-1 truncate text-sm font-semibold">
          {creator.location || "Not specified"}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-xs text-white/40">
          About
        </p>

        <p className="mt-1 line-clamp-2 text-sm text-white/60">
          {creator.bio || "No bio added yet."}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setSelectedCreator(creator)}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-3 text-sm font-semibold transition hover:opacity-90"
      >
        View Creator
      </button>
    </div>
  ))}
</div>

  </section>
)}

{/* Creator Profile */}
{activeSection === "Creator Pool" && selectedCreator && (
  <section className="min-h-[calc(100vh-96px)]">

    {/* Profile Header */}
    <div className="flex items-center justify-between gap-4">

      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-lg font-bold">
          {selectedCreator.avatar_url ? (
            <img
              src={selectedCreator.avatar_url}
              alt={selectedCreator.full_name || "Creator"}
              className="h-full w-full object-cover"
            />
          ) : (
            selectedCreator.full_name?.charAt(0).toUpperCase() || "C"
          )}
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold sm:text-2xl">
            {selectedCreator.full_name || "Unnamed Creator"}
          </h1>

          <p className="text-sm text-white/40">
            Creator
          </p>
        </div>

      </div>

      <button
        type="button"
        onClick={() => setSelectedCreator(null)}
        className="shrink-0 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:border-white/20 hover:text-white"
      >
        ← Back
      </button>

    </div>


    {/* Profile */}
    <div className="mt-6 grid gap-6 lg:grid-cols-3">

      {/* Main Profile */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-3xl font-bold">

            {selectedCreator.avatar_url ? (
              <img
                src={selectedCreator.avatar_url}
                alt={selectedCreator.full_name || "Creator"}
                className="h-full w-full object-cover"
              />
            ) : (
              selectedCreator.full_name?.charAt(0).toUpperCase() || "C"
            )}

          </div>

          <div className="min-w-0">

            <h2 className="text-2xl font-bold">
              {selectedCreator.full_name || "Unnamed Creator"}
            </h2>

            <p className="mt-1 truncate text-sm text-white/40">
              {selectedCreator.instagram
                ? `@${selectedCreator.instagram.replace(/^@/, "")}`
                : "Instagram not added"}
            </p>

            {selectedCreator.niche && (
              <span className="mt-3 inline-flex rounded-full bg-pink-500/10 px-3 py-1 text-xs text-pink-300">
                {selectedCreator.niche}
              </span>
            )}

          </div>

        </div>


        {/* About */}
        <div className="mt-8">

          <h3 className="font-semibold">
            About
          </h3>

          <p className="mt-2 text-sm leading-6 text-white/50">
            {selectedCreator.bio || "No bio added yet."}
          </p>

        </div>


        {/* Creator Information */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-white/40">
              Location
            </p>

            <p className="mt-1 text-sm font-semibold">
              {selectedCreator.location || "Not specified"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
  <p className="text-xs text-white/40">
    Instagram Followers
  </p>

  <p className="mt-1 text-sm font-semibold">
    {selectedCreator.instagram_followers != null &&
    selectedCreator.instagram_followers !== ""
      ? Number(selectedCreator.instagram_followers).toLocaleString("en-IN")
      : "NA"}
  </p>
</div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-white/40">
              Instagram
            </p>

            <p className="mt-1 truncate text-sm font-semibold">
              {selectedCreator.instagram
                ? `@${selectedCreator.instagram.replace(/^@/, "")}`
                : "Not added"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-white/40">
              YouTube
            </p>

            <p className="mt-1 truncate text-sm font-semibold">
              {selectedCreator.youtube || "Not added"}
            </p>
          </div>

        </div>

      </div>


      {/* Actions */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <h3 className="font-semibold">
          Work with {selectedCreator.full_name || "Creator"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/40">
          Interested in collaborating with this creator?
        </p>


        <button
          type="button"
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-3 text-sm font-semibold transition hover:opacity-90"
        >
          Invite to Campaign
        </button>


        <button
          type="button"
          onClick={async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || !selectedCreator?.id) {
      alert("Unable to identify brand or creator. Please log in again.");
      return;
    }

    // Check whether a conversation already exists.
    const { data: existingConversation, error: fetchError } = await supabase
      .from("conversations")
      .select("id")
      .eq("brand_id", user.id)
      .eq("creator_id", selectedCreator.id)
      .maybeSingle();

    if (fetchError) {
      console.error("Find conversation error:", fetchError);
      alert("Unable to open conversation.");
      return;
    }

    let conversationId = existingConversation?.id;

    // Create a conversation only if one does not already exist.
    if (!conversationId) {
      
      console.log("Conversation insert check:", {
  loggedInUserId: user?.id,
  brandIdToInsert: user?.id,
  creatorIdToInsert: selectedCreator?.id,
});
      
      const { data: newConversation, error: createError } = await supabase
        .from("conversations")
        .insert({
          brand_id: user.id,
          creator_id: selectedCreator.id,
        })
        .select("id")
        .single();

        console.error("Create conversation error:", JSON.stringify(createError, null, 2));

      if (createError || !newConversation) {
        console.error("Create conversation error:", createError);
        alert("Unable to create conversation.");
        return;
      }

      conversationId = newConversation.id;
    }

    // Open the chat using its database ID, never the creator's name.
    setSelectedConversation(String(conversationId));
    setSelectedCreator(null);
    setActiveSection("Messages");
  } catch (error) {
    console.error("Open creator chat error:", error);
    alert("Something went wrong while opening the conversation.");
  }
}}
          className="mt-3 w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          Message Creator
        </button>

      </div>

    </div>

  </section>
)}

{/* ==================== IN-APP FEATURES SECTION ==================== */}
{activeSection === "In-App Features" && (
  <section className="w-full space-y-8 p-4 sm:p-6 lg:p-8">
    {/* Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          In-App Features
        </h1>
        <p className="mt-2 text-sm text-gray-400 sm:text-base">
          Explore the tools designed to help your brand collaborate with creators.
        </p>
      </div>

      <button
        onClick={() => setActiveSection("Overview")}
        className="w-fit rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
      >
        ← Back
      </button>
    </div>

    {/* Feature Cards */}
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {/* Discover Card */}
      <div className="group rounded-2xl border border-white/10 bg-[#151522] p-6 transition duration-300 hover:-translate-y-1 hover:border-purple-500/50">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15 text-2xl">
            🔍
          </div>
          <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
            Coming Soon
          </span>
        </div>
        <h2 className="text-xl font-semibold text-white">Discover</h2>
        <p className="mt-3 text-sm leading-6 text-gray-400">
          Discover creators who match your brand, niche and campaign goals.
        </p>
      </div>

      {/* Matches Card */}
      <div className="group rounded-2xl border border-white/10 bg-[#151522] p-6 transition duration-300 hover:-translate-y-1 hover:border-pink-500/50">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/15 text-2xl">
            🤝
          </div>
          <span className="rounded-full border border-pink-400/20 bg-pink-500/10 px-3 py-1 text-xs font-medium text-pink-300">
            Coming Soon
          </span>
        </div>
        <h2 className="text-xl font-semibold text-white">Matches</h2>
        <p className="mt-3 text-sm leading-6 text-gray-400">
          Find suitable creators for your brand and collaboration opportunities.
        </p>
      </div>

      {/* Messages Card */}
      <div className="group rounded-2xl border border-white/10 bg-[#151522] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/50">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-2xl">
            💬
          </div>
          <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
            Coming Soon
          </span>
        </div>
        <h2 className="text-xl font-semibold text-white">Messages</h2>
        <p className="mt-3 text-sm leading-6 text-gray-400">
          Connect with creators, discuss campaign details and manage collaborations.
        </p>
      </div>

      {/* Analytics Card */}
      <div className="group rounded-2xl border border-white/10 bg-[#151522] p-6 transition duration-300 hover:-translate-y-1 hover:border-green-500/50">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/15 text-2xl">
            📊
          </div>
          <span className="rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-300">
            Coming Soon
          </span>
        </div>
        <h2 className="text-xl font-semibold text-white">Analytics</h2>
        <p className="mt-3 text-sm leading-6 text-gray-400">
          Track campaign performance, engagement and collaboration results.
        </p>
      </div>

      {/* Notifications Card */}
      <div className="group rounded-2xl border border-white/10 bg-[#151522] p-6 transition duration-300 hover:-translate-y-1 hover:border-yellow-500/50">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/15 text-2xl">
            🔔
          </div>
          <span className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-300">
            Coming Soon
          </span>
        </div>
        <h2 className="text-xl font-semibold text-white">Notifications</h2>
        <p className="mt-3 text-sm leading-6 text-gray-400">
          Stay updated on creator applications, messages, campaigns and important alerts.
        </p>
      </div>

      {/* Campaign Planner Card */}
<div className="group rounded-2xl border border-white/10 bg-[#151522] p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-500/50">
  <div className="mb-5 flex items-center justify-between">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 text-2xl">
      🗓️
    </div>
    <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300">
      Coming Soon
    </span>
  </div>

  <h2 className="text-xl font-semibold text-white">Campaign Planner</h2>

  <p className="mt-3 text-sm leading-6 text-gray-400">
    Plan upcoming campaigns, organize collaboration timelines and keep your brand campaigns on track.
  </p>
</div>

    </div>
  </section>
)}

{/* ==================== SETTINGS SECTION ==================== */}
{activeSection === "Settings" && (
  <section className="w-full space-y-6 p-4 sm:p-6 lg:p-8">

    {/* Header */}
    <div className="mb-8 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Settings
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Manage your brand account and preferences.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setActiveSection("Overview")}
        className="shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white"
      >
        ← Back
      </button>
    </div>

    {/* Account */}
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white">
        Account
      </h2>

      <div className="mt-5 space-y-4">

        {/* Email */}
        <div>
          <label className="text-xs text-white/40">
            Email
          </label>

          <div className="mt-2 break-all rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
           {brandEmail || "Loading email..."}
          </div>
        </div>

        {/* Change Password */}
        <button
          type="button"
          onClick={() => {
  setPasswordError("");
  setShowChangePassword(true);
}}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white"
        >
          <span>Change Password</span>
          <span className="text-white/30">→</span>
        </button>

      </div>
    </div>

    {/* Notifications */}
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white">
        Notifications
      </h2>

      <div className="mt-5 space-y-3">

        {/* Email Notifications */}
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
          <div>
            <p className="text-sm font-medium text-white/80">
              Email Notifications
            </p>
            <p className="mt-1 text-xs text-white/40">
              Receive important updates through email.
            </p>
          </div>

          <button
  type="button"
  aria-label="Email notifications toggle"
  aria-checked={emailNotifications}
  role="switch"
  onClick={async () => {
  const nextValue = !emailNotifications;

  setEmailNotifications(nextValue);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("brand_settings")
    .upsert(
      {
        user_id: user.id,
        email_notifications: nextValue,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Email notification save error:", error);
    setEmailNotifications(!nextValue);
  }
}}
  className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
    emailNotifications ? "bg-purple-500/30" : "bg-white/10"
  }`}
>
  <span
    className={`h-4 w-4 rounded-full transition-all ${
      emailNotifications
        ? "translate-x-4 bg-purple-400"
        : "translate-x-0 bg-white/50"
    }`}
  />
</button>
        </div>

        {/* Campaign Updates */}
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
          <div>
            <p className="text-sm font-medium text-white/80">
              Campaign Updates
            </p>
            <p className="mt-1 text-xs text-white/40">
              Stay informed about creator applications and campaigns.
            </p>
          </div>

          <button
  type="button"
  aria-label="Campaign updates toggle"
  aria-checked={campaignUpdates}
  role="switch"
  onClick={async () => {
  const nextValue = !campaignUpdates;

  setCampaignUpdates(nextValue);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("brand_settings")
    .upsert(
      {
        user_id: user.id,
        campaign_updates: nextValue,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Campaign updates save error:", error);
    setCampaignUpdates(!nextValue);
  }
}}
  className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
    campaignUpdates ? "bg-purple-500/30" : "bg-white/10"
  }`}
>
  <span
    className={`h-4 w-4 rounded-full transition-all ${
      campaignUpdates
        ? "translate-x-4 bg-purple-400"
        : "translate-x-0 bg-white/50"
    }`}
  />
</button>
        </div>

      </div>
    </div>

    {/* Change Password Modal */}
{showChangePassword && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#171525] p-6">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Change Password
        </h2>

        <button
          type="button"
          onClick={() => setShowChangePassword(false)}
          className="text-white/50 hover:text-white"
        >
          ✕
        </button>
      </div>

      

      <div className="space-y-4">

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
        />

        {passwordError && (
          <p className="text-sm text-red-400">
            {passwordError}
          </p>
        )}

        <button
          type="button"
          onClick={handleChangePassword}
          disabled={updatingPassword}
          className="w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-50"
        >
          {updatingPassword ? "Updating..." : "Update Password"}
        </button>

        <button
  type="button"
  onClick={() => {
    setShowChangePassword(false);
    setPasswordError("");
    setShowForgotPassword(true);
  }}
  className="w-full text-center text-sm text-purple-400 hover:text-purple-300"
>
  Forgot Password?
</button>

      </div>
    </div>
  </div>
)}

{/* Forgot Password Reset Modal */}
{showForgotPassword && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#171525] p-6">

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Reset Your Password
        </h2>

        <button
          type="button"
          onClick={() => {
            setShowForgotPassword(false);
            setForgotPasswordMessage("");
          }}
          className="text-white/50 hover:text-white"
        >
          ✕
        </button>
      </div>

      <p className="mb-5 text-sm text-white/50">
        We'll send a password reset link to your registered brand email.
      </p>

      <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
        {brandEmail}
      </div>

      {forgotPasswordMessage && (
        <p className="mb-4 text-sm text-purple-300">
          {forgotPasswordMessage}
        </p>
      )}

      <button
        type="button"
        onClick={handleForgotPassword}
        className="w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
      >
        Send Reset Link
      </button>

    </div>
  </div>
)}

    {/* Account Actions */}
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white">
        Account Actions
      </h2>

      <div className="mt-5 space-y-3">

        {/* Log Out */}
        <button
          type="button"
          onClick={async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    alert("Logout failed. Please try again.");
    console.error(error);
    return;
  }

  window.location.href = "/login";
}}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white"
        >
          <span>Log Out</span>
          <span className="text-white/30">→</span>
        </button>

        {/* Delete Account */}
        <button
          type="button"
          onClick={() => {
  setDeleteError("");
  setDeletePassword("");
  setShowDeleteAccount(true);
}}
          className="flex w-full items-center justify-between rounded-xl border border-red-500/20 bg-red-500/[0.03] 
          px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/[0.08]"
        >
          <span>Delete Account</span>
          <span className="text-red-400/50">→</span>
        </button>

      </div>
    </div>

{/* Delete Account Confirmation Modal */}
{showDeleteAccount && (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#171525] p-6">

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Delete Account
        </h2>

        <button
          type="button"
          onClick={() => setShowDeleteAccount(false)}
          className="text-white/50 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
        <p className="text-sm font-medium text-red-400">
          Warning: This action is permanent.
        </p>
        <p className="mt-2 text-xs leading-5 text-white/50">
          Your brand account and associated data may be permanently deleted.
          Please confirm before continuing.
        </p>
      </div>

      <label className="mb-2 block text-sm text-white/70">
        Enter Current Password
      </label>

      <input
        type="password"
        value={deletePassword}
        onChange={(e) => setDeletePassword(e.target.value)}
        placeholder="Current password"
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-red-500/50"
      />

      {deleteError && (
        <p className="mt-3 text-sm text-red-400">
          {deleteError}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => setShowDeleteAccount(false)}
          className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/70 hover:bg-white/[0.06]"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!deletePassword}
          onClick={() =>
            setDeleteError("Deletion process will be connected in the next step.")
          }
          className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-40"
        >
          Continue
        </button>
      </div>

    </div>
  </div>
)}

  </section>
)}  

{/* Applications */}
{activeSection === "Applications" && ! selectedApplication && (
  <section>

    {/* Header */}
    <div className="flex items-start justify-between gap-3">

      <div className="min-w-0">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Applications
        </h1>

        <p className="mt-1 text-sm text-white/50 sm:mt-2">
          Review and manage creator applications for your campaigns.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setActiveSection("Overview")}
        className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
      >
        ← Back
      </button>

    </div>

    {/* Stats */}
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-2xl font-bold">
          {applications.length}
        </p>

        <p className="mt-1 text-sm text-white/40">
          Total Applications
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-2xl font-bold">
          {
            applications.filter(
              (application) => application.status === "pending"
            ).length
          }
        </p>

        <p className="mt-1 text-sm text-white/40">
          Pending
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-2xl font-bold">
          {
            applications.filter(
              (application) => application.status === "accepted"
            ).length
          }
        </p>

        <p className="mt-1 text-sm text-white/40">
          Accepted
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-2xl font-bold">
          {
            applications.filter(
              (application) => application.status === "rejected"
            ).length
          }
        </p>

        <p className="mt-1 text-sm text-white/40">
          Rejected
        </p>
      </div>

    </div>

    {/* Applications List */}
    <div className="mt-8">

      {loadingApplications ? (

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <p className="text-sm text-white/50">
            Loading applications...
          </p>
        </div>

      ) : applications.length === 0 ? (

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">

          <p className="text-lg font-semibold">
            No applications yet
          </p>

          <p className="mt-2 text-sm text-white/40">
            Creator applications will appear here when they apply to your campaigns.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {applications.map((application) => {

            const campaign = campaigns.find(
              (item) => item.id === application.campaign_id
            );

            const creator = creatorProfiles.find(
              (item) => item.id === application.creator_id
            );

            return (
              <div
                key={application.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-pink-500/20 hover:bg-white/[0.05]"
              >

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  {/* Creator */}
                  <div className="flex min-w-0 items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-lg font-semibold">

                      {creator?.avatar_url ? (
                        <img
                          src={creator.avatar_url}
                          alt={creator.full_name || "Creator"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (creator?.full_name || "C")
                          .charAt(0)
                          .toUpperCase()
                      )}

                    </div>

                    <div className="min-w-0">

                      <p className="truncate font-semibold">
                        {creator?.full_name || "Creator"}
                      </p>

                      <p className="mt-1 truncate text-sm text-white/40">
                        {creator?.niche || "Creator"}
                      </p>

                    </div>

                  </div>

                  {/* Campaign */}
                  <div className="min-w-0 lg:max-w-[240px]">

                    <p className="text-xs text-white/30">
                      Campaign
                    </p>

                    <p className="mt-1 truncate text-sm font-medium">
                      {campaign?.campaign_name || "Campaign"}
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      {campaign?.category || "—"}
                    </p>

                  </div>

                  {/* Applied Date */}
                  <div>

                    <p className="text-xs text-white/30">
                      Applied
                    </p>

                    <p className="mt-1 text-sm">
                      {application.created_at
                        ? new Date(
                            application.created_at
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </p>

                  </div>

                  {/* Status */}
                  <div>

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        application.status === "accepted"
                          ? "bg-green-500/10 text-green-400"
                          : application.status === "rejected"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {application.status
                        ? application.status.charAt(0).toUpperCase() +
                          application.status.slice(1)
                        : "Pending"}
                    </span>

                  </div>

                </div>

                {/* Message */}
                {application.message && (
                  <div className="mt-5 border-t border-white/10 pt-4">

                    <p className="text-xs text-white/30">
                      Creator Message
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {application.message}
                    </p>

                  </div>
                )}

                {/* View Application */}
                <button
  type="button"
  onClick={() => setSelectedApplication(application)}
  className="mt-5 w-full rounded-xl border border-white/10 py-2.5 text-sm text-white/70 transition 
  hover:bg-white/5 hover:text-white"
>
  View Application
</button>

              </div>
            );
          })}

        </div>

      )}

    </div>

  </section>
)}

{/* Application Detail */}
{activeSection === "Applications" && selectedApplication && (
  <div className="space-y-6">
    <div className="flex items-center justify-between gap-4">
  <div>
    <h2 className="text-2xl font-bold text-white">
      Application Details
    </h2>

    <p className="mt-1 text-sm text-white">
      Review creator application
    </p>
  </div>

  <button
    type="button"
    onClick={() => setSelectedApplication(null)}
    className="rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5"
  >
    ← Back
  </button>
</div> 

    {(() => {
      const creator = creatorProfiles.find(
        (profile) => profile.id === selectedApplication.creator_id
      );

      const campaign = campaigns.find(
        (item) => item.id === selectedApplication.campaign_id
      );

      return (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Creator Profile */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-1">
            <div className="flex items-center gap-4">
              {creator?.avatar_url ? (
                <img
                  src={creator.avatar_url}
                  alt={creator.full_name || "Creator"}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-600">
                  {(creator?.full_name || "C").charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {creator?.full_name || "Creator"}
                </h3>

                <p className="text-sm text-gray-500">
                  {creator?.niche || "Niche not provided"}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-gray-400">Location</p>
                <p className="font-medium text-gray-800">
                  {creator?.location || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Instagram</p>
                <p className="font-medium text-gray-800">
                  {creator?.instagram || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-gray-400">YouTube</p>
                <p className="font-medium text-gray-800">
                  {creator?.youtube || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Bio</p>
                <p className="font-medium leading-6 text-gray-800">
                  {creator?.bio || "No bio provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Application Information */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">Applied for</p>

                  <h3 className="mt-1 text-xl font-bold text-gray-900">
                    {campaign?.campaign_name || "Campaign"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {campaign?.product_brand || "Brand"} •{" "}
                    {campaign?.category || "Category"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedApplication.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : selectedApplication.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selectedApplication.status?.charAt(0).toUpperCase() +
                    selectedApplication.status?.slice(1)}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-400">Applied On</p>
                  <p className="mt-1 font-medium text-gray-800">
                    {new Date(
                      selectedApplication.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Campaign Budget</p>
                  <p className="mt-1 font-medium text-gray-800">
                    ₹{campaign?.budget_per_creator || campaign?.total_budget || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Creator Message */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-bold text-gray-900">
                Creator's Message
              </h3>

              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                  {selectedApplication.message ||
                    "The creator did not add a message."}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {selectedApplication.status === "pending" && (
                <>
                  <button
  type="button"
  onClick={() =>
    updateApplicationStatus(selectedApplication.id, "accepted")
  }
  disabled={updatingApplication}
  className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  {updatingApplication ? "Updating..." : "Accept Application"}
</button>

                 <button
  type="button"
  onClick={() =>
    updateApplicationStatus(selectedApplication.id, "rejected")
  }
  disabled={updatingApplication}
  className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  {updatingApplication ? "Updating..." : "Reject Application"}
</button>
                </>
              )}
            </div>
          </div>
        </div>
      );
    })()}
  </div>
)}

{/* Messages List */}
{activeSection === "Messages" && !selectedConversation && (
  <section>
    {/* Header */}
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Messages
        </h1>

        <p className="mt-1 text-sm text-white/50 sm:mt-2">
          Communicate with creators and manage your collaborations.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setActiveSection("Overview")}
        className="shrink-0 text-sm text-white/50 transition hover:text-white"
      >
        ← Back
      </button>
    </div>

    {/* Message List */}
<div className="mt-8 space-y-3">
  {loadingConversations ? (
    <p className="py-6 text-center text-sm text-white/60">
      Loading conversations...
    </p>
  ) : conversations.length === 0 ? (
    <p className="py-6 text-center text-sm text-white/60">
      No conversations yet.
    </p>
  ) : (
    conversations.map((chat) => (
      <button
        key={chat.id}
        type="button"
        onClick={() =>
          setSelectedConversation(String(chat.id))
        }
        className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
          selectedConversation === String(chat.id)
            ? "border-pink-400/50 bg-white/10"
            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
        }`}
      >
        {chat.creator_avatar ? (
          <img
            src={chat.creator_avatar}
            alt={chat.creator_name}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-600 font-semibold text-white">
            {chat.creator_name?.charAt(0)?.toUpperCase() || "C"}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-white">
            {chat.creator_name}
          </p>

          <p className="mt-1 truncate text-sm text-white/50">
            {chat.latest_message}
          </p>
        </div>
      </button>
    ))
  )}
</div>

  </section>
)}


{/* Individual Message */}
{activeSection === "Messages" && selectedConversation && (
  <section className="flex h-[calc(100dvh-160px)] min-h-0 flex-col">

    {/* Conversation */}
    <div className="mt-1 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

{/* Creator Profile — fixed */}
<div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 p-3 sm:p-5">

  {/* Creator info — left */}
  <div className="flex min-w-0 items-center gap-3">

    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-sm font-bold sm:h-11 sm:w-11">
      {conversations.find(
  (chat) => String(chat.id) === selectedConversation
)?.creator_name?.charAt(0)?.toUpperCase() || "C"}
    </div>

    <div className="min-w-0">
      <p className="truncate font-semibold">
        {conversations.find(
  (chat) => String(chat.id) === selectedConversation
)?.creator_name || "Creator"}
      </p>

      <p className="text-xs text-white/40">
        Creator
      </p>
    </div>

  </div>

  {/* Back — right */}
  <button
    type="button"
    onClick={() => setSelectedConversation(null)}
    className="shrink-0 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/60 transition hover:border-white/20 hover:text-white sm:px-4"
  >
    ← Back
  </button>

</div>

      {/* ONLY THIS AREA SCROLLS */}
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-3 pb-4 sm:p-5 sm:pb-4">

{loadingChatMessages ? (
  <p className="py-6 text-center text-sm text-white/50">
    Loading messages...
  </p>
) : chatMessages.length === 0 ? (
  <p className="py-6 text-center text-sm text-white/50">
    No messages yet. Start the conversation!
  </p>
) : (
  chatMessages.map((message) => {
    const isBrandMessage = message.sender_type === "brand";

    return (
      <div
        key={message.id}
        className={`flex items-end gap-2 ${
          isBrandMessage ? "justify-end" : "justify-start"
        }`}
      >
        {!isBrandMessage && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-xs font-bold">
            {conversations.find(
              (chat) => String(chat.id) === selectedConversation
            )?.creator_name?.charAt(0)?.toUpperCase() || "C"}
          </div>
        )}

        <div
          className={`max-w-[85%] break-words rounded-2xl px-4 py-3 ${
            isBrandMessage
              ? "rounded-br-md bg-gradient-to-r from-pink-500 to-purple-500"
              : "rounded-bl-md bg-white/10"
          }`}
        >
          <p className="whitespace-pre-wrap text-sm text-white">
            {message.content}
          </p>

          <p
            className={`mt-1 text-[10px] ${
              isBrandMessage
                ? "text-right text-white/60"
                : "text-white/40"
            }`}
          >
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  })
)}

  </div>

      {/* MESSAGE INPUT — FIXED */}
<div className="sticky bottom-0 z-20 shrink-0 border-t border-white/10 bg-[#070711] px-3 pt-3 pb-4 sm:px-4 sm:pt-4 sm:pb-5">

        <div className="flex items-center gap-2">

          <input
            type="text"
            placeholder="Type a message..."
            value={chatInput}
onChange={(e) => setChatInput(e.target.value)}
onKeyDown={(e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    void handleSendMessage();
  }
}}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] 
            px-3 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-pink-500/50 sm:px-4"
          />

          <button
            type="button"
            onClick={() => void handleSendMessage()}
disabled={sendingMessage || !chatInput.trim()}
           className="shrink-0 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-3 text-sm font-semibold transition hover:opacity-90 sm:px-5"
          >
            {sendingMessage ? "Sending..." : "Send"}
          </button>

        </div>

      </div>

    </div>

  </section>
)}

  {/* Create Campaign */}
{activeSection === "Create Campaign" && (
  <section>

    {/* Header */}
    <div className="flex items-start justify-between gap-4">

      <div className="min-w-0">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Create Campaign
        </h1>

        <p className="mt-1 text-sm text-white/50 sm:mt-2">
          Create a campaign and find the right creators for your brand.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setActiveSection("Campaigns")}
        className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
      >
        ← Back
      </button>

    </div>


    {/* Basic Information */}
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

      <h2 className="text-lg font-semibold">
        Basic Information
      </h2>

      <p className="mt-1 text-sm text-white/40">
        Tell creators what your campaign is about.
      </p>


      <div className="mt-6 grid gap-5">

        {/* Campaign Name */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Campaign Name *
          </label>

          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="e.g. Summer Tech Campaign"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-pink-500/50"
          />
        </div>


        {/* Brand / Product */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Product / Brand Name
          </label>

          <input
            type="text"
            value={productBrand}
            onChange={(e) => setProductBrand(e.target.value)}
            placeholder="e.g. KolabZ"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-pink-500/50"
          />
        </div>


        {/* Category */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Category *
          </label>

          <select
            value={campaignCategory}
            onChange={(e) => setCampaignCategory(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0b14] px-4 py-3 text-sm text-white outline-none focus:border-pink-500/50"
          >
            <option value="" disabled>
              Select category
            </option>

            <option value="technology">Technology</option>
            <option value="gaming">Gaming</option>
            <option value="fashion">Fashion</option>
            <option value="beauty">Beauty</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="education">Education</option>
            <option value="food">Food</option>
            <option value="finance">Finance</option>
            <option value="other">Other</option>
          </select>
        </div>


        {/* Description */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Campaign Description *
          </label>

          <textarea
            rows={5}
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
            placeholder="Describe your campaign, product and what you want creators to promote..."
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-pink-500/50"
          />
        </div>

      </div>

    </div>


    {/* Collaboration Details */}
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

      <h2 className="text-lg font-semibold">
        Collaboration Details
      </h2>

      <p className="mt-1 text-sm text-white/40">
        Define what creators will be expected to deliver.
      </p>


      <div className="mt-6 grid gap-5 sm:grid-cols-2">

        {/* Platform */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Platform *
          </label>

          <select
            value={campaignPlatform}
            onChange={(e) => setCampaignPlatform(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0b14] px-4 py-3 text-sm text-white outline-none focus:border-pink-500/50"
          >
            <option value="" disabled>
              Select platform
            </option>

            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="both">Instagram + YouTube</option>
          </select>
        </div>


        {/* Content Type */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Content Type *
          </label>

          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0b14] px-4 py-3 text-sm text-white outline-none focus:border-pink-500/50"
          >
            <option value="" disabled>
              Select content type
            </option>

            <option value="reel">Instagram Reel</option>
            <option value="post">Instagram Post</option>
            <option value="story">Instagram Story</option>
            <option value="youtube-video">YouTube Video</option>
            <option value="youtube-short">YouTube Short</option>
            <option value="multiple">Multiple Content Types</option>
          </select>
        </div>


        {/* Creators Required */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Creators Required
          </label>

          <input
            type="number"
            min="1"
            placeholder="e.g. 5"
            value={creatorsRequired}
            onChange={(e) => setCreatorsRequired(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-pink-500/50"
          />
        </div>


        {/* Start Date */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Start Date
          </label>

          <input
            type="date"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-pink-500/50"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>


        {/* End Date */}
        <div>
          <label className="text-sm font-medium text-white/80">
            End Date
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-pink-500/50"
          />
        </div>


        {/* Deliverables */}
        <div className="sm:col-span-2">

          <label className="text-sm font-medium text-white/80">
            Deliverables / Requirements
          </label>

          <textarea
            value={deliverables}
            onChange={(e) => setDeliverables(e.target.value)}
            rows={4}
            placeholder="Describe exactly what the creator needs to deliver..."
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-pink-500/50"
          />

        </div>

      </div>

    </div>


    {/* Creator Requirements */}
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

      <h2 className="text-lg font-semibold">
        Creator Requirements
      </h2>

      <p className="mt-1 text-sm text-white/40">
        Set your preferred creator profile.
      </p>


      <div className="mt-6 grid gap-5 sm:grid-cols-2">

        {/* Niche */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Preferred Niche
          </label>

          <select
            value={preferredNiche}
            onChange={(e) => setPreferredNiche(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0b14] px-4 py-3 text-sm text-white outline-none focus:border-pink-500/50"
          >
            <option value="" disabled>
              Select niche
            </option>

            <option value="technology">Technology</option>
            <option value="gaming">Gaming</option>
            <option value="fashion">Fashion</option>
            <option value="beauty">Beauty</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="education">Education</option>
            <option value="fitness">Fitness</option>
            <option value="food">Food</option>
            <option value="finance">Finance</option>
            <option value="other">Other</option>
          </select>
        </div>


        {/* Followers */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Minimum Followers
          </label>

          <input
            type="number"
            min="0"
            placeholder="e.g. 10000"
            value={minimumFollowers}
            onChange={(e) => setMinimumFollowers(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-pink-500/50"
          />
        </div>


        {/* Location */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Preferred Location
          </label>

          <input
            type="text"
            placeholder="e.g. India / Bihar / Mumbai"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-pink-500/50"
            value={preferredLocation}
            onChange={(e) => setPreferredLocation(e.target.value)}
          />
        </div>


        {/* Audience */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Target Audience
          </label>

          <input
            type="text"
            placeholder="e.g. 18-30, Indian tech audience"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-pink-500/50"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
        </div>

      </div>

    </div>


    {/* Budget */}
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

      <h2 className="text-lg font-semibold">
        Budget
      </h2>

      <p className="mt-1 text-sm text-white/40">
        Set the budget for this collaboration.
      </p>


      <div className="mt-6 grid gap-5 sm:grid-cols-2">

        {/* Total Budget */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Total Campaign Budget *
          </label>

          <div className="mt-2 flex items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-pink-500/50">

            <span className="px-4 text-white/40">
              ₹
            </span>

            <input
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              type="number"
              min="0"
              placeholder="50000"
              className="w-full bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-white/25"
            />

          </div>
        </div>


        {/* Per Creator */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Budget Per Creator
          </label>

          <div className="mt-2 flex items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-pink-500/50">

            <span className="px-4 text-white/40">
              ₹
            </span>

            <input
              value={budgetPerCreator}
              onChange={(e) => setBudgetPerCreator(e.target.value)}
              type="number"
              min="0"
              placeholder="10000"
              className="w-full bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-white/25"
            />

          </div>
        </div>


        {/* Payment Terms */}
        <div className="sm:col-span-2">

          <label className="text-sm font-medium text-white/80">
            Payment Terms
          </label>

          <textarea
            rows={3}
            placeholder="e.g. Payment will be made after successful completion of the campaign."
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-pink-500/50"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
          />

        </div>

      </div>


      <div className="mt-4 rounded-xl border border-pink-500/10 bg-pink-500/5 p-4">

        <p className="text-xs leading-5 text-white/50">
          KolabZ does not charge a platform fee on creator collaborations
          during Phase 1. Payment arrangements are made directly between
          brands and creators.
        </p>

      </div>

    </div>


    {/* Application Settings */}
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

      <h2 className="text-lg font-semibold">
        Application Settings
      </h2>

      <p className="mt-1 text-sm text-white/40">
        Decide how creators can apply to your campaign.
      </p>


      <div className="mt-6 grid gap-5 sm:grid-cols-2">

        {/* Deadline */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Application Deadline
          </label>

          <input
            type="date"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-pink-500/50"
            value={applicationDeadline}
            onChange={(e) => setApplicationDeadline(e.target.value)}
          />
        </div>


        {/* Who Can Apply */}
        <div>
          <label className="text-sm font-medium text-white/80">
            Who Can Apply?
          </label>

          <select
            value={whoCanApply}
            onChange={(e) => setWhoCanApply(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0b14] px-4 py-3 text-sm text-white outline-none focus:border-pink-500/50"
          >
            <option value="everyone">
              Everyone
            </option>

            <option value="invite">
              Invite Only
            </option>
          </select>
        </div>


        {/* Additional Instructions */}
        <div className="sm:col-span-2">

          <label className="text-sm font-medium text-white/80">
            Additional Instructions
          </label>

          <textarea
            rows={4}
            placeholder="Add any additional information creators should know..."
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-pink-500/50"
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
          />

        </div>

      </div>

    </div>


    {/* Actions */}
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

      <button
        type="button"
        onClick={() => setActiveSection("Campaigns")}
        className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
      >
        cancel
      </button>

      <button
        type="button"
        onClick={publishCampaign}
        className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-sm font-semibold transition hover:opacity-90"
      >
        Publish Campaign
      </button>

    </div>

  </section>
)}

{/* ==================== BRAND PROFILE ==================== */}
{activeSection === "Profile" && (
  <div className="mx-auto w-full max-w-5xl space-y-6">

    {/* Header */}
    <div>
      <h1 className="text-2xl font-bold text-white sm:text-3xl">
        Brand Profile
      </h1>
      <p className="mt-2 text-sm text-white/50">
        Manage your brand information and identity on KolabZ.
      </p>
    </div>

    {/* Basic Information */}
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
      <h2 className="mb-6 text-lg font-semibold text-white">
        Basic Information
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        {/* Brand Name */}
        <div>
          <label className="mb-2 block text-sm text-white/60">
            Brand Name
          </label>
         <input
  type="text"
  value={brandName}
  onChange={(e) => setBrandName(e.target.value)}
  placeholder="Enter brand name"
  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/60"
/>
        </div>

        {/* Username */}
        <div>
          <label className="mb-2 block text-sm text-white/60">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@yourinstagram"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/60"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm text-white/60">
            Category
          </label>
          <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full rounded-xl border border-white/10 bg-[#151522] px-4 py-3 text-sm text-white/70 outline-none focus:border-purple-400/60"
>
  <option value="" disabled>
    Select category
  </option>
  <option value="fashion">Fashion & Apparel</option>
  <option value="beauty">Beauty & Skincare</option>
  <option value="technology">Technology</option>
  <option value="food">Food & Beverage</option>
  <option value="fitness">Fitness & Wellness</option>
  <option value="gaming">Gaming & Entertainment</option>
  <option value="education">Education</option>
  <option value="ecommerce">E-commerce</option>
  <option value="travel">Travel & Lifestyle</option>
  <option value="other">Other</option>
</select>
        </div>

        {/* Business Type */}
        <div>
          <label className="mb-2 block text-sm text-white/60">
            Business Type
          </label>
          <select
  value={businessType}
  onChange={(e) => setBusinessType(e.target.value)}
  className="w-full rounded-xl border border-white/10 bg-[#151522] px-4 py-3 text-sm text-white/70 outline-none focus:border-purple-400/60"
>
  <option value="" disabled>
    Select business type
  </option>
  <option value="startup">Startup</option>
  <option value="small_business">Small Business</option>
  <option value="medium_business">Medium Business</option>
  <option value="enterprise">Enterprise</option>
  <option value="individual">Individual Brand</option>
</select>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm text-white/60">
            Brand Description
          </label>
          <textarea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
  placeholder="Tell creators about your brand..."
  className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/60"
/>
        </div>

      </div>
    </div>

    {/* Social Media */}
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
      <h2 className="mb-6 text-lg font-semibold text-white">
        Social Media
      </h2>

      <div className="space-y-5">

        {/* Instagram */}
        <div>
          <label className="mb-2 block text-sm text-white/60">
            Instagram
          </label>
         <input
  type="url"
  value={instagram}
  onChange={(e) => setInstagram(e.target.value)}
  placeholder="https://instagram.com/yourbrand"
  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/60"
/>
        </div>

        {/* YouTube */}
        <div>
          <label className="mb-2 block text-sm text-white/60">
            YouTube
          </label>
          <input
  type="url"
  value={youtube}
  onChange={(e) => setYoutube(e.target.value)}
  placeholder="https://youtube.com/@yourbrand"
  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/60"
/>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="mb-2 block text-sm text-white/60">
            LinkedIn
          </label>
          <input
            type="url"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/company/yourbrand"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/60"
          />
        </div>

      </div>
    </div>

    {/* Business Information */}
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
      <h2 className="mb-6 text-lg font-semibold text-white">
        Business Information
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        {/* Country */}
        <div>
          <label className="mb-2 block text-sm text-white/60">
            Country of Origin
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}  
            placeholder="Enter country"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/60"
          />
        </div>

        {/* State */}
        <div>
          <label className="mb-2 block text-sm text-white/60">
            State
          </label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter state"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/60"
          />
        </div>

        {/* Business Email */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm text-white/60">
            Business Email
          </label>
          <input
            type="email"
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
            placeholder="business@yourbrand.com"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/60"
          />
        </div>

      </div>
    </div>

    {/* Verification Status */}
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
      <h2 className="text-lg font-semibold text-white">
        Verification Status
      </h2>

      <div className="mt-5 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white">
            Brand Verification
          </p>
          <p className="mt-1 text-xs text-white/40">
            Your brand&apos;s current verification status on KolabZ.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1.5 text-xs font-medium text-yellow-300">
          <span className="h-2 w-2 rounded-full bg-yellow-400" />
          Unverified
        </span>
      </div>
    </div>

    {/* Save Changes */}
    <div className="flex justify-end pb-4">
      <button
  type="button"
  onClick={handleSaveBrandProfile}
  className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
>
  Save Changes
</button>
    </div>

  </div>
)}

   </div>
  </div>

</div>
  );
}

