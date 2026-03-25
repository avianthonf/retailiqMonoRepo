"use client";

import React, { useState } from "react";
import { Send, Sparkles, AlertCircle, ShoppingCart, BarChart3 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

const QUICK_PROMPTS = [
  { text: "Forecast this week", icon: BarChart3 },
  { text: "What's my best product?", icon: ShoppingCart },
  { text: "Where am I losing money?", icon: AlertCircle },
  { text: "What should I reorder?", icon: Sparkles },
];

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt.text}
            onClick={() => onSend(prompt.text)}
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <prompt.icon size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
            <span>{prompt.text}</span>
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="relative group">
        <textarea
          rows={1}
          placeholder="Ask RetailOS AI anything about your business..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={disabled}
          className="w-full bg-card border border-border rounded-2xl pl-4 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-70 transition-all resize-none shadow-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:hover:bg-primary transition-all"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
