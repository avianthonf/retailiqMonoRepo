"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Download, FileText, Calendar } from "lucide-react";

import PLSummary from "@/components/financials/PLSummary";
import RevenueExpenseChart from "@/components/financials/RevenueExpenseChart";
import ProfitMarginChart from "@/components/financials/ProfitMarginChart";
import WaterfallChart from "@/components/financials/WaterfallChart";
import ExpenseDonut from "@/components/financials/ExpenseDonut";
import TransactionTable from "@/components/financials/TransactionTable";
import LogTransactionModal from "@/components/financials/LogTransactionModal";

import {
  MONTHLY_DATA,
  EXPENSE_CATEGORIES,
  WATERFALL_DATA,
  TRANSACTIONS,
} from "@/components/financials/financialData";
import { DateRange, PLMetric, Transaction } from "@/components/financials/types";

// ── Date-range helpers ─────────────────────────────────────────────────────────
const RANGE_LABELS: Record<DateRange, string> = {
  "1m": "1 Month",
  "3m": "3 Months",
  "6m": "6 Months",
  "12m": "12 Months",
  ytd:  "Year to Date",
};

const RANGE_MONTHS: Record<DateRange, number> = {
  "1m": 1, "3m": 3, "6m": 6, "12m": 12, ytd: new Date().getMonth() + 1,
};

// ── CSV export helper ──────────────────────────────────────────────────────────
function exportCSV(rows: Transaction[]) {
  const header = ["Date", "Type", "Category", "Description", "Amount", "Balance"];
  const body = rows.map((r) =>
    [r.date, r.type, r.category, `"${r.description}"`, r.amount, r.balance].join(",")
  );
  const csv = [header.join(","), ...body].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "transactions.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ── PDF export helper (print) ─────────────────────────────────────────────────
function exportPDF() {
  window.print();
}

export default function FinancialsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("12m");
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);

  // Slice monthly data to the selected range
  const months = RANGE_MONTHS[dateRange];
  const filteredMonthly = useMemo(
    () => MONTHLY_DATA.slice(-Math.min(months, MONTHLY_DATA.length)),
    [months]
  );

  // Aggregate P&L metrics over filtered range
  const plMetrics = useMemo((): PLMetric[] => {
    const cur = filteredMonthly;
    const prevCount = cur.length;
    const prev = MONTHLY_DATA.slice(
      Math.max(0, MONTHLY_DATA.length - prevCount * 2),
      Math.max(0, MONTHLY_DATA.length - prevCount)
    );
    const sum = (arr: typeof MONTHLY_DATA, key: keyof (typeof MONTHLY_DATA)[0]) =>
      arr.reduce((s, m) => s + (m[key] as number), 0);

    const revenue    = sum(cur,  "revenue");
    const pRevenue   = sum(prev, "revenue");
    const expenses   = sum(cur,  "expenses");
    const pExpenses  = sum(prev, "expenses");
    const grossProfit = revenue - expenses * 0.28; // rough COGS
    const pGross     = pRevenue - pExpenses * 0.28;
    const netProfit  = sum(cur,  "profit");
    const pNet       = sum(prev, "profit");
    const cogs       = expenses * 0.28;
    const pCogs      = pExpenses * 0.28;

    return [
      { label: "Revenue",      value: revenue,    prev: pRevenue,   prefix: "$" },
      { label: "COGS",         value: cogs,       prev: pCogs,      prefix: "$", isExpense: true },
      { label: "Gross Profit", value: grossProfit, prev: pGross,    prefix: "$" },
      { label: "Expenses",     value: expenses - cogs, prev: pExpenses - pCogs, prefix: "$", isExpense: true },
      { label: "Net Profit",   value: netProfit,  prev: pNet,       prefix: "$" },
    ];
  }, [filteredMonthly]);

  const currentBalance = transactions[0]?.balance ?? 0;

  const handleAddTransaction = useCallback((txn: Transaction) => {
    setTransactions((prev) => [txn, ...prev]);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
      {/* ── Page header ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-primary/15">
              <FileText size={20} className="text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Financials</h1>
          </div>
          <p className="text-sm text-muted-foreground">P&amp;L overview, cash flow, and transaction ledger</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Date range filter */}
          <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
            <Calendar size={13} className="ml-2 text-muted-foreground" />
            {(Object.keys(RANGE_LABELS) as DateRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  dateRange === r
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {RANGE_LABELS[r]}
              </button>
            ))}
          </div>

          {/* Export buttons */}
          <button
            onClick={() => exportCSV(transactions)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors"
          >
            <Download size={13} /> Export CSV
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors"
          >
            <FileText size={13} /> Export PDF
          </button>

          {/* Log Transaction */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
          >
            <Plus size={14} /> Log Transaction
          </button>
        </div>
      </motion.div>

      {/* ── P&L summary ──────────────────────────────────────────────────────── */}
      <PLSummary metrics={plMetrics} />

      {/* ── Main charts row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueExpenseChart data={filteredMonthly} />
        </div>
        <ExpenseDonut data={EXPENSE_CATEGORIES} />
      </div>

      {/* ── Second charts row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <WaterfallChart data={WATERFALL_DATA} />
        <ProfitMarginChart data={filteredMonthly} />
      </div>

      {/* ── Transaction table ────────────────────────────────────────────────── */}
      <TransactionTable transactions={transactions} />

      {/* ── Modal ────────────────────────────────────────────────────────────── */}
      <LogTransactionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddTransaction}
        currentBalance={currentBalance}
      />
    </div>
  );
}
