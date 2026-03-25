"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { CategorySales } from "./types";
import { CATEGORY_COLORS } from "./analyticsData";

interface Props {
  data: CategorySales[];
  comparePeriod?: boolean;
  prevData?: CategorySales[];
}

const CATEGORIES = ["Electronics", "HomeGoods", "Kitchen", "Outdoor", "Accessories"] as const;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: any) => s + (p.value || 0), 0);
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-2xl text-sm min-w-[160px]">
      <p className="font-bold mb-2 text-xs text-muted-foreground uppercase">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground">{p.dataKey.replace(/([A-Z])/g, " $1").trim()}</span>
          </span>
          <span className="font-semibold">${(p.value / 1000).toFixed(1)}k</span>
        </div>
      ))}
      <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold">
        <span>Total</span>
        <span>${(total / 1000).toFixed(1)}k</span>
      </div>
    </div>
  );
};

export default function CategorySalesChart({ data, comparePeriod, prevData }: Props) {
  // For compare mode: merge prev totals as a line overlay
  const merged = data.map((d, i) => {
    const prevTotal = prevData?.[i]
      ? CATEGORIES.reduce((s, c) => s + ((prevData[i] as any)[c] || 0), 0)
      : 0;
    return { ...d, prevTotal };
  });

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-bold text-sm mb-4">Sales by Category</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={merged} margin={{ top: 5, right: 5, left: 0, bottom: 0 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: "#888" }}
            axisLine={false} tickLine={false} width={48}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          {CATEGORIES.map((cat) => (
            <Bar
              key={cat}
              dataKey={cat}
              stackId="a"
              fill={CATEGORY_COLORS[cat]}
              radius={cat === "Accessories" ? [4, 4, 0, 0] : undefined}
              isAnimationActive={true}
              animationDuration={800}
              animationBegin={0}
            />
          ))}
          {comparePeriod && (
            <Bar
              dataKey="prevTotal"
              fill="none"
              stroke="#fff"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              name="Prev Period"
              isAnimationActive={false}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
