"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { TopProduct } from "./types";

interface Props {
  data: TopProduct[];
}

export default function TopProductsTable({ data }: Props) {
  const maxRevenue = Math.max(...data.map((p) => p.revenue));

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-bold text-sm">Top Products</h3>
        <p className="text-xs text-muted-foreground mt-0.5">By revenue this period</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground w-8">#</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Product</th>
              <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Revenue</th>
              <th className="px-4 py-3 text-center font-semibold text-muted-foreground hidden md:table-cell">Units</th>
              <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Growth</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground w-32 hidden lg:table-cell">Revenue Bar</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p, i) => (
              <motion.tr
                key={p.sku}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-border last:border-0 hover:bg-muted/25 transition-colors"
              >
                <td className="px-4 py-3 text-muted-foreground font-bold">{p.rank}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-xs truncate max-w-[200px]">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.sku}</p>
                </td>
                <td className="px-4 py-3 text-right font-bold">${p.revenue.toLocaleString()}</td>
                <td className="px-4 py-3 text-center text-muted-foreground hidden md:table-cell">{p.unitsSold}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${p.growth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {p.growth >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {Math.abs(p.growth)}%
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(p.revenue / maxRevenue) * 100}%` }}
                      transition={{ delay: i * 0.06, duration: 0.7, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, #6366f1, ${p.growth >= 0 ? "#10b981" : "#ef4444"})`,
                      }}
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
