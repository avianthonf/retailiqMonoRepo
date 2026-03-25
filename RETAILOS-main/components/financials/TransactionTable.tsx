"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, ChevronUp, ChevronDown } from "lucide-react";
import { Transaction } from "./types";

interface TransactionTableProps {
  transactions: Transaction[];
}

type SortKey = "date" | "amount" | "balance";

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 8;

  const sorted = [...transactions].sort((a, b) => {
    let diff = 0;
    if (sortKey === "date") diff = a.date.localeCompare(b.date);
    if (sortKey === "amount") diff = a.amount - b.amount;
    if (sortKey === "balance") diff = a.balance - b.balance;
    return sortAsc ? diff : -diff;
  });

  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setAsc((prev) => !prev);
    else { setSortKey(key); setSortAsc(false); }
    setPage(0);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setAsc = setSortAsc;

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col
      ? sortAsc ? <ChevronUp size={13} className="text-primary" /> : <ChevronDown size={13} className="text-primary" />
      : <ChevronDown size={13} className="opacity-30" />;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-bold text-sm">Transaction Ledger</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{transactions.length} transactions</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th
                className="px-4 py-3 text-left font-semibold text-muted-foreground cursor-pointer hover:text-foreground select-none"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-1">Date <SortIcon col="date" /></div>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Description</th>
              <th
                className="px-4 py-3 text-right font-semibold text-muted-foreground cursor-pointer hover:text-foreground select-none"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end gap-1">Amount <SortIcon col="amount" /></div>
              </th>
              <th
                className="px-4 py-3 text-right font-semibold text-muted-foreground cursor-pointer hover:text-foreground select-none"
                onClick={() => handleSort("balance")}
              >
                <div className="flex items-center justify-end gap-1">Balance <SortIcon col="balance" /></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {paged.map((txn, i) => (
                <motion.tr
                  key={txn.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`border-b border-border last:border-0 hover:bg-muted/50 border-l-4 border-l-transparent hover:border-l-primary transition-all group ${i % 2 === 0 ? "" : "bg-muted/5"}`}
                >
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(txn.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      txn.type === "income"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/15 text-red-400"
                    }`}>
                      {txn.type === "income"
                        ? <ArrowUpRight size={11} />
                        : <ArrowDownRight size={11} />}
                      {txn.type === "income" ? "Income" : "Expense"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{txn.category}</td>
                  <td className="px-4 py-3 text-xs hidden md:table-cell max-w-48 truncate">{txn.description}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${txn.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                    {txn.type === "income" ? "+" : "-"}${txn.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-sm">
                    ${txn.balance.toLocaleString()}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-border text-xs text-muted-foreground">
          <span>Page {page + 1} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 rounded-lg bg-muted hover:bg-muted/70 disabled:opacity-40 transition-colors"
            >← Prev</button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1 rounded-lg bg-muted hover:bg-muted/70 disabled:opacity-40 transition-colors"
            >Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
