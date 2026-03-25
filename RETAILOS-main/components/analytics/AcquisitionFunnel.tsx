"use client";

import { motion } from "framer-motion";
import { FunnelStep } from "./types";

interface Props {
  data: FunnelStep[];
}

export default function AcquisitionFunnel({ data }: Props) {
  const max = data[0]?.value ?? 1;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-bold text-sm mb-5">Customer Acquisition Funnel</h3>
      <div className="space-y-3">
        {data.map((step, i) => {
          const pct = (step.value / max) * 100;
          const conv = i > 0 ? ((step.value / data[i - 1].value) * 100).toFixed(1) : null;
          return (
            <div key={step.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold">{step.name}</span>
                <div className="flex items-center gap-3">
                  {conv && (
                    <span className="text-[10px] text-muted-foreground">
                      {conv}% conversion
                    </span>
                  )}
                  <span className="text-xs font-bold">{step.value.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-5 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: i * 0.12, duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full flex items-center justify-end pr-2"
                  style={{ background: step.color }}
                >
                  <span className="text-[10px] font-bold text-white drop-shadow-sm">
                    {pct.toFixed(0)}%
                  </span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Overall conversion */}
      <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs">
        <span className="text-muted-foreground">Overall Conversion Rate</span>
        <span className="font-bold text-emerald-400">
          {((data[data.length - 1].value / data[0].value) * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
