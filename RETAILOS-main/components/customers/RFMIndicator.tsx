"use client";

import { motion } from "framer-motion";
import { RFMScore } from "./types";

interface Props {
  rfm: RFMScore;
  size?: "sm" | "md";
}

const AXIS_LABELS = [
  { key: "recency",   label: "R", full: "Recency",  color: "#6366f1" },
  { key: "frequency", label: "F", full: "Frequency", color: "#8b5cf6" },
  { key: "monetary",  label: "M", full: "Monetary",  color: "#10b981" },
] as const;

export default function RFMIndicator({ rfm, size = "md" }: Props) {
  const isSmall = size === "sm";

  return (
    <div className={`flex items-center ${isSmall ? "gap-1" : "gap-2"}`}>
      {AXIS_LABELS.map((axis, i) => {
        const value = rfm[axis.key];
        return (
          <div key={axis.key} className="flex flex-col items-center">
            <span className={`font-bold ${isSmall ? "text-[9px]" : "text-[10px]"} text-muted-foreground mb-0.5`}>
              {axis.label}
            </span>
            <div
              className={`flex flex-col-reverse ${isSmall ? "gap-[1px]" : "gap-[2px]"}`}
              title={`${axis.full}: ${value}/5`}
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 + level * 0.03 }}
                  className={`${isSmall ? "w-2.5 h-1" : "w-3.5 h-1.5"} rounded-[1px]`}
                  style={{
                    backgroundColor: level <= value ? axis.color : "rgba(255,255,255,0.08)",
                  }}
                />
              ))}
            </div>
            <span className={`font-bold ${isSmall ? "text-[9px]" : "text-[10px]"} mt-0.5`}
                  style={{ color: axis.color }}>
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
