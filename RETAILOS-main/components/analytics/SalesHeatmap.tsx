"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { HeatmapCell } from "./types";

interface Props {
  data: HeatmapCell[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function getColor(value: number, max: number): string {
  const intensity = value / max;
  if (intensity < 0.15) return "rgba(166, 128, 255, 0.08)";
  if (intensity < 0.3) return "rgba(166, 128, 255, 0.2)";
  if (intensity < 0.5) return "rgba(166, 128, 255, 0.4)";
  if (intensity < 0.7) return "rgba(166, 128, 255, 0.6)";
  if (intensity < 0.85) return "rgba(166, 128, 255, 0.8)";
  return "rgba(166, 128, 255, 1)";
}

export default function SalesHeatmap({ data }: Props) {
  const [tooltip, setTooltip] = useState<{ cell: HeatmapCell; x: number; y: number } | null>(null);

  const max = useMemo(() => Math.max(...data.map((c) => c.value)), [data]);
  const cellMap = useMemo(() => {
    const m: Record<string, HeatmapCell> = {};
    data.forEach((c) => { m[`${c.day}-${c.hour}`] = c; });
    return m;
  }, [data]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 relative">
      <h3 className="font-bold text-sm mb-4">Sales Heatmap — Hour-by-Hour</h3>

      <div className="overflow-x-auto">
        {/* Hour labels */}
        <div className="flex gap-[2px] ml-10 mb-1">
          {HOURS.map((h) => (
            <div
              key={h}
              className="flex-1 min-w-[22px] text-center text-[9px] text-muted-foreground"
            >
              {h % 3 === 0 ? `${h}:00` : ""}
            </div>
          ))}
        </div>

        {/* Grid */}
        {DAYS.map((day, di) => (
          <div key={day} className="flex items-center gap-[2px] mb-[2px]">
            <span className="w-8 text-[10px] text-muted-foreground font-semibold shrink-0 text-right pr-1.5">
              {day}
            </span>
            {HOURS.map((h) => {
              const cell = cellMap[`${di}-${h}`];
              const val = cell?.value ?? 0;
              return (
                <motion.div
                  key={h}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (di * 24 + h) * 0.002 }}
                  className="flex-1 min-w-[22px] h-[22px] rounded-[3px] cursor-pointer transition-transform hover:scale-125 hover:z-10"
                  style={{ backgroundColor: getColor(val, max) }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({ cell: cell!, x: rect.left + rect.width / 2, y: rect.top - 8 });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Scale legend */}
      <div className="flex items-center gap-2 mt-4 justify-center text-[10px] text-muted-foreground">
        <span>Low</span>
        {[0.1, 0.25, 0.45, 0.65, 0.85, 1].map((v) => (
          <div
            key={v}
            className="w-4 h-4 rounded-[2px]"
            style={{ backgroundColor: getColor(v * max, max) }}
          />
        ))}
        <span>High</span>
      </div>

      {/* Tooltip portal */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
        >
          <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-2xl text-xs">
            <p className="font-bold">{DAYS[tooltip.cell.day]} {tooltip.cell.hour}:00</p>
            <p className="text-muted-foreground">
              <span className="font-semibold text-primary">{tooltip.cell.value}</span> sales
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
