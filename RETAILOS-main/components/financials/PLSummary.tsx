"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { PLMetric } from "./types";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

interface PLSummaryProps {
  metrics: PLMetric[];
}

function fmt(n: number) {
  return "$" + Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function PLSummary({ metrics }: PLSummaryProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((m, i) => {
        const delta = m.value - m.prev;
        const pct = m.prev !== 0 ? Math.abs((delta / m.prev) * 100).toFixed(1) : "0";
        const up = delta >= 0;
        // For expenses: up is BAD (red), for revenue/profit: up is GOOD (green)
        const positive = m.isExpense ? !up : up;

        return (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 120 }}
            className="bg-card border border-border/50 rounded-2xl p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{m.label}</p>
              <div className="p-1.5 rounded-lg bg-primary/10">
                <DollarSign size={13} className="text-primary" />
              </div>
            </div>

            <p className="text-2xl font-bold tracking-tight">
              <AnimatedCounter
                end={m.value}
                decimals={0}
                prefix="$"
              />
            </p>

            <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-400" : "text-red-400"}`}>
              {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              <span>{pct}% vs last period</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
