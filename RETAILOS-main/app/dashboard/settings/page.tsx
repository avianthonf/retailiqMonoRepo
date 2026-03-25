"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Palette, Bell, Puzzle, Sparkles, 
  Database, Save, Check, Upload, Globe, 
  Clock, CreditCard, Layout, Monitor, Trash2,
  ChevronRight, ExternalLink, Download, ShieldAlert
} from "lucide-react";

// ── Types & Constants ───────────────────────────────────────────────────

type Tab = "profile" | "appearance" | "notifications" | "integrations" | "ai" | "data";

interface SettingToast {
  id: number;
  message: string;
}

// Map theme name → [dark:boolean, CSS vars]
const THEME_VARS: Record<string, [boolean, Record<string, string>]> = {
  "Claude Classic": [false, {
    "--background": "40 30% 96%",
    "--foreground": "224 71% 4%",
    "--card": "0 0% 100%",
    "--border": "220 13% 91%",
    "--muted": "220 14% 96%",
    "--muted-foreground": "220 9% 46%",
  }],
  "Claude Charcoal": [true, {
    "--background": "224 24% 8%",
    "--foreground": "210 40% 98%",
    "--card": "224 24% 11%",
    "--border": "215 20% 18%",
    "--muted": "215 20% 15%",
    "--muted-foreground": "215 16% 55%",
  }],
  "Serene Clay": [false, {
    "--background": "30 25% 90%",
    "--foreground": "25 40% 12%",
    "--card": "30 20% 96%",
    "--border": "25 15% 80%",
    "--muted": "30 15% 85%",
    "--muted-foreground": "25 15% 45%",
  }],
  "Deep Amethyst": [true, {
    "--background": "270 60% 6%",
    "--foreground": "270 20% 96%",
    "--card": "270 50% 10%",
    "--border": "270 30% 20%",
    "--muted": "270 30% 15%",
    "--muted-foreground": "270 15% 55%",
  }],
  "Slate Grey": [true, {
    "--background": "215 25% 10%",
    "--foreground": "215 20% 95%",
    "--card": "215 25% 14%",
    "--border": "215 20% 22%",
    "--muted": "215 20% 18%",
    "--muted-foreground": "215 12% 55%",
  }],
};

// Accent colors as HSL strings
const ACCENT_HSL: Record<string, string> = {
  "#8b5cf6": "258 90% 66%",
  "#ec4899": "330 81% 60%",
  "#10b981": "160 84% 39%",
  "#3b82f6": "217 91% 60%",
  "#f59e0b": "38 92% 50%",
};

function applyTheme(themeName: string) {
  const [isDark, vars] = THEME_VARS[themeName] || THEME_VARS["Claude Classic"];
  const root = document.documentElement;
  if (isDark) root.classList.add("dark");
  else root.classList.remove("dark");
  Object.entries(vars).forEach(([key, val]) => root.style.setProperty(key, val));
  localStorage.setItem("retailos-theme", themeName);
}

function applyAccent(hex: string) {
  const hsl = ACCENT_HSL[hex] || "258 90% 66%";
  document.documentElement.style.setProperty("--primary", hsl);
  localStorage.setItem("retailos-accent", hex);
}

function applyFontSize(size: string) {
  const map: Record<string, string> = { Compact: "13px", Normal: "15px", Comfortable: "17px" };
  document.documentElement.style.fontSize = map[size] || "15px";
  localStorage.setItem("retailos-fontsize", size);
}

// ── Main Component ──────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [toasts, setToasts] = useState<SettingToast[]>([]);
  
  // Settings State
  const [settings, setSettings] = useState({
    businessName: "RetailOS Demo",
    businessType: "Retail/E-commerce",
    currency: "USD ($)",
    timezone: "UTC-5 (EST)",
    theme: "Claude Classic",
    accentColor: "#8b5cf6",
    fontSize: "Normal",
    sidebarStyle: "Full labels",
    cardStyle: "Glassmorphic",
    animationIntensity: "Subtle",
    compactMode: false,
    emailLowStock: true,
    emailLargeOrders: true,
    aiPersonality: "Friendly",
    aiModel: "GPT-4 Turbo",
  });

  // Action: Add Toast
  const addToast = (message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Action: Handle Change — applies CSS immediately
  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));

    if (key === "theme") {
      applyTheme(value);
      addToast(`Theme applied: ${value}`);
    } else if (key === "accentColor") {
      applyAccent(value);
      addToast("Accent color updated");
    } else if (key === "fontSize") {
      applyFontSize(value);
      addToast(`Font size: ${value}`);
    } else {
      addToast(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} updated`);
    }
  };

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("retailos-theme");
    const savedAccent = localStorage.getItem("retailos-accent");
    const savedFont = localStorage.getItem("retailos-fontsize");

    if (savedTheme && THEME_VARS[savedTheme]) {
      applyTheme(savedTheme);
      setSettings(prev => ({ ...prev, theme: savedTheme }));
    }
    if (savedAccent && ACCENT_HSL[savedAccent]) {
      applyAccent(savedAccent);
      setSettings(prev => ({ ...prev, accentColor: savedAccent }));
    }
    if (savedFont) {
      applyFontSize(savedFont);
      setSettings(prev => ({ ...prev, fontSize: savedFont }));
    }
  }, []);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "profile", label: "Business Profile", icon: Building2 },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "integrations", label: "Integrations", icon: Puzzle },
    { id: "ai", label: "AI & Intelligence", icon: Sparkles },
    { id: "data", label: "Data & Backup", icon: Database },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Manage your business configuration and dashboard experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ── Sidebar Navigation ────────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content Area ──────────────────────────────────────────────── */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-3xl p-8 shadow-xl shadow-black/20"
            >
              {activeTab === "profile" && (
                <BusinessProfile settings={settings} handleChange={handleChange} />
              )}
              {activeTab === "appearance" && (
                <AppearanceSettings settings={settings} handleChange={handleChange} />
              )}
              {activeTab === "notifications" && (
                <NotificationSettings settings={settings} handleChange={handleChange} />
              )}
              {activeTab === "integrations" && (
                <IntegrationSettings settings={settings} handleChange={handleChange} />
              )}
              {activeTab === "ai" && (
                <AISettings settings={settings} handleChange={handleChange} />
              )}
              {activeTab === "data" && (
                <DataSettings settings={settings} handleChange={handleChange} addToast={addToast} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Toasts ────────────────────────────────────────────────────── */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm"
            >
              <div className="bg-white/20 p-1 rounded-full">
                <Check size={14} />
              </div>
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-black">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">{children}</label>;
}

function Input({ value, onChange, placeholder }: any) {
  return (
    <input 
      type="text" 
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
    />
  );
}

function Select({ options, value, onChange }: any) {
  return (
    <select 
      value={value}
      onChange={onChange}
      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

// ── Tab Sections ────────────────────────────────────────────────────────

function BusinessProfile({ settings, handleChange }: any) {
  return (
    <div className="space-y-6">
      <SectionTitle title="Business Profile" subtitle="General identity and regional settings." />
      
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 md:col-span-1 space-y-4">
          <div>
            <Label>Business Name</Label>
            <Input 
              value={settings.businessName} 
              onChange={(e: any) => handleChange("businessName", e.target.value)} 
            />
          </div>
          <div>
            <Label>Business Type</Label>
            <Select 
              options={["Retail/E-commerce", "Wholesale", "Service-based", "Marketplace"]} 
              value={settings.businessType} 
              onChange={(e: any) => handleChange("businessType", e.target.value)} 
            />
          </div>
        </div>

        <div className="col-span-2 md:col-span-1">
          <Label>Business Logo</Label>
          <div className="w-full h-32 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-muted/10 group hover:bg-muted/20 transition-all cursor-pointer">
            <Upload className="text-muted-foreground group-hover:text-primary transition-colors mb-2" size={24} />
            <p className="text-xs text-muted-foreground font-medium">Click to upload SVG or PNG</p>
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-3 gap-6">
          <div>
            <Label>Primary Currency</Label>
            <Select 
              options={["USD ($)", "EUR (€)", "GBP (£)", "JPY (¥)"]} 
              value={settings.currency} 
              onChange={(e: any) => handleChange("currency", e.target.value)} 
            />
          </div>
          <div>
            <Label>Timezone</Label>
            <Select 
              options={["UTC-5 (EST)", "UTC+0 (GMT)", "UTC+1 (CET)", "UTC+8 (SGT)"]} 
              value={settings.timezone} 
              onChange={(e: any) => handleChange("timezone", e.target.value)} 
            />
          </div>
          <div>
            <Label>Language</Label>
            <Select options={["English", "Spanish", "French", "German"]} value="English" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings({ settings, handleChange }: any) {
  const themes = [
    { name: "Claude Classic", color: "#F5F2ED" },
    { name: "Claude Charcoal", color: "#1D1D1D" },
    { name: "Serene Clay", color: "#E8E2D9" },
    { name: "Deep Amethyst", color: "#2e1065" },
    { name: "Slate Grey", color: "#334155" },
  ];

  return (
    <div className="space-y-8">
      <SectionTitle title="Appearance" subtitle="Customize the visual feel of your dashboard." />
      
      <div>
        <Label>System Theme</Label>
        <div className="grid grid-cols-5 gap-3">
          {themes.map((t) => (
            <button
              key={t.name}
              onClick={() => handleChange("theme", t.name)}
              className={`h-16 rounded-xl border-2 transition-all relative group overflow-hidden ${
                settings.theme === t.name ? "border-primary scale-105" : "border-transparent"
              }`}
              style={{ backgroundColor: t.color }}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {settings.theme === t.name && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground p-1 rounded-full">
                    <Check size={12} />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-[10px] mt-2 text-center text-muted-foreground font-bold uppercase">{settings.theme}</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <Label>Accent Color</Label>
          <div className="flex gap-3">
            {["#8b5cf6", "#ec4899", "#10b981", "#3b82f6", "#f59e0b"].map(c => (
              <button
                key={c}
                onClick={() => handleChange("accentColor", c)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  settings.accentColor === c ? "border-white scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <Label>Font Size</Label>
          <div className="flex bg-muted/50 p-1 rounded-xl">
            {["Compact", "Normal", "Comfortable"].map(s => (
              <button
                key={s}
                onClick={() => handleChange("fontSize", s)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  settings.fontSize === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Layout Options</Label>
          <div className="space-y-3">
            {[
              { id: "sidebarStyle", label: "Sidebar", options: ["Minimal icons", "Full labels", "Floating"] },
              { id: "cardStyle", label: "Dashboard Cards", options: ["Glassmorphic", "Solid", "Bordered"] },
              { id: "animationIntensity", label: "Animations", options: ["None", "Subtle", "Full"] },
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                <div className="w-1/2">
                  <Select 
                    options={item.options} 
                    value={(settings as any)[item.id]} 
                    onChange={(e: any) => handleChange(item.id, e.target.value)} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-2xl cursor-pointer hover:bg-muted/30 transition-all">
            <span className="text-sm font-bold">Compact Mode</span>
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-border bg-muted checked:bg-primary transition-all"
              checked={settings.compactMode}
              onChange={(e) => handleChange("compactMode", e.target.checked)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings({ settings, handleChange }: any) {
  return (
    <div className="space-y-6">
      <SectionTitle title="Notifications" subtitle="Configure email and system alerts." />
      
      <div className="space-y-4">
        {[
          { id: "emailLowStock", label: "Low Stock Alerts", desc: "Notify when items fall below reorder point." },
          { id: "emailLargeOrders", label: "Large Order Alerts", desc: "Notify for orders over $1,000." },
          { id: "dailySummary", label: "Daily Business Summary", desc: "Morning briefing with key metrics." },
          { id: "weeklyReports", label: "Weekly Performance Reports", desc: "Detailed breakdown of week-over-week growth." },
        ].map(n => (
          <div key={n.id} className="flex items-center justify-between p-4 bg-muted/10 border border-border rounded-2xl">
            <div>
              <p className="text-sm font-bold">{n.label}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{n.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={(settings as any)[n.id] ?? true} 
                onChange={(e) => handleChange(n.id, e.target.checked)}
              />
              <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegrationSettings({ settings, handleChange }: any) {
  return (
    <div className="space-y-8">
      <SectionTitle title="Integrations" subtitle="Connect external POS and e-commerce tools." />
      
      <div className="p-6 bg-muted/20 border border-border rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <ShieldAlert className="text-primary" size={20} />
            </div>
            <div>
              <Label>Management API Key</Label>
              <code className="text-xs bg-background/50 px-2 py-1 rounded border border-border">rk_live_94u83...hf93</code>
            </div>
          </div>
          <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            Reveal Key <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border border-border rounded-2xl">
          <Label>Webhook URL</Label>
          <div className="flex gap-2">
            <Input value="https://api.myapp.com/webhooks/retailos" />
            <button className="p-3 bg-muted rounded-xl hover:bg-muted/80 transition-all"><ExternalLink size={16} /></button>
          </div>
        </div>
        <div className="p-4 border border-border rounded-2xl flex flex-col justify-between">
          <div>
            <Label>External POS</Label>
            <p className="text-xs font-medium text-muted-foreground">Sync with Square, Shopify, or Lightspeed.</p>
          </div>
          <button className="text-xs font-black uppercase text-primary tracking-widest mt-4">Browse integrations</button>
        </div>
      </div>
    </div>
  );
}

function AISettings({ settings, handleChange }: any) {
  return (
    <div className="space-y-8">
      <SectionTitle title="AI & Intelligence" subtitle="Fine-tune your Business Advisor's behavior." />
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label>AI Personality</Label>
            <Select 
              options={["Concise", "Detailed", "Friendly", "Strictly Professional"]} 
              value={settings.aiPersonality} 
              onChange={(e: any) => handleChange("aiPersonality", e.target.value)} 
            />
          </div>
          <div>
            <Label>Claude Model</Label>
            <Select 
              options={["Claude 3.5 Sonnet", "Claude 3 Haiku", "Grok-1 (External)"]} 
              value={settings.aiModel} 
              onChange={(e: any) => handleChange("aiModel", e.target.value)} 
            />
          </div>
        </div>

        <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-primary" size={20} />
            <h4 className="font-bold text-sm">Automated Intelligence</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-6">
            The AI Advisor will automatically scan your inventory and sales data at this frequency to generate dashboard highlights.
          </p>
          <Select options={["Hourly", "Daily", "On Every Sale"]} value="Daily" />
        </div>
      </div>
    </div>
  );
}

function DataSettings({ settings, handleChange, addToast }: any) {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedDatabase = async () => {
    if (!confirm("This will erase all current data and load demo data. Proceed?")) return;
    
    setIsSeeding(true);
    addToast("Generating realistic demo data...");
    
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const result = await res.json();
      
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Seed failed");
      }
      
      addToast("Demo data loaded successfully! Refreshing...");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      addToast(err.message || "Failed to load demo data.");
      console.error(err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      <SectionTitle title="Data & Backup" subtitle="Manage your database exports and safety." />
      
      <div className="grid grid-cols-2 gap-6">
        <button className="p-6 border border-border rounded-3xl flex items-center justify-between group hover:border-primary transition-all">
          <div className="text-left">
            <p className="text-sm font-bold mb-1">Backup All Data</p>
            <p className="text-[10px] text-muted-foreground uppercase font-black">Generate full JSON export</p>
          </div>
          <Download className="text-muted-foreground group-hover:text-primary transition-all" />
        </button>

        <button className="p-6 border border-border rounded-3xl flex items-center justify-between group hover:border-primary transition-all">
          <div className="text-left">
            <p className="text-sm font-bold mb-1">Restore from File</p>
            <p className="text-[10px] text-muted-foreground uppercase font-black">Sync CSV or JSON backup</p>
          </div>
          <Upload className="text-muted-foreground group-hover:text-primary transition-all" />
        </button>
      </div>

      <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-3xl">
        <div className="flex items-center gap-3 mb-4 text-red-500">
          <Trash2 size={24} />
          <h4 className="font-black text-lg">Danger Zone</h4>
        </div>
        <p className="text-sm text-red-500/70 mb-6">Resetting your data will clear all products, orders, and customer history. This action cannot be undone.</p>
        <div className="flex gap-4">
          <button 
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSeeding ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Clock size={16} />
                </motion.div>
                Seeding...
              </>
            ) : "Load Realistic Demo Data"}
          </button>
          <button className="px-6 py-3 border border-red-500 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
