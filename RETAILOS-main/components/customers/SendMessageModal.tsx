"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

interface Props {
  open: boolean;
  customerName: string;
  onClose: () => void;
  onSend: (message: string) => void;
}

export default function SendMessageModal({ open, customerName, onClose, onSend }: Props) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 450, damping: 30, mass: 0.8 }}
            className="relative z-10 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/15">
                  <MessageCircle size={16} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-sm">Send Message</h2>
                  <p className="text-xs text-muted-foreground">To {customerName}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Type your message…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={!message.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 disabled:opacity-40 transition-colors">
                  Send Message
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center">
                Message will be logged as a note on the customer profile
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
