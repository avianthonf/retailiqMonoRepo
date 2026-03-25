"use client";

import { motion } from "framer-motion";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="h-10 w-48 bg-muted rounded-xl animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-card border border-border rounded-2xl p-6">
            <div className="h-4 w-24 bg-muted rounded mb-4 animate-pulse" />
            <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px] bg-card border border-border rounded-2xl p-6">
          <div className="h-6 w-32 bg-muted rounded mb-6 animate-pulse" />
          <div className="h-full w-full bg-muted/30 rounded-xl animate-pulse" />
        </div>
        <div className="h-[400px] bg-card border border-border rounded-2xl p-6">
          <div className="h-6 w-32 bg-muted rounded mb-6 animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="flex gap-4">
                <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
