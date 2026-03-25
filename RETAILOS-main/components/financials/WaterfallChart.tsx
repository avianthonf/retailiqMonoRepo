"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  ResponsiveContainer, ReferenceLine, CartesianGrid,
} from "recharts";
import { WaterfallItem } from "./types";

interface WaterfallChartProps {
  data: WaterfallItem[];
}

// Build recharts-compatible data: each bar has a "base" (invisible) and a "bar" value.
function buildBars(items: WaterfallItem[]) {
  let running = 0;
  return items.map((item) => {
    if (item.isTotal) {
      return { ...item, base: 0, bar: item.cumulative, running: item.cumulative };
    }
    const base = item.isNegative ? item.cumulative : running;
    const bar = Math.abs(item.value);
    if (!item.isNegative) running += item.value;
    return { ...item, base, bar };
  });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const item: WaterfallItem = payload[0]?.payload;
  if (!item) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-bold mb-1">{item.name}</p>
      <p className={item.isNegative ? "text-red-400" : "text-emerald-400"}>
        {item.isNegative ? "-" : "+"}${Math.abs(item.value).toLocaleString()}
      </p>
      {item.isTotal && (
        <p className="text-muted-foreground text-xs mt-1">Cumulative: ${item.cumulative.toLocaleString()}</p>
      )}
    </div>
  );
};

export default function WaterfallChart({ data }: WaterfallChartProps) {
  const bars = buildBars(data);

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-bold text-sm mb-4">Cash Flow Waterfall (Current Month)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={bars} margin={{ top: 12, right: 20, left: 10, bottom: 30 }} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "#888" }}
            axisLine={false}
            tickLine={false}
            angle={-30}
            textAnchor="end"
            interval={0}
            height={48}
          />
          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: "#888" }}
            axisLine={false}
            tickLine={false}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* Invisible base bar to lift the visible bar */}
          <Bar dataKey="base" fill="transparent" stackId="wf" isAnimationActive={false} />
          <Bar dataKey="bar" stackId="wf" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={800}>
            {bars.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.isTotal
                    ? "#6366f1"
                    : entry.isNegative
                    ? "#ef4444"
                    : "#10b981"
                }
                fillOpacity={entry.isTotal ? 1 : 0.85}
              />
            ))}
          </Bar>
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
        </BarChart>
      </ResponsiveContainer>


      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 justify-center text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" />Inflow</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500 inline-block" />Outflow</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-500 inline-block" />Net Total</span>
      </div>
    </div>
  );
}
