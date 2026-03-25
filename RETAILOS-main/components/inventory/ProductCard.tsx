"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Check, X } from "lucide-react";
import { Product, StockStatus } from "./types";

const STATUS_CONFIG: Record<StockStatus, { label: string; pill: string; bar: string }> = {
  Critical:    { label: "Critical",    pill: "bg-red-500/20 text-red-400 border border-red-500/40",          bar: "bg-red-500" },
  Low:         { label: "Low",         pill: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",  bar: "bg-yellow-400" },
  Good:        { label: "Good",        pill: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40", bar: "bg-emerald-500" },
  Overstocked: { label: "Overstocked", pill: "bg-blue-500/20 text-blue-400 border border-blue-500/40",       bar: "bg-blue-500" },
};

interface ProductCardProps {
  product: Product;
  onStockUpdate: (id: string, newStock: number) => void;
}

export default function ProductCard({ product, onStockUpdate }: ProductCardProps) {
  const [editing, setEditing] = useState(false);
  const [draftStock, setDraftStock] = useState(String(product.stock));

  const cfg = STATUS_CONFIG[product.status];
  const barPct = Math.min(100, Math.round((product.stock / Math.max(product.reorderPoint * 3, 1)) * 100));

  const commitEdit = () => {
    const n = parseInt(draftStock, 10);
    if (!isNaN(n) && n >= 0) onStockUpdate(product.id, n);
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraftStock(String(product.stock));
    setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
      className="bg-card rounded-2xl overflow-hidden border border-border flex flex-col transition-shadow"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x160/1a1a2e/ffffff?text=No+Image"; }}
        />
        <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.pill}`}>
          {cfg.label}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2">{product.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{product.sku}</p>
        </div>

        {/* Stock Bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Stock</span>
            {editing ? (
              <div className="flex items-center gap-1">
                <input
                  autoFocus
                  type="number"
                  min={0}
                  value={draftStock}
                  onChange={(e) => setDraftStock(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") cancelEdit(); }}
                  className="w-16 text-xs text-right bg-input border border-primary rounded px-1 py-0.5 focus:outline-none"
                />
                <button onClick={commitEdit} className="text-emerald-400 hover:text-emerald-300"><Check size={13} /></button>
                <button onClick={cancelEdit} className="text-red-400 hover:text-red-300"><X size={13} /></button>
              </div>
            ) : (
              <button
                onClick={() => { setEditing(true); setDraftStock(String(product.stock)); }}
                className="flex items-center gap-1 text-xs font-semibold hover:text-primary transition-colors group"
              >
                <span>{product.stock}</span>
                <Edit3 size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${cfg.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${barPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Reorder at {product.reorderPoint} units</p>
        </div>

        {/* Financials */}
        <div className="grid grid-cols-3 gap-2 mt-auto pt-2 border-t border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-sm font-semibold">${product.price.toFixed(2)}</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-xs text-muted-foreground">Cost</p>
            <p className="text-sm font-semibold">${product.cost.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Margin</p>
            <p className={`text-sm font-semibold ${product.margin > 50 ? "text-emerald-400" : product.margin > 30 ? "text-yellow-400" : "text-red-400"}`}>
              {product.margin}%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
