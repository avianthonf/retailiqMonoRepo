"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { MonthlyData } from "./types";

interface ProfitMarginChartProps {
  data: MonthlyData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-bold mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-muted-foreground">Margin:</span>
        <span className="font-semibold text-emerald-400">{payload[0]?.value?.toFixed(1)}%</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <div className="w-2 h-2 rounded-full bg-violet-400" />
        <span className="text-muted-foreground">Net Profit:</span>
        <span className="font-semibold">${payload[1]?.value?.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default function ProfitMarginChart({ data }: ProfitMarginChartProps) {
  const avg = data.reduce((s, d) => s + d.margin, 0) / data.length;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm">Profit Margin Trend</h3>
        <span className="text-xs text-muted-foreground">
          Avg: <span className="font-semibold text-emerald-400">{avg.toFixed(1)}%</span>
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="marginGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#10b981" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
          <YAxis
            yAxisId="margin"
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#888" }}
            axisLine={false}
            tickLine={false}
            width={40}
            domain={[20, 50]}
          />
          <YAxis
            yAxisId="profit"
            orientation="right"
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: "#888" }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine yAxisId="margin" y={avg} stroke="#888" strokeDasharray="4 4" strokeOpacity={0.5} />
          <Line
            yAxisId="margin"
            type="monotone"
            dataKey="margin"
            stroke="url(#marginGrad)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Line
            yAxisId="profit"
            type="monotone"
            dataKey="profit"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
