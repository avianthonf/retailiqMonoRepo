"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, Package, TrendingUp, ShoppingCart, Users, Sparkles, Check, X, Mail, Smartphone } from "lucide-react";

type Delivery = "in-app" | "email" | "both";
type Priority = "critical" | "normal";

interface AlertConfig {
  id: string;
  category: string;
  label: string;
  description: string;
  enabled: boolean;
  threshold?: number;
  thresholdLabel?: string;
  delivery: Delivery;
  priority: Priority;
}

const FEED = [
  { id: "f1", time: "2 min ago", category: "Inventory", message: "Wireless Earbuds Pro stock fell below 5 units", level: "critical" },
  { id: "f2", time: "18 min ago", category: "Revenue", message: "Daily revenue is tracking 22% above yesterday", level: "success" },
  { id: "f3", time: "45 min ago", category: "Orders", message: "Unusual order spike detected — 34 orders in 10 minutes", level: "warning" },
  { id: "f4", time: "1 hr ago", category: "Customers", message: "VIP customer James Wilson placed a $1,240 order", level: "success" },
  { id: "f5", time: "2 hrs ago", category: "AI", message: "Weekly AI summary: Revenue up 8.1%, review growth report", level: "info" },
  { id: "f6", time: "3 hrs ago", category: "Inventory", message: "USB-C Hub overstock detected — 340% above reorder point", level: "warning" },
  { id: "f7", time: "5 hrs ago", category: "Orders", message: "2 orders cancelled — view cancellation reasons", level: "warning" },
  { id: "f8", time: "Yesterday", category: "Customers", message: "3 At-Risk customers haven't ordered in 60+ days", level: "critical" },
];

const LEVEL_STYLE: Record<string, string> = {
  critical: "text-red-400 bg-red-400/10 border-red-400/20",
  warning:  "text-amber-400 bg-amber-400/10 border-amber-400/20",
  success:  "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  info:     "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

const CATEGORY_ICON: Record<string, any> = {
  Inventory: Package,
  Revenue: TrendingUp,
  Orders: ShoppingCart,
  Customers: Users,
  AI: Sparkles,
};

const DEFAULT_ALERTS: AlertConfig[] = [
  { id: "a1", category: "Inventory", label: "Low Stock Alert", description: "Trigger when a product falls below reorder point.", enabled: true, threshold: 5, thresholdLabel: "units", delivery: "both", priority: "critical" },
  { id: "a2", category: "Inventory", label: "Overstock Alert", description: "Trigger when stock exceeds 4× reorder point.", enabled: false, delivery: "in-app", priority: "normal" },
  { id: "a3", category: "Revenue", label: "Daily Revenue Drop", description: "Alert if daily revenue drops more than set % vs. yesterday.", enabled: true, threshold: 20, thresholdLabel: "%", delivery: "email", priority: "critical" },
  { id: "a4", category: "Revenue", label: "Revenue Milestone Hit", description: "Celebrate when monthly revenue target is surpassed.", enabled: true, delivery: "in-app", priority: "normal" },
  { id: "a5", category: "Orders", label: "Order Spike", description: "Alert when order rate exceeds threshold per hour.", enabled: true, threshold: 30, thresholdLabel: "orders/hr", delivery: "both", priority: "normal" },
  { id: "a6", category: "Orders", label: "High Cancellation Rate", description: "Alert if cancellations exceed set % of total orders.", enabled: true, threshold: 5, thresholdLabel: "%", delivery: "email", priority: "critical" },
  { id: "a7", category: "Customers", label: "VIP Order Placed", description: "Notify when a VIP or Champion segment customer orders.", enabled: true, delivery: "in-app", priority: "normal" },
  { id: "a8", category: "Customers", label: "At-Risk Churn", description: "Alert when At-Risk customers haven't ordered in set days.", enabled: false, threshold: 45, thresholdLabel: "days", delivery: "email", priority: "normal" },
  { id: "a9", category: "AI", label: "Weekly AI Summary", description: "Receive a weekly AI-generated business summary every Monday.", enabled: true, delivery: "email", priority: "normal" },
  { id: "a10", category: "AI", label: "AI Insight Detected", description: "Notify when the AI detects a significant opportunity or risk.", enabled: true, delivery: "in-app", priority: "normal" },
];

const CATEGORIES = ["Inventory", "Revenue", "Orders", "Customers", "AI"];

export default function SmartAlertsPage() {
  const [alerts, setAlerts] = useState<AlertConfig[]>(() => {
    if (typeof window === "undefined") return DEFAULT_ALERTS;
    try {
      const saved = localStorage.getItem("retailos-smart-alerts");
      return saved ? JSON.parse(saved) : DEFAULT_ALERTS;
    } catch { return DEFAULT_ALERTS; }
  });

  const [feed, setFeed] = useState(FEED);
  const [activeCategory, setActiveCategory] = useState("Inventory");
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  const setThreshold = (id: string, val: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, threshold: val } : a));
  const setDelivery = (id: string, val: Delivery) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, delivery: val } : a));
  const dismissFeed = (id: string) => setFeed(prev => prev.filter(f => f.id !== id));

  const handleSave = () => {
    localStorage.setItem("retailos-smart-alerts", JSON.stringify(alerts));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const filtered = alerts.filter(a => a.category === activeCategory);
  const enabledCount = alerts.filter(a => a.enabled).length;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-red-500/15"><Bell size={20} className="text-red-500" /></div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Smart Alerts</h1>
          </div>
          <p className="text-sm text-muted-foreground">{enabledCount} of {alerts.length} alerts enabled. Customize what matters most to you.</p>
        </div>
        <button onClick={handleSave}
          className={`self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${saved ? "bg-emerald-500 text-white shadow-emerald-500/30" : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/30"}`}>
          {saved ? <><Check size={14} /> Saved!</> : <><Bell size={14} /> Save Preferences</>}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Alert Config Panel */}
        <div className="xl:col-span-2 space-y-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const Icon = CATEGORY_ICON[cat] || Bell;
              const active = activeCategory === cat;
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${active ? "bg-primary text-primary-foreground shadow shadow-primary/30" : "bg-card border border-border text-muted-foreground hover:border-primary/40"}`}>
                  <Icon size={12} />{cat}
                </button>
              );
            })}
          </div>

          {/* Alert Cards */}
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              {filtered.map(a => (
                <motion.div key={a.id} layout className={`bg-card border rounded-2xl p-5 transition-all ${a.enabled ? "border-border" : "border-border/40 opacity-60"}`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm">{a.label}</p>
                        {a.priority === "critical" && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-400/10 text-red-400">CRITICAL</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{a.description}</p>
                    </div>
                    <button onClick={() => toggle(a.id)} className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${a.enabled ? "bg-primary" : "bg-muted"}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${a.enabled ? "left-6" : "left-1"}`} />
                    </button>
                  </div>

                  {a.enabled && (
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border/50">
                      {a.threshold !== undefined && (
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground">Threshold</label>
                          <input type="number" value={a.threshold} onChange={e => setThreshold(a.id, Number(e.target.value))}
                            className="w-20 text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/40" />
                          <span className="text-xs text-muted-foreground">{a.thresholdLabel}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 ml-auto">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground mr-1">Delivery</label>
                        {(["in-app","email","both"] as Delivery[]).map(d => (
                          <button key={d} onClick={() => setDelivery(a.id, d)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${a.delivery === d ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                            {d === "in-app" ? <Smartphone size={11} /> : d === "email" ? <Mail size={11} /> : <><Mail size={10}/><span className="mx-0.5">+</span><Smartphone size={10}/></>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Recent Alerts Feed */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 p-5 border-b border-border">
            <Bell size={16} className="text-primary" />
            <h2 className="font-bold text-sm">Recent Alerts</h2>
            <span className="ml-auto text-xs text-muted-foreground">{feed.length} alerts</span>
          </div>
          <div className="divide-y divide-border">
            <AnimatePresence>
              {feed.map(f => {
                const Icon = CATEGORY_ICON[f.category] || Bell;
                return (
                  <motion.div key={f.id} layout exit={{ opacity: 0, height: 0 }} className={`flex items-start gap-3 px-4 py-3 border-l-2 ${LEVEL_STYLE[f.level]} hover:bg-muted/10 transition-colors`}>
                    <Icon size={14} className="shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-snug">{f.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{f.category} · {f.time}</p>
                    </div>
                    <button onClick={() => dismissFeed(f.id)} className="shrink-0 p-1 rounded hover:bg-muted/50 transition-colors">
                      <X size={11} className="text-muted-foreground" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {feed.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <BellOff size={24} className="text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">No alerts right now</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
