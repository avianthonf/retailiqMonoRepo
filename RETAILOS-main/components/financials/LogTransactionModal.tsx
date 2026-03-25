"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { Transaction, TransactionType } from "./types";
import { INCOME_CATEGORIES, EXPENSE_CATS } from "./financialData";

interface LogTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (txn: Transaction) => void;
  currentBalance: number;
}

function genId() { return Math.random().toString(36).slice(2, 9); }

export default function LogTransactionModal({
  open, onClose, onAdd, currentBalance,
}: LogTransactionModalProps) {
  const [type, setType] = useState<TransactionType>("income");
  const [category, setCategory] = useState(INCOME_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATS;

  const handleTypeChange = (t: TransactionType) => {
    setType(t);
    setCategory((t === "income" ? INCOME_CATEGORIES : EXPENSE_CATS)[0]);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = "Enter a valid amount";
    if (!description.trim()) e.description = "Description is required";
    if (!date) e.date = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const num = parseFloat(amount);
    const newBalance = type === "income" ? currentBalance + num : currentBalance - num;
    onAdd({
      id: genId(),
      date,
      type,
      category,
      description,
      amount: num,
      balance: Number(newBalance.toFixed(2)),
    });
    // reset
    setAmount(""); setDescription(""); setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 450, damping: 30, mass: 0.8 }}
            className="relative z-10 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/15">
                  <Plus size={16} className="text-primary" />
                </div>
                <h2 className="font-bold text-base">Log Transaction</h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {/* Type toggle */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["income", "expense"] as TransactionType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTypeChange(t)}
                      className={`py-2.5 text-sm font-bold rounded-xl border transition-all ${
                        type === t
                          ? t === "income"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                            : "bg-red-500/20 border-red-500 text-red-400"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {t === "income" ? "↑ Income" : "↓ Expense"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                  Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Brief description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
