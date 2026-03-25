"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { MonthlyData } from "./types";

interface RevenueExpenseChartProps {
  data: MonthlyData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-bold mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-semibold">${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function RevenueExpenseChart({ data }: RevenueExpenseChartProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-bold text-sm mb-4">Revenue vs Expenses</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#A680FF" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#A680FF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#D97757" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#D97757" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: "#888" }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#A680FF"
            strokeWidth={2.5}
            fill="url(#revGrad)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#D97757"
            strokeWidth={2}
            fill="url(#expGrad)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
