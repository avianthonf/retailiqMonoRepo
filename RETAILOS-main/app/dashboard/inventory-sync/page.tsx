"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw, Package, AlertTriangle, CheckCircle2,
  Clock, ArrowUpRight, Truck, ToggleLeft, ToggleRight, XCircle,
} from "lucide-react";
import { MOCK_PRODUCTS } from "@/components/inventory/inventoryData";

const SUPPLIERS = [
  { id: "s1", name: "TechSupply Co.", items: 42, lastSync: "2 min ago", status: "synced", leadDays: 3 },
  { id: "s2", name: "Global Goods Inc.", items: 28, lastSync: "15 min ago", status: "synced", leadDays: 7 },
  { id: "s3", name: "QuickStock Ltd.", items: 17, lastSync: "1 hr ago", status: "delayed", leadDays: 2 },
  { id: "s4", name: "Precision Parts", items: 9, lastSync: "3 hrs ago", status: "error", leadDays: 14 },
  { id: "s5", name: "ValueMart Dist.", items: 31, lastSync: "5 min ago", status: "synced", leadDays: 5 },
];

const SYNC_LOG = [
  { id: 1, time: "02:03 AM", type: "success", message: "Full inventory sync completed — 127 SKUs updated" },
  { id: 2, time: "01:00 AM", type: "success", message: "Scheduled sync: 43 price updates from TechSupply Co." },
  { id: 3, time: "12:15 AM", type: "warning", message: "QuickStock Ltd. delayed — retrying in 30 min" },
  { id: 4, time: "11:30 PM", type: "error", message: "Precision Parts API timeout — manual review needed" },
  { id: 5, time: "11:00 PM", type: "success", message: "Reorder placed: Wireless Earbuds Pro × 50 units" },
  { id: 6, time: "10:30 PM", type: "success", message: "Stock update received from ValueMart Dist." },
];

export default function InventorySyncPage() {
  const [autoReorder, setAutoReorder] = useState<Record<string, boolean>>({});

  const lowStockItems = useMemo(() =>
    MOCK_PRODUCTS.filter((p) => (p.status === "Critical" || p.status === "Low")).slice(0, 8),
    []
  );

  const syncedCount = MOCK_PRODUCTS.length;
  const pendingReorders = lowStockItems.filter((p) => !autoReorder[p.id]).length;
  const syncErrors = SUPPLIERS.filter((s) => s.status === "error").length;

  const statusColor = (s: string) => {
    if (s === "synced") return "text-emerald-400 bg-emerald-400/10";
    if (s === "delayed") return "text-yellow-400 bg-yellow-400/10";
    return "text-red-400 bg-red-400/10";
  };

  const logIcon = (type: string) => {
    if (type === "success") return <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />;
    if (type === "warning") return <AlertTriangle size={14} className="text-yellow-400 shrink-0" />;
    return <XCircle size={14} className="text-red-400 shrink-0" />;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-cyan-500/15"><RefreshCw size={20} className="text-cyan-500" /></div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Inventory Sync</h1>
          </div>
          <p className="text-sm text-muted-foreground">Real-time stock synchronization across all suppliers and warehouses.</p>
        </div>
        <button className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
          <RefreshCw size={14} /> Sync Now
        </button>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Synced SKUs", value: syncedCount, icon: Package, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Pending Reorders", value: pendingReorders, icon: ArrowUpRight, color: "text-orange-400", bg: "bg-orange-400/10" },
          { label: "Sync Errors", value: syncErrors, icon: XCircle, color: syncErrors > 0 ? "text-red-400" : "text-emerald-400", bg: syncErrors > 0 ? "bg-red-400/10" : "bg-emerald-400/10" },
          { label: "Last Full Sync", value: "2 min", icon: Clock, color: "text-cyan-400", bg: "bg-cyan-400/10", suffix: " ago" },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-card border border-border rounded-xl px-4 sm:px-5 py-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${kpi.bg}`}><kpi.icon size={14} className={kpi.color} /></div>
              <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
            </div>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}{kpi.suffix || ""}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Supplier Panel */}
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 p-5 border-b border-border">
            <Truck size={16} className="text-primary" />
            <h2 className="font-bold text-sm">Supplier Status</h2>
          </div>
          <div className="divide-y divide-border">
            {SUPPLIERS.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.items} items · {s.leadDays}d lead time</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-xs text-muted-foreground hidden sm:block">{s.lastSync}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full capitalize ${statusColor(s.status)}`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sync Log */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 p-5 border-b border-border">
            <Clock size={16} className="text-primary" />
            <h2 className="font-bold text-sm">Sync Log</h2>
          </div>
          <div className="divide-y divide-border">
            {SYNC_LOG.map((log) => (
              <div key={log.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                {logIcon(log.type)}
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-snug">{log.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reorder Queue */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-border">
          <AlertTriangle size={16} className="text-orange-400" />
          <h2 className="font-bold text-sm">Reorder Queue</h2>
          <span className="ml-auto text-xs text-muted-foreground">{lowStockItems.length} items need attention</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground hidden sm:table-cell">SKU</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Stock</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Auto-Reorder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lowStockItems.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3 font-medium text-sm">{p.name}</td>
                  <td className="px-4 py-3 text-center text-xs text-muted-foreground hidden sm:table-cell">{p.sku}</td>
                  <td className="px-4 py-3 text-center font-bold">{p.stock}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      p.status === "Critical" ? "bg-red-400/10 text-red-400" : "bg-yellow-400/10 text-yellow-400"
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setAutoReorder(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                      className="transition-colors">
                      {autoReorder[p.id]
                        ? <ToggleRight size={22} className="text-primary" />
                        : <ToggleLeft size={22} className="text-muted-foreground" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
