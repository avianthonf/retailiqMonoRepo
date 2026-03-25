"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Download, Trash2, Bot, 
  MessageSquare, LayoutDashboard 
} from "lucide-react";
import Link from "next/link";
import ChatMessage, { Message } from "@/components/ai/ChatMessage";
import ChatInput from "@/components/ai/ChatInput";

const STORAGE_KEY = "retailos_chat_history";

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Load history from session storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    } else {
      // Initial greeting
      setMessages([
        {
          id: "initial",
          role: "assistant",
          content: "Hello! I'm your **RetailOS Business Advisor**. I have real-time access to your revenue, inventory, and customer data. How can I help you grow your business today?",
        },
      ]);
    }
  }, []);

  // 2. Persist history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // 3. Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to connect to AI");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      let accumulatedContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        accumulatedContent += chunk;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id ? { ...m, content: accumulatedContent } : m
          )
        );
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: "error-" + Date.now(),
          role: "assistant",
          content: "I'm having trouble connecting to my brain right now. Please check your internet or try again. (Technical error: " + error.message + ")",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm("Clear all chat history?")) {
      localStorage.removeItem(STORAGE_KEY);
      setMessages([
        {
          id: "reset",
          role: "assistant",
          content: "History cleared. What would you like to discuss now?",
        },
      ]);
    }
  };

  const exportConversation = () => {
    const text = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RetailOS-AI-Chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-background">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-claude-purple/15 flex items-center justify-center">
            <Sparkles className="text-claude-purple" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-claude-charcoal dark:text-claude-beige">Claude AI Advisor</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-claude-orange animate-pulse" />
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Premium Intelligence</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportConversation}
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            title="Export Conversation"
          >
            <Download size={18} />
          </button>
          <button
            onClick={clearHistory}
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-red-400 transition-all font-bold"
            title="Clear History"
          >
            <Trash2 size={18} />
          </button>
          <Link
            href="/dashboard"
            className="ml-2 flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <LayoutDashboard size={14} /> Dashboard
          </Link>
        </div>
      </div>

      {/* ── Chat Messages ────────────────────────────────────────────────── */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-2 scroll-smooth"
      >
        <div className="max-w-4xl mx-auto">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start mb-6"
            >
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot size={18} className="text-primary animate-pulse" />
                </div>
                <div className="bg-muted/50 border border-border px-4 py-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1.5 py-1">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-1.5 h-1.5 rounded-full bg-primary/60"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-primary/60"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-1.5 h-1.5 rounded-full bg-primary/60"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {messages.length === 1 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
              <MessageSquare size={48} className="text-muted-foreground" />
              <div className="max-w-xs">
                <p className="text-sm font-semibold">Start a Strategic Conversation</p>
                <p className="text-[10px]">Ask about trends, inventory risks, or revenue optimizations.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Input Area ──────────────────────────────────────────────────── */}
      <div className="px-6 py-6 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
          <p className="text-center text-[10px] text-muted-foreground mt-4">
            AI can make mistakes. Always verify critical financial decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
