"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Edit3, Check, X, PackageSearch, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { Product, StockStatus, SortOption } from "./types";
import EmptyState from "@/components/ui/EmptyState";


const STATUS_PILL: Record<StockStatus, string> = {
  Critical:    "bg-red-500/20 text-red-400 border border-red-500/40",
  Low:         "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
  Good:        "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40",
  Overstocked: "bg-blue-500/20 text-blue-400 border border-blue-500/40",
};

interface ProductTableProps {
  products: Product[];
  onStockUpdate: (id: string, newStock: number) => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
}

interface InlineEditProps {
  value: number;
  onSave: (v: number) => void;
}

function StockProgress({ stock, reorderPoint }: { stock: number, reorderPoint: number }) {
  const percentage = Math.min(100, (stock / (reorderPoint * 2)) * 100);
  const color = stock === 0 ? "bg-red-500" : stock < reorderPoint ? "bg-yellow-500" : "bg-emerald-500";
  
  return (
    <div className="w-24 space-y-1">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
        <span>{stock}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${color} transition-all duration-1000`}
        />
      </div>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[2px] h-6 w-16" title="7-day velocity">
      {data.map((val, i) => (
        <div key={i} className="flex-1 bg-primary/40 hover:bg-primary rounded-t-sm transition-colors duration-200" style={{ height: `${Math.max(10, (val / max) * 100)}%` }} />
      ))}
    </div>
  );
}

function InlineStockEdit({ value, onSave }: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  const commit = () => {
    const n = parseInt(draft, 10);
    if (!isNaN(n) && n >= 0) onSave(n);
    setEditing(false);
  };
  const cancel = () => { setDraft(String(value)); setEditing(false); };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          autoFocus
          type="number"
          min={0}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); }}
          className="w-16 text-sm text-right bg-background border border-primary/50 shadow-sm rounded-md px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button onClick={commit} className="text-emerald-400 hover:text-emerald-300 p-1 rounded-md hover:bg-emerald-500/10"><Check size={14} /></button>
        <button onClick={cancel} className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-500/10"><X size={14} /></button>
      </div>
    );
  }

  return (
    <button
      onClick={() => { setEditing(true); setDraft(String(value)); }}
      className="flex items-center gap-1 font-semibold hover:text-primary transition-colors group px-2 py-1 rounded-md hover:bg-muted"
    >
      <span className="tabular-nums">{value}</span>
      <Edit3 size={11} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110" />
    </button>
  );
}

type ColKey = "stock" | "value" | "margin";

const COL_MAP: Record<ColKey, SortOption[]> = {
  stock:  ["stock-asc", "stock-desc"],
  value:  ["value-desc", "stock-asc"],
  margin: ["margin-desc", "stock-asc"],
};

export default function ProductTable({ products, onStockUpdate, sortBy, onSortChange }: ProductTableProps) {
  const handleColSort = (col: ColKey) => {
    const [primary, secondary] = COL_MAP[col];
    onSortChange(sortBy === primary ? secondary : primary);
  };

  const SortIcon = ({ col }: { col: ColKey }) => {
    const active = COL_MAP[col].includes(sortBy);
    if (!active) return <ChevronDown size={13} className="opacity-30" />;
    return sortBy === COL_MAP[col][0]
      ? <ChevronDown size={13} className="text-primary" />
      : <ChevronUp size={13} className="text-primary" />;
  };

  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No products found"
        description="Try adjusting your search or filters to find what you're looking for."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-md shadow-2xl shadow-primary/5">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border/50 bg-muted/30 backdrop-blur-sm">
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground w-12"></th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Product</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Category</th>
            <th className="px-4 py-3 text-left font-semibold text-muted-foreground w-20">Velocity</th>
            <th
              className="px-6 py-4 text-right font-bold text-muted-foreground uppercase tracking-widest text-[10px] cursor-pointer hover:text-foreground select-none transition-colors"
              onClick={() => handleColSort("stock")}
            >
              <span className="flex items-center justify-end gap-2">Stock Level <SortIcon col="stock" /></span>
            </th>
            <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Reorder Pt</th>
            <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Price</th>
            <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Cost</th>
            <th
              className="px-4 py-3 text-right font-semibold text-muted-foreground cursor-pointer hover:text-foreground select-none"
              onClick={() => handleColSort("margin")}
            >
              <span className="flex items-center justify-end gap-1">Margin <SortIcon col="margin" /></span>
            </th>
            <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout">
            {products.map((p, idx) => (
              <motion.tr
                key={p.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`border-b border-border last:border-0 hover:bg-muted/50 border-l-4 border-l-transparent hover:border-l-primary transition-all group ${idx % 2 === 0 ? "" : "bg-muted/5"}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-border/50 shadow-sm"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/40x40/1a1a2e/ffffff?text=?"; }}
                    />
                    <div>
                      <p className="font-bold text-sm tracking-tight">{p.name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter opacity-70 p-0.5 bg-muted rounded inline-block mt-0.5">{p.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-lg bg-secondary/50 text-[11px] font-medium text-muted-foreground">{p.category}</span>
                </td>
                <td className="px-6 py-4">
                  <Sparkline data={p.name.length % 2 === 0 ? [10, 15, 8, 22, 14, 25, 18] : [5, 12, 15, 9, 8, 20, 26]} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-end gap-1">
                    <InlineStockEdit value={p.stock} onSave={(v) => onStockUpdate(p.id, v)} />
                    <StockProgress stock={p.stock} reorderPoint={p.reorderPoint} />
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-muted-foreground">{p.reorderPoint}</td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-foreground">${p.price.toFixed(2)}</span>
                </td>
                <td className="px-6 py-4 text-right text-muted-foreground font-medium opacity-60">${p.cost.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter shadow-sm ${
                    p.margin > 50 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : 
                    p.margin > 30 ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : 
                    "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}>
                    {p.margin > 50 ? <TrendingUp size={12} /> : p.margin > 30 ? <Activity size={12} /> : <TrendingDown size={12} />}
                    {p.margin}%
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-inner ${STATUS_PILL[p.status]}`}>{p.status}</span>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
