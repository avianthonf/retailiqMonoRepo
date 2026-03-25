"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, ShoppingCart } from "lucide-react";
import { Product } from "./types";

interface StockAlertsProps {
  alerts: Product[];
  onMarkAsOrdered: (id: string) => void;
}

export default function StockAlerts({ alerts, onMarkAsOrdered }: StockAlertsProps) {
  return (
    <div className="w-80 shrink-0 flex flex-col bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center gap-3">
        <AlertTriangle size={18} className="text-yellow-400 shrink-0" />
        <h2 className="font-bold text-sm flex-1">Stock Alerts</h2>
        <AnimatePresence mode="wait">
          {alerts.length > 0 ? (
            <motion.span
              key="count"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[22px] text-center"
            >
              {alerts.length}
            </motion.span>
          ) : (
            <motion.span
              key="clear"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full px-2 py-0.5"
            >
              All Clear
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Alert List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground"
            >
              <motion.div
                initial={{ rotate: -15 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 size={48} className="text-emerald-500" />
              </motion.div>
              <p className="text-sm font-semibold">All stocked up!</p>
              <p className="text-xs text-center">No products need reordering right now.</p>
            </motion.div>
          ) : (
            alerts.map((p) => {
              const isCritical = p.status === "Critical";
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`rounded-xl border p-3 flex flex-col gap-2.5 ${
                    isCritical
                      ? "bg-red-500/10 border-red-500/30"
                      : "bg-yellow-500/10 border-yellow-500/30"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/36x36/1a1a2e/ffffff?text=?"; }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold leading-snug line-clamp-2">{p.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.sku}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold ${isCritical ? "text-red-400" : "text-yellow-400"}`}>
                      {p.stock === 0 ? "OUT OF STOCK" : `${p.stock} left`}
                    </span>
                    <span className="text-muted-foreground">Reorder @ {p.reorderPoint}</span>
                  </div>

                  {/* Reorder suggestion */}
                  <div className="bg-background/50 rounded-lg px-3 py-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Suggestion: </span>
                    Order {Math.max(p.reorderPoint * 2 - p.stock, p.reorderPoint)} units
                    <span className="ml-1 text-muted-foreground">
                      (≈ ${((Math.max(p.reorderPoint * 2 - p.stock, p.reorderPoint)) * p.cost).toFixed(0)})
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onMarkAsOrdered(p.id)}
                    className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    <ShoppingCart size={12} />
                    Mark as Ordered
                  </motion.button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
