"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Bot, User, TrendingUp, Package, Lightbulb } from "lucide-react";

export interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.role === "assistant";

  // Basic markdown-ish renderer with card detection
  const renderedContent = useMemo(() => {
    const lines = message.content.split("\n");
    return lines.map((line, idx) => {
      // ── Detect Revenue/Money ──────────────────────────────────────────────
      const moneyMatch = line.match(/\$(\d{1,3}(,\d{3})*(\.\d{2})?)/);
      // ── Detect SKU/Product ──────────────────────────────────────────────
      const skuMatch = line.match(/SKU-[A-Z0-9]+/);
      // ── Detect Recommendation (starts with Recommendation: or Action:) ──
      const recMatch = line.match(/^(Recommendation|Action|Insight):\s*(.*)/i);

      let lineContent: React.ReactNode = line;

      // Wrap bold text
      if (line.includes("**")) {
        const parts = line.split("**");
        lineContent = parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
      }

      const hasCard = moneyMatch || skuMatch || recMatch;

      return (
        <div key={idx} className="mb-2 last:mb-0">
          <p className="whitespace-pre-wrap">{lineContent}</p>
          
          {hasCard && isAI && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-3 grid gap-2"
            >
              {moneyMatch && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <TrendingUp size={18} />
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Revenue Mentioned</p>
                    <p className="text-sm font-bold">{moneyMatch[0]}</p>
                  </div>
                </div>
              )}
              {skuMatch && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Package size={18} />
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Product Identified</p>
                    <p className="text-sm font-bold">{skuMatch[0]}</p>
                  </div>
                </div>
              )}
              {recMatch && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Lightbulb size={18} />
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">AI {recMatch[1]}</p>
                    <p className="text-sm font-medium">{recMatch[2]}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      );
    });
  }, [message.content, isAI]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: isAI ? -10 : 10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      className={`flex w-full gap-3 ${isAI ? "justify-start" : "justify-end"} mb-6`}
    >
      {isAI && (
        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-1">
          <Bot size={18} className="text-primary" />
        </div>
      )}
      
      <div className={`max-w-[85%] md:max-w-[70%] space-y-2`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
            isAI
              ? "bg-card border border-border text-foreground rounded-tl-none"
              : "bg-primary text-primary-foreground rounded-tr-none shadow-lg shadow-primary/10"
          }`}
        >
          {renderedContent}
        </div>
        <p className={`text-[10px] text-muted-foreground px-1 ${isAI ? "text-left" : "text-right"}`}>
          {isAI ? "RetailOS AI Assistant" : "You"}
        </p>
      </div>

      {!isAI && (
        <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 mt-1">
          <User size={18} className="text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );
}
