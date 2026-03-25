"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center glass-card rounded-3xl border border-border/50"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
        <div className="relative p-6 bg-card border border-border rounded-2xl shadow-xl">
          <Icon className="w-12 h-12 text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-[300px] mb-8">
        {description}
      </p>
      {action && action}
    </motion.div>
  );
}
