"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import { Mic, MicOff, Volume2, X, Loader2, Zap, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  "Today's sales",
  "Low stock",
  "Top products",
  "Monthly P&L",
];

export function VoiceAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [textInput, setTextInput] = useState("");
  const [isTextLoading, setIsTextLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch signed URL whenever the panel opens (voice mode)
  useEffect(() => {
    if (!isOpen || mode !== "voice") return;
    setUrlError(null);
    setSignedUrl(null);

    fetch("/api/elevenlabs/signed-url")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) {
          setUrlError(data.error ?? "Failed to connect to ElevenLabs.");
          return;
        }
        setSignedUrl(data.signedUrl);
      })
      .catch(() => setUrlError("Network error reaching ElevenLabs."));
  }, [isOpen, mode]);

  // Focus text input when switching to text mode
  useEffect(() => {
    if (mode === "text" && isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [mode, isOpen]);

  // Auto-scroll transcript
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  const addMessage = useCallback(
    (role: "user" | "assistant", text: string) => {
      setMessages((prev) => [...prev, { role, text, timestamp: new Date() }]);
      scrollToBottom();
    },
    [scrollToBottom]
  );

  // ── Client tools ─────────────────────────────────────────────────────────────
  const clientTools = {
    getDailyRevenue: async () => {
      const res = await fetch("/api/voice/revenue");
      const data = await res.json();
      return data.summary ?? "Revenue data unavailable.";
    },
    getLowStockItems: async () => {
      const res = await fetch("/api/voice/low-stock");
      const data = await res.json();
      return data.summary ?? "Inventory data unavailable.";
    },
    getTopProducts: async ({ period = "week" }: { period?: string }) => {
      const res = await fetch(`/api/voice/top-products?period=${period}`);
      const data = await res.json();
      return data.summary ?? "Sales data unavailable.";
    },
    getCustomerSummary: async () => {
      const res = await fetch("/api/voice/customers");
      const data = await res.json();
      return data.summary ?? "Customer data unavailable.";
    },
    getFinancialSnapshot: async () => {
      const res = await fetch("/api/voice/financials");
      const data = await res.json();
      return data.summary ?? "Financial data unavailable.";
    },
  };

  const conversation = useConversation({
    clientTools,
    onConnect: () => {
      addMessage("assistant", "Hi! I'm your RetailOS assistant. Ask me anything about your store.");
    },
    onDisconnect: () => {
      console.log("ElevenLabs agent disconnected");
    },
    onMessage: ({ message, source }: { message: string; source: string }) => {
      addMessage(source === "user" ? "user" : "assistant", message);
    },
    onError: (error: Error | string) => {
      console.error("ElevenLabs agent error:", error);
    },
  });

  const isConnected = conversation.status === "connected";
  const agentSpeaking = conversation.isSpeaking;
  const isConnecting = conversation.status === "connecting";

  const startCall = useCallback(async () => {
    if (!signedUrl) return;
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ signedUrl });
    } catch (err) {
      console.error("Failed to start ElevenLabs session:", err);
    }
  }, [conversation, signedUrl]);

  const endCall = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const handleClose = useCallback(() => {
    if (isConnected) endCall();
    setIsOpen(false);
    setMessages([]);
    setTextInput("");
  }, [endCall, isConnected]);

  const handleSwitchMode = useCallback(
    (newMode: "voice" | "text") => {
      if (isConnected) endCall();
      setMode(newMode);
    },
    [endCall, isConnected]
  );

  // ── Text chat via ElevenLabs text conversation ────────────────────────────────
  const handleTextSend = useCallback(async () => {
    const msg = textInput.trim();
    if (!msg || isTextLoading) return;

    setTextInput("");
    addMessage("user", msg);
    setIsTextLoading(true);

    try {
      // Use ElevenLabs sendUserMessage if connected, else call voice tool APIs directly
      if (isConnected) {
        await (conversation as any).sendUserMessage(msg);
      } else {
        // Standalone text: call our own AI route for text responses
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            messages: messages
              .map(m => ({ role: m.role, content: m.text }))
              .concat({ role: "user", content: msg })
          }),
        });
        if (res.ok) {
          const reader = res.body?.getReader();
          const decoder = new TextDecoder();
          let currentReply = "";
          
          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const text = decoder.decode(value, { stream: true });
              currentReply += text;
              
              // Incrementally update the last assistant message
              setMessages(prev => {
                const newMessages = [...prev];
                const last = newMessages[newMessages.length - 1];
                if (last && last.role === "assistant" && last.timestamp.getTime() > Date.now() - 5000) {
                  last.text = currentReply;
                  return [...newMessages];
                } else {
                  return [...prev, { role: "assistant", text: currentReply, timestamp: new Date() }];
                }
              });
              scrollToBottom();
            }
          }
        } else {
          addMessage("assistant", "Sorry, I couldn't process that. Please try again.");
        }
      }
    } catch {
      addMessage("assistant", "Something went wrong. Please try again.");
    } finally {
      setIsTextLoading(false);
    }
  }, [textInput, isTextLoading, isConnected, conversation, addMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSend();
    }
  };

  return (
    <>
      {/* ── Floating trigger button ─────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open RetailOS AI voice assistant"
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-200",
          "bg-gradient-to-br from-violet-600 to-purple-700 text-white",
          "hover:scale-110 hover:shadow-violet-500/40 hover:shadow-2xl",
          isConnected && "ring-2 ring-violet-400 ring-offset-2 ring-offset-background animate-pulse"
        )}
      >
        {isConnected ? <Zap className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>

      {/* ── Agent panel ─────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-24 right-6 z-50 w-80 rounded-2xl shadow-2xl",
            "border border-white/10 bg-[#0d0f1a]",
            "flex flex-col overflow-hidden"
          )}
          style={{ maxHeight: "520px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 shrink-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  isConnected
                    ? "bg-green-400 animate-pulse"
                    : isConnecting
                    ? "bg-amber-400 animate-pulse"
                    : "bg-gray-600"
                )}
              />
              <span className="text-sm font-semibold text-white tracking-tight">RetailOS AI</span>
              {agentSpeaking && (
                <span className="text-[10px] text-violet-300 animate-pulse font-medium">speaking…</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Mode toggle */}
              <div className="flex rounded-lg border border-white/10 overflow-hidden">
                <button
                  onClick={() => handleSwitchMode("voice")}
                  aria-label="Voice mode"
                  className={cn(
                    "px-2 py-1 text-xs transition-colors",
                    mode === "voice"
                      ? "bg-violet-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Mic className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleSwitchMode("text")}
                  aria-label="Text mode"
                  className={cn(
                    "px-2 py-1 text-xs transition-colors",
                    mode === "text"
                      ? "bg-violet-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  <MessageSquare className="h-3 w-3" />
                </button>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close voice assistant"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Error banner */}
          {urlError && mode === "voice" && (
            <div className="mx-4 mt-3 rounded-lg bg-red-950/60 border border-red-800/50 px-3 py-2 text-xs text-red-300">
              ⚠ {urlError}
            </div>
          )}

          {/* Transcript */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-2 min-h-0"
            style={{ maxHeight: "260px" }}
          >
            {messages.length === 0 && (
              <p className="text-center text-xs text-gray-600 mt-6">
                {mode === "voice" ? "Press the mic to start talking" : "Type a message below"}
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "text-xs px-3 py-2 rounded-xl max-w-[88%] leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-violet-700/70 text-white"
                    : "mr-auto bg-white/10 text-gray-200"
                )}
              >
                {m.text}
              </div>
            ))}
            {isTextLoading && (
              <div className="mr-auto bg-white/10 text-gray-400 text-xs px-3 py-2 rounded-xl max-w-[60%]">
                <span className="flex gap-1 items-center">
                  <span className="animate-bounce" style={{ animationDelay: "0ms" }}>•</span>
                  <span className="animate-bounce" style={{ animationDelay: "150ms" }}>•</span>
                  <span className="animate-bounce" style={{ animationDelay: "300ms" }}>•</span>
                </span>
              </div>
            )}
          </div>

          {/* Quick prompts — only when not connected and no messages yet */}
          {messages.length === 0 && !urlError && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2 shrink-0">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    if (mode === "voice") {
                      startCall();
                    } else {
                      setTextInput(q);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }
                  }}
                  className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-gray-300 hover:bg-white/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* ── Voice controls ── */}
          {mode === "voice" && (
            <div className="flex justify-center border-t border-white/10 py-4 shrink-0">
              {!isConnected ? (
                <button
                  onClick={startCall}
                  disabled={!signedUrl || !!urlError}
                  aria-label="Start voice conversation"
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition-all",
                    "bg-violet-600 text-white hover:bg-violet-500",
                    "disabled:opacity-40 disabled:cursor-not-allowed"
                  )}
                >
                  {!signedUrl && !urlError ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </button>
              ) : (
                <button
                  onClick={endCall}
                  aria-label="End voice conversation"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500 transition-all"
                >
                  <MicOff className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* ── Text input ── */}
          {mode === "text" && (
            <div className="border-t border-white/10 px-3 py-3 shrink-0">
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your store…"
                  className={cn(
                    "flex-1 min-w-0 rounded-xl bg-white/10 border border-white/10 px-3 py-2",
                    "text-xs text-white placeholder:text-gray-500",
                    "focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500",
                    "transition-colors"
                  )}
                />
                <button
                  onClick={handleTextSend}
                  disabled={!textInput.trim() || isTextLoading}
                  aria-label="Send message"
                  className={cn(
                    "shrink-0 flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                    "bg-violet-600 text-white hover:bg-violet-500",
                    "disabled:opacity-40 disabled:cursor-not-allowed"
                  )}
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
