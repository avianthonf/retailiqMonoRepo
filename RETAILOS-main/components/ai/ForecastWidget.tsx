"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, AreaChart, Area, ReferenceLine
} from "recharts";
import { 
  TrendingUp, AlertTriangle, Lightbulb, 
  RefreshCcw, Sparkles, ArrowRight, Target
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface ForecastData {
  predictedRevenue: number;
  confidence: number;
  keyFactors: string[];
  recommendations: string[];
}

const MOCK_HISTORY = [
  { day: "Day 1", revenue: 2400 },
  { day: "Day 5", revenue: 1398 },
  { day: "Day 10", revenue: 9800 },
  { day: "Day 15", revenue: 3908 },
  { day: "Day 20", revenue: 4800 },
  { day: "Day 25", revenue: 3800 },
  { day: "Day 30 (Actual)", revenue: 4300 },
];

export default function ForecastWidget() {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchForecast = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/ai/forecast", { method: "POST" });
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Forecast fetch failed", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  // Prepare chart data: Merge history with predicted point
  const chartData = [
    ...MOCK_HISTORY,
    { day: "Next Month (FC)", revenue: data?.predictedRevenue || 0, isForecast: true }
  ];

  if (loading) return <ForecastSkeleton />;

  return (
    <Card className="bg-card/40 backdrop-blur-md rounded-2xl shadow-xl border border-border/50 group h-full flex flex-col">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shadow-inner">
            <TrendingUp className="text-primary" size={20} />
          </div>
          <div>
            <CardTitle className="font-bold text-lg tracking-tight">AI Sales Forecast</CardTitle>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">Next 30 Day Projection</p>
          </div>
        </div>

        <button 
          onClick={fetchForecast}
          disabled={refreshing}
          className="p-2.5 rounded-xl hover:bg-muted transition-all active:scale-95 disabled:opacity-50 ring-1 ring-border/50"
        >
          <RefreshCcw size={18} className={`${refreshing ? "animate-spin text-primary" : "text-muted-foreground"}`} />
        </button>
      </CardHeader>

      <CardContent className="p-6 space-y-8 flex-1">
        {/* ── Main Projections & Gauge ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2 h-[240px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  hide
                />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--card)", borderRadius: "12px", border: "1px solid var(--border)" }}
                  itemStyle={{ color: "var(--primary)", fontSize: "12px" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  animationDuration={1500}
                />
                <ReferenceLine 
                  x="Day 30 (Actual)" 
                  stroke="var(--border)" 
                  strokeDasharray="3 3" 
                  label={{ position: 'top', value: 'Today', fill: 'var(--muted-foreground)', fontSize: 10 }} 
                />
              </AreaChart>
            </ResponsiveContainer>
            
            <div className="absolute top-4 left-4 bg-background/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Projected Revenue</p>
              <h4 className="text-2xl font-black text-primary">${data?.predictedRevenue?.toLocaleString()}</h4>
            </div>
          </div>

          {/* Confidence Gauge */}
          <div className="flex flex-col items-center justify-center p-6 border border-border rounded-2xl bg-muted/20 relative overflow-hidden">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted/20"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <motion.circle
                  className="text-primary"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 40) * (1 - (data?.confidence || 0.8)) }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black">{Math.round((data?.confidence || 0) * 100)}%</span>
                <span className="text-[9px] uppercase font-bold text-muted-foreground">Confidence</span>
              </div>
            </div>
            <p className="text-[11px] text-center mt-4 text-muted-foreground leading-relaxed">
              Based on seasonal patterns and recent velocity.
            </p>
          </div>
        </div>

        {/* ── Insight Cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <Target size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Opportunity</span>
            </div>
            <p className="text-xs font-medium leading-relaxed">{data?.recommendations?.[0] || "Maintain current conversion rates to hit targets."}</p>
          </div>

          <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Top Risk</span>
            </div>
            <p className="text-xs font-medium leading-relaxed">{data?.keyFactors?.[0] || "Inventory levels for top sellers are declining."}</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-2">
            <div className="flex items-center gap-2 text-blue-400">
              <Lightbulb size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Growth Action</span>
            </div>
            <p className="text-xs font-medium leading-relaxed">{data?.recommendations?.[1] || "Optimize pricing for the upcoming holiday peak."}</p>
          </div>
        </div>

        {/* ── Footer Actions ────────────────────────────────────────────── */}
      </CardContent>
      <CardFooter className="pt-4 border-t border-border/50 pb-4 px-6">
        <Link 
          href="/dashboard/ai"
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all group"
        >
          <Sparkles size={16} />
          Ask AI about this forecast
          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  );
}

function ForecastSkeleton() {
  return (
    <Card className="bg-card/40 backdrop-blur-md rounded-2xl shadow-xl border border-border/50 h-full animate-pulse">
      <CardHeader className="flex flex-row justify-between items-center pb-4 border-b border-border/50">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted" />
          <div className="space-y-2">
            <div className="w-32 h-4 bg-muted rounded" />
            <div className="w-20 h-2 bg-muted rounded" />
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-muted" />
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[200px] bg-muted/30 rounded-2xl" />
          <div className="flex items-center justify-center p-6 bg-muted/20 rounded-2xl h-[200px]">
            <div className="w-24 h-24 rounded-full border-4 border-muted/50" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-muted/20 rounded-2xl" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
