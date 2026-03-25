"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Calendar, Filter, Download, Mail, 
  Clock, Sparkles, ChevronRight, BarChart3, 
  TrendingUp, Package, Users, Plus, 
  History, Settings, Play, Send, Check
} from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

// ── Types ───────────────────────────────────────────────────────────────

type ReportTemplate = 
  | "Daily Summary" 
  | "Weekly Performance" 
  | "Monthly P&L" 
  | "Inventory Status" 
  | "Customer Analysis" 
  | "Custom";

interface Report {
  id: string;
  name: string;
  date: string;
  template: string;
  status: "ready" | "generating" | "failed";
}

// ── Main Component ──────────────────────────────────────────────────────

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [aiNarrative, setAiNarrative] = useState<string | null>(null);
  
  // Custom Report State
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [metrics, setMetrics] = useState<string[]>(["Revenue", "Gross Profit"]);

  const templates: { id: ReportTemplate; icon: any; desc: string; color: string }[] = [
    { id: "Daily Summary", icon: FileText, desc: "Quick snapshot of today's key metrics.", color: "bg-claude-purple" },
    { id: "Weekly Performance", icon: BarChart3, desc: "Detailed breakdown of week-over-week growth.", color: "bg-claude-purple/80" },
    { id: "Monthly P&L", icon: TrendingUp, desc: "Full Profit & Loss statement for the month.", color: "bg-claude-purple/60" },
    { id: "Inventory Status", icon: Package, desc: "Stock levels, turn rates, and reorder alerts.", color: "bg-claude-orange" },
    { id: "Customer Analysis", icon: Users, desc: "Acquisition, retention, and segment data.", color: "bg-claude-purple/40" },
    { id: "Custom", icon: Plus, desc: "Build a report with specific metrics and dates.", color: "bg-claude-charcoal" },
  ];

  const reportHistory: Report[] = [
    { id: "1", name: "Monthly P&L - Feb 2026", date: "Mar 01, 2026", template: "Monthly P&L", status: "ready" },
    { id: "2", name: "Weekly Sales Performance", date: "Mar 10, 2026", template: "Weekly Performance", status: "ready" },
    { id: "3", name: "Inventory Audit Report", date: "Mar 15, 2026", template: "Inventory Status", status: "ready" },
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setAiNarrative(null);
    
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      setAiNarrative(
        "Based on your latest data, your profit margins have increased by 4.2% this month, primarily driven by strong electronics sales. However, customer acquisition costs have spiked by 12% in the last week. Recommendation: Audit your current Facebook ad campaigns and focus on high-LTV customer segments identified in this report."
      );
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Report Intelligence</h1>
          <p className="text-muted-foreground mt-1 text-sm">Design, schedule, and automate your business analysis.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowSchedule(!showSchedule)}
            className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl text-sm font-bold hover:bg-muted transition-all"
          >
            <Clock size={16} />
            Schedules
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">
            <Plus size={16} />
            New Custom Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left Column: Templates & Config ────────────────────────── */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xl shadow-black/10">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">Templates</h3>
            <div className="grid grid-cols-1 gap-3">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all border-2 ${
                    selectedTemplate === t.id 
                      ? "bg-primary/5 border-primary shadow-lg shadow-primary/5" 
                      : "bg-muted/30 border-transparent hover:bg-muted/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center text-white`}>
                    <t.icon size={20} />
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className={`font-bold transition-all ${selectedTemplate === t.id ? "text-primary text-base" : "text-sm"}`}>
                      {t.id}
                    </p>
                    {selectedTemplate === t.id && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-[10px] text-muted-foreground font-medium mt-1 leading-tight"
                      >
                        {t.desc}
                      </motion.p>
                    )}
                  </div>
                  {selectedTemplate === t.id && <ChevronRight className="ml-auto text-primary" size={16} />}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedTemplate === "Custom" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-card border border-border rounded-3xl p-6 shadow-xl shadow-black/10 space-y-6"
              >
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-muted-foreground block mb-2">Date Range</label>
                    <select 
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer appearance-none"
                    >
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>This Quarter</option>
                      <option>Custom Range</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-muted-foreground block mb-2">Select Metrics</label>
                    <div className="grid grid-cols-1 gap-2">
                      {["Revenue", "Gross Profit", "Net Profit", "Inventory Turn", "AOV"].map(m => (
                        <label key={m} className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded-xl cursor-pointer hover:bg-muted/40 transition-all capitalize text-xs">
                          {m}
                          <input 
                            type="checkbox" 
                            checked={metrics.includes(m)}
                            onChange={() => setMetrics(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}
                            className="w-4 h-4 rounded border-border bg-muted checked:bg-primary"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right Column: Preview & Intelligence ─────────────────────── */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Preview */}
          <div className="bg-card border border-border rounded-[2.5rem] p-8 min-h-[500px] flex flex-col relative overflow-hidden shadow-2xl shadow-black/20">
            {/* Background Texture */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/5 to-transparent border-b border-border/50" />
            
            {!selectedTemplate ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 relative z-10">
                <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                  <FileText className="text-muted-foreground" size={40} />
                </div>
                <h2 className="text-2xl font-black mb-2">Select a Template</h2>
                <p className="text-muted-foreground max-w-sm">Choose a report template from the left to begin generating your high-fidelity business analysis.</p>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase rounded-full tracking-wider">PREVIEW</div>
                      <h2 className="text-2xl font-black text-foreground">{selectedTemplate}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Data for {dateRange} • Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-muted rounded-2xl hover:bg-muted/80 transition-all tooltip" title="Export to PDF">
                      <Download size={20} />
                    </button>
                    <button className="p-3 bg-muted rounded-2xl hover:bg-muted/80 transition-all tooltip" title="Email Report">
                      <Mail size={20} />
                    </button>
                    <button 
                      onClick={handleGenerateReport}
                      disabled={isGenerating}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-black flex items-center gap-3 active:scale-95 transition-all shadow-xl shadow-primary/20"
                    >
                      {isGenerating ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <Settings size={18} />
                          </motion.div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Play size={18} fill="currentColor" />
                          Generate Report
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Mock Report Content */}
                <div className="flex-1 space-y-8">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="p-6 bg-muted/20 border border-border rounded-3xl">
                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Generated Insight</p>
                      <p className="text-2xl font-black">
                        <AnimatedCounter end={42500} prefix="$" />
                      </p>
                      <p className="text-xs text-green-500 font-bold mt-1">+12.4% vs prev</p>
                    </div>
                    <div className="p-6 bg-muted/20 border border-border rounded-3xl">
                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Avg Transaction</p>
                      <p className="text-2xl font-black">
                        <AnimatedCounter end={128.50} prefix="$" decimals={2} />
                      </p>
                      <p className="text-xs text-red-500 font-bold mt-1">-2.1% vs prev</p>
                    </div>
                    <div className="p-6 bg-muted/20 border border-border rounded-3xl">
                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">New Customers</p>
                      <p className="text-2xl font-black">
                        <AnimatedCounter end={214} />
                      </p>
                      <p className="text-xs text-green-500 font-bold mt-1">+8% vs prev</p>
                    </div>
                  </div>

                  <div className="flex-1 bg-muted/10 border border-border border-dashed rounded-[2rem] p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-bold">Key Data Breakdown</h4>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase"><div className="w-2 h-2 rounded-full bg-primary" /> Revenue</div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase"><div className="w-2 h-2 rounded-full bg-green-500" /> Profit</div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center text-muted-foreground/30">
                       {/* Abstract Visual Representation */}
                       <div className="w-full max-w-md space-y-4">
                         {[60, 80, 45, 90, 70].map((w, i) => (
                           <div key={i} className="h-6 bg-muted/50 rounded-full overflow-hidden relative">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${w}%` }}
                               transition={{ delay: i * 0.1, duration: 1 }}
                               className="absolute inset-y-0 left-0 bg-primary/20"
                             />
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>

                {/* AI Intelligence Panel */}
                <AnimatePresence>
                  {aiNarrative && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="mt-8 p-8 bg-gradient-to-br from-primary/10 via-background to-background border-2 border-primary/20 rounded-[2rem] shadow-2xl relative group"
                    >
                      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity">
                        <Sparkles className="text-primary" size={32} />
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                          <Sparkles size={16} />
                        </div>
                        <h4 className="font-black text-sm uppercase tracking-wider">AI Executive Narrative</h4>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/80 font-medium italic">
                        "{aiNarrative}"
                      </p>
                      <div className="mt-6 pt-6 border-t border-primary/10 flex justify-between items-center text-[10px] font-black uppercase text-muted-foreground">
                         <span>Analysis quality: High</span>
                         <span className="flex items-center gap-2 text-primary group-hover:underline cursor-pointer">Deep dive into data <ChevronRight size={10} /></span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Report History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl shadow-black/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <History className="text-primary" size={20} />
                  <h3 className="font-black text-sm uppercase">Recent History</h3>
                </div>
                <button className="text-xs font-bold text-muted-foreground hover:text-primary transition-all underline decoration-primary/20 underline-offset-4">View All</button>
              </div>
              <div className="space-y-3">
                {reportHistory.map(report => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded-xl group hover:bg-muted/40 transition-all">
                    <div>
                      <p className="text-xs font-bold">{report.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">{report.date} • {report.template}</p>
                    </div>
                    <button className="p-2 opacity-0 group-hover:opacity-100 bg-primary text-primary-foreground rounded-lg transition-all shadow-lg shadow-primary/20">
                      <Download size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border border-dashed rounded-3xl p-6 shadow-xl shadow-black/10 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                <Clock size={24} />
              </div>
              <h3 className="font-black text-sm uppercase mb-2">Automated Flows</h3>
              <p className="text-[11px] text-muted-foreground px-6 leading-relaxed mb-6">Configure reports to arrive in your inbox daily, weekly, or monthly.</p>
              <button 
                onClick={() => setShowSchedule(true)}
                className="px-6 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Set Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scheduling Modal Overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {showSchedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSchedule(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-card border border-border rounded-[2.5rem] p-10 relative z-10 shadow-2xl"
            >
              <h2 className="text-2xl font-black mb-2 px-2">Schedule Intelligence</h2>
              <p className="text-muted-foreground text-sm mb-8 px-2">Deliver automated business analysis to your team.</p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-muted-foreground block mb-2 px-1">Report Template</label>
                    <select className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none">
                      <option>Weekly Performance</option>
                      <option>Inventory Status</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-muted-foreground block mb-2 px-1">Frequency</label>
                    <select className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none">
                      <option>Daily</option>
                      <option>Every Monday</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                </div>

                <div>
                   <label className="text-[10px] font-black uppercase text-muted-foreground block mb-2 px-1">Destination Email</label>
                   <div className="flex bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                      <Mail className="text-muted-foreground mr-3" size={18} />
                      <input 
                        type="email" 
                        placeholder="admin@yourbusiness.com" 
                        className="bg-transparent border-none focus:outline-none w-full font-medium"
                      />
                   </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={() => setShowSchedule(false)}
                    className="flex-1 py-4 bg-muted border border-border rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-muted/80 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      alert("Schedule saved!");
                      setShowSchedule(false);
                    }}
                    className="flex-1 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-3"
                  >
                    <Send size={16} />
                    Save & Activate
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
