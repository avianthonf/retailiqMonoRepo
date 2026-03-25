"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, TrendingUp, ShoppingBag, Smartphone, Store, Share2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const CHANNELS = [
  { id: "c1", name: "Online Store", icon: ShoppingBag, color: "#6366f1", revenue: 38200, orders: 412, aov: 92.7, growth: 12.4, trend: "up" },
  { id: "c2", name: "Marketplace", icon: Store, color: "#10b981", revenue: 22500, orders: 318, aov: 70.8, growth: 8.1, trend: "up" },
  { id: "c3", name: "In-Store POS", icon: Store, color: "#f59e0b", revenue: 11800, orders: 201, aov: 58.7, growth: -3.2, trend: "down" },
  { id: "c4", name: "Social Commerce", icon: Share2, color: "#ec4899", revenue: 6000, orders: 95, aov: 63.2, growth: 34.7, trend: "up" },
];

const MONTHLY = [
  { month: "Oct", online: 28000, marketplace: 16000, pos: 12000, social: 2000 },
  { month: "Nov", online: 32000, marketplace: 18000, pos: 13000, social: 3200 },
  { month: "Dec", online: 41000, marketplace: 23000, pos: 16000, social: 4100 },
  { month: "Jan", online: 30000, marketplace: 17000, pos: 10000, social: 4500 },
  { month: "Feb", online: 34000, marketplace: 19000, pos: 11000, social: 5200 },
  { month: "Mar", online: 38200, marketplace: 22500, pos: 11800, social: 6000 },
];

const OPPORTUNITIES = [
  { channel: "Social Commerce", action: "Increase TikTok Shop budget by 20% — highest MoM growth at +34.7%", priority: "high" },
  { channel: "Online Store", action: "Add upsell bundles to top 5 SKUs — avg order value is 31% above marketplace", priority: "medium" },
  { channel: "In-Store POS", action: "Foot traffic down 3.2%. Consider in-store loyalty push or seasonal promotion", priority: "medium" },
  { channel: "Marketplace", action: "Optimize listing SEO for Electronics category — 8.1% growth headroom available", priority: "low" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-xl text-xs space-y-1">
      <p className="font-bold mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-muted-foreground capitalize">{p.dataKey}</span>
          <span className="font-semibold ml-auto">${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function OmnichannelPage() {
  const totalGMV = CHANNELS.reduce((s, c) => s + c.revenue, 0);
  const bestChannel = CHANNELS.reduce((a, b) => a.revenue > b.revenue ? a : b);
  const avgGrowth = (CHANNELS.reduce((s, c) => s + c.growth, 0) / CHANNELS.length).toFixed(1);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-indigo-500/15"><Globe size={20} className="text-indigo-500" /></div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Omnichannel Growth</h1>
          </div>
          <p className="text-sm text-muted-foreground">Track and grow revenue across all retail channels.</p>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total GMV", value: `$${(totalGMV / 1000).toFixed(1)}k`, icon: TrendingUp, color: "text-indigo-400", bg: "bg-indigo-400/10" },
          { label: "Best Channel", value: bestChannel.name, icon: Globe, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Active Channels", value: CHANNELS.length, icon: Store, color: "text-primary", bg: "bg-primary/10" },
          { label: "Avg MoM Growth", value: `${avgGrowth}%`, icon: ArrowUpRight, color: "text-amber-400", bg: "bg-amber-400/10" },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-card border border-border rounded-xl px-4 sm:px-5 py-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${kpi.bg}`}><kpi.icon size={14} className={kpi.color} /></div>
              <p className="text-xs text-muted-foreground font-medium truncate">{kpi.label}</p>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${kpi.color} truncate`}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Stacked Bar Chart */}
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-4">Revenue by Channel (6 Months)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={MONTHLY} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="online" stackId="a" fill="#6366f1" radius={[0,0,0,0]} />
              <Bar dataKey="marketplace" stackId="a" fill="#10b981" />
              <Bar dataKey="pos" stackId="a" fill="#f59e0b" />
              <Bar dataKey="social" stackId="a" fill="#ec4899" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-3 justify-center">
            {[{ label: "Online Store", color: "#6366f1" }, { label: "Marketplace", color: "#10b981" }, { label: "POS", color: "#f59e0b" }, { label: "Social", color: "#ec4899" }].map(l => (
              <span key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: l.color }} />{l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-4">Channel Mix</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={CHANNELS} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="revenue" labelLine={false}>
                {CHANNELS.map((c, i) => <Cell key={i} fill={c.color} stroke="transparent" />)}
              </Pie>
              <Tooltip formatter={(v: any) => [`$${v.toLocaleString()}`, "Revenue"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {CHANNELS.map(c => (
              <div key={c.id} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                <span className="text-muted-foreground flex-1">{c.name}</span>
                <span className="font-semibold">{((c.revenue / totalGMV) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Performance Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-bold text-sm">Channel Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Channel</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Revenue</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground hidden sm:table-cell">Orders</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground hidden md:table-cell">AOV</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {CHANNELS.map(c => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                      <span className="font-semibold">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold">${c.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground hidden sm:table-cell">{c.orders}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">${c.aov}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`flex items-center justify-end gap-1 font-bold text-xs ${c.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                      {c.trend === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                      {Math.abs(c.growth)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Growth Opportunities */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" />
          <h2 className="font-bold text-sm">AI Growth Opportunities</h2>
        </div>
        <div className="divide-y divide-border">
          {OPPORTUNITIES.map((op, i) => (
            <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
              <span className={`mt-0.5 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                op.priority === "high" ? "bg-red-400/10 text-red-400" :
                op.priority === "medium" ? "bg-amber-400/10 text-amber-400" : "bg-muted text-muted-foreground"
              }`}>{op.priority.toUpperCase()}</span>
              <div>
                <p className="text-xs font-bold text-primary mb-0.5">{op.channel}</p>
                <p className="text-sm text-muted-foreground leading-snug">{op.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
