"use client";

import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { AOVData } from "./types";

interface Props {
  data: AOVData[];
  comparePeriod?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-2xl text-sm">
      <p className="font-bold text-xs text-muted-foreground uppercase mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: p.stroke || p.color }}
          />
          <span className="text-muted-foreground">
            {p.dataKey === "current" ? "Current" : "Previous"}:
          </span>
          <span className="font-semibold">${p.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
};

export default function AOVTrendChart({ data, comparePeriod }: Props) {
  const avg = (data.reduce((s, d) => s + d.current, 0) / data.length).toFixed(2);

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm">Average Order Value</h3>
        <span className="text-xs text-muted-foreground">
          Avg: <span className="font-semibold text-primary">${avg}</span>
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="aovGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v) => `$${v}`}
            tick={{ fontSize: 11, fill: "#888" }}
            axisLine={false} tickLine={false} width={44}
            domain={["dataMin - 5", "dataMax + 5"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="current"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#aovGrad)"
            dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          {comparePeriod && (
            <Area
              type="monotone"
              dataKey="previous"
              stroke="#888"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              fill="none"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
