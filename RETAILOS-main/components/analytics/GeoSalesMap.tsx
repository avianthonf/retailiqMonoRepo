"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RegionSales } from "./types";

interface Props {
  data: RegionSales[];
}

// Simple inline US map using SVG paths — avoids the react-simple-maps dependency
// which can have SSR issues with Next.js. This draws a stylized US visualization.
function getColor(value: number, max: number): string {
  const pct = value / max;
  if (pct > 0.8) return "#6366f1";
  if (pct > 0.6) return "#7c3aed";
  if (pct > 0.4) return "#8b5cf6";
  if (pct > 0.2) return "#a78bfa";
  return "#c4b5fd";
}

export default function GeoSalesMap({ data }: Props) {
  const [hoveredState, setHoveredState] = useState<RegionSales | null>(null);

  const max = useMemo(() => Math.max(...data.map((d) => d.value)), [data]);
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const sorted = useMemo(() => [...data].sort((a, b) => b.value - a.value), [data]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm">Geographic Sales Distribution</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total: <span className="font-semibold text-foreground">${total.toLocaleString()}</span> across {data.length} regions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* State bar chart */}
        <div className="space-y-2">
          {sorted.slice(0, 10).map((region, i) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredState(region)}
              onMouseLeave={() => setHoveredState(null)}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-medium group-hover:text-primary transition-colors">
                  {region.name}
                </span>
                <span className="text-xs font-bold">${(region.value / 1000).toFixed(1)}k</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(region.value / max) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="h-full rounded-full"
                  style={{ background: getColor(region.value, max) }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bubble / region visualization */}
        <div className="relative flex items-center justify-center min-h-[220px]">
          <div className="flex flex-wrap gap-1.5 items-center justify-center p-4">
            {sorted.map((region, i) => {
              const size = 20 + (region.value / max) * 50;
              const isHovered = hoveredState?.id === region.id;
              return (
                <motion.div
                  key={region.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03, type: "spring", stiffness: 200 }}
                  className="rounded-full flex items-center justify-center cursor-pointer transition-all"
                  style={{
                    width: size,
                    height: size,
                    background: getColor(region.value, max),
                    opacity: isHovered ? 1 : 0.75,
                    transform: isHovered ? "scale(1.2)" : "scale(1)",
                    border: isHovered ? "2px solid #fff" : "2px solid transparent",
                  }}
                  onMouseEnter={() => setHoveredState(region)}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <span className="text-[8px] font-bold text-white drop-shadow-sm">
                    {region.id.replace("US-", "")}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Tooltip */}
          {hoveredState && (
            <div className="absolute top-2 right-2 bg-card border border-border rounded-lg px-3 py-2 shadow-2xl text-xs z-10">
              <p className="font-bold">{hoveredState.name}</p>
              <p className="text-primary font-semibold">${hoveredState.value.toLocaleString()}</p>
              <p className="text-muted-foreground">{((hoveredState.value / total) * 100).toFixed(1)}% of total</p>
            </div>
          )}
        </div>
      </div>

      {/* Scale */}
      <div className="flex items-center gap-2 mt-4 justify-center text-[10px] text-muted-foreground">
        <span>Low</span>
        {["#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6366f1"].map((c) => (
          <div key={c} className="w-4 h-4 rounded-[2px]" style={{ background: c }} />
        ))}
        <span>High</span>
      </div>
    </div>
  );
}
