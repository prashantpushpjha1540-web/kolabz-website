"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();

  const conversationId = String(params.id);

  const [userId, setUserId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [brandName, setBrandName] = useState("Brand");
  const [brandAvatar, setBrandAvatar] = useState<string | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchChat = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      // Get conversation
      const { data: conversation, error: conversationError } =
        await supabase
          .from("conversations")
          .select("id, creator_id, brand_id")
          .eq("id", conversationId)
          .single();

      if (conversationError) {
        console.log(
          "Conversation fetch error:",
          JSON.stringify(conversationError, null, 2)
        );

        setErrorMessage("Unable to load this conversation.");
        return;
      }

      // Make sure this creator belongs to the conversation
      if (conversation.creator_id !== user.id) {
        setErrorMessage("You don't have access to this conversation.");
        return;
      }

      setBrandId(conversation.brand_id);

      // Get brand profile
      const { data: brand, error: brandError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", conversation.brand_id)
        .single();

      if (brandError) {
        console.log(
          "Brand profile fetch error:",
          JSON.stringify(brandError, null, 2)
        );
      }

      if (brand) {
        setBrandName(brand.full_name || "Brand");
        setBrandAvatar(brand.avatar_url || null);
      }

      // Get messages
      const { data: messageData, error: messagesError } =
        await supabase
          .from("messages")
          .select(
            "id, conversation_id, sender_id, sender_type, content, created_at, edited, deleted"
          )
          .eq("conversation_id", conversationId)
          .eq("deleted", false)
          .order("created_at", { ascending: true });

      if (messagesError) {
        console.log(
          "Messages fetch error:",
          JSON.stringify(messagesError, null, 2)
        );

        setErrorMessage("Unable to load messages.");
        return;
      }

      setMessages(messageData || []);
    } catch (error) {
      console.log(
        "Chat fetch error:",
        JSON.stringify(error, null, 2)
      );

      setErrorMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
  }, [conversationId]);

  const sendMessage = async () => {
    const content = messageText.trim();

    if (!content || !userId || !brandId || sending) {
      return;
    }

    setSending(true);

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: Number(conversationId),
          sender_id: userId,
          sender_type: "creator",
          content,
          edited: false,
          deleted: false,
        })
        .select(
          "id, conversation_id, sender_id, sender_type, content, created_at, edited, deleted"
        )
        .single();

      if (error) {
        console.log(
          "Send message error:",
          JSON.stringify(error, null, 2)
        );

        setErrorMessage("Unable to send message.");
        return;
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        data,
      ]);

      setMessageText("");
    } catch (error) {
      console.log(
        "Send message error:",
        JSON.stringify(error, null, 2)
      );

      setErrorMessage("Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="min-h-screen bg-[#05050d] text-white">

      {/* Header */}
      <div className="border-b border-white/10 bg-[#080812]">

        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">

          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            ←
          </button>

          {/* Brand Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-sm font-bold">

            {brandAvatar ? (
              <img
                src={brandAvatar}
                alt={brandName}
                className="h-full w-full object-cover"
              />
            ) : (
              brandName.charAt(0).toUpperCase()
            )}

          </div>

          {/* Brand Info */}
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-white sm:text-base">
              {brandName}
            </h1>

            <p className="text-xs text-white/40">
              Brand
            </p>
          </div>

        </div>

      </div>

      {/* Chat Area */}
      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-5xl flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">

          {loading ? (

            <div className="flex min-h-[50vh] items-center justify-center">
              <p className="text-sm text-white/40">
                Loading conversation...
              </p>
            </div>

          ) : errorMessage ? (

            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="max-w-sm rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
                <p className="text-sm text-red-400">
                  {errorMessage}
                </p>

                <button
                  type="button"
                  onClick={fetchChat}
                  className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Try Again
                </button>
              </div>
            </div>

          ) : messages.length === 0 ? (

            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-xl">
                  💬
                </div>

                <h2 className="mt-4 text-base font-semibold text-white">
                  Start the conversation
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  Send a message to {brandName}.
                </p>

              </div>
            </div>

          ) : (

            <div className="mx-auto max-w-3xl space-y-3">

              {messages.map((message) => {
                const isMine = message.sender_id === userId;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isMine
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${
                        isMine
                          ? "rounded-br-md bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                          : "rounded-bl-md border border-white/10 bg-white/[0.05] text-white/90"
                      }`}
                    >

                      <p className="break-words text-sm leading-5">
                        {message.content}
                      </p>

                      <p
                        className={`mt-1 text-[10px] ${
                          isMine
                            ? "text-white/60"
                            : "text-white/30"
                        }`}
                      >
                        {new Date(
                          message.created_at
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>

        {/* Message Input */}
        {!loading && !errorMessage && (
          <div className="border-t border-white/10 bg-[#080812] px-4 py-4 sm:px-6">

            <div className="mx-auto flex max-w-3xl items-center gap-2">

              <input
                type="text"
                value={messageText}
                onChange={(event) =>
                  setMessageText(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder={`Message ${brandName}...`}
                disabled={sending}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-pink-500/40 disabled:opacity-50"
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={!messageText.trim() || sending}
                className="shrink-0 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending ? "..." : "Send"}
              </button>

            </div>

          </div>
        )}

      </div>

    </main>
  );
}