import { Transaction, MonthlyData, ExpenseCategory, WaterfallItem } from "./types";

// ── Monthly data (12 months rolling) ─────────────────────────────────────────
export const MONTHLY_DATA: MonthlyData[] = [
  { month: "Apr", revenue: 52000,  expenses: 38000, profit: 14000, margin: 26.9 },
  { month: "May", revenue: 58000,  expenses: 41000, profit: 17000, margin: 29.3 },
  { month: "Jun", revenue: 61000,  expenses: 43500, profit: 17500, margin: 28.7 },
  { month: "Jul", revenue: 55000,  expenses: 40000, profit: 15000, margin: 27.3 },
  { month: "Aug", revenue: 63000,  expenses: 44000, profit: 19000, margin: 30.2 },
  { month: "Sep", revenue: 70000,  expenses: 46000, profit: 24000, margin: 34.3 },
  { month: "Oct", revenue: 74000,  expenses: 49000, profit: 25000, margin: 33.8 },
  { month: "Nov", revenue: 81000,  expenses: 52000, profit: 29000, margin: 35.8 },
  { month: "Dec", revenue: 92000,  expenses: 61000, profit: 31000, margin: 33.7 },
  { month: "Jan", revenue: 68000,  expenses: 47000, profit: 21000, margin: 30.9 },
  { month: "Feb", revenue: 72000,  expenses: 49000, profit: 23000, margin: 31.9 },
  { month: "Mar", revenue: 78500,  expenses: 51000, profit: 27500, margin: 35.0 },
];

// ── Expense categories ────────────────────────────────────────────────────────
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { name: "Cost of Goods",   value: 21500, color: "#6366f1" },
  { name: "Salaries",        value: 14000, color: "#8b5cf6" },
  { name: "Marketing",       value:  5200, color: "#a78bfa" },
  { name: "Rent & Utilities",value:  4800, color: "#c4b5fd" },
  { name: "Software & Tools",value:  2700, color: "#7c3aed" },
  { name: "Shipping",        value:  1900, color: "#4f46e5" },
  { name: "Miscellaneous",   value:   900, color: "#3730a3" },
];

// ── Waterfall (current month cash flow) ──────────────────────────────────────
export const WATERFALL_DATA: WaterfallItem[] = [
  { name: "Revenue",       value: 78500, cumulative: 78500 },
  { name: "COGS",          value:-21500, cumulative: 57000, isNegative: true },
  { name: "Gross Profit",  value: 57000, cumulative: 57000, isTotal: true },
  { name: "Salaries",      value:-14000, cumulative: 43000, isNegative: true },
  { name: "Marketing",     value: -5200, cumulative: 37800, isNegative: true },
  { name: "Rent",          value: -4800, cumulative: 33000, isNegative: true },
  { name: "Software",      value: -2700, cumulative: 30300, isNegative: true },
  { name: "Shipping",      value: -1900, cumulative: 28400, isNegative: true },
  { name: "Other",         value:  -900, cumulative: 27500, isNegative: true },
  { name: "Net Profit",    value: 27500, cumulative: 27500, isTotal: true },
];

// ── Transactions ──────────────────────────────────────────────────────────────
function genId() { return Math.random().toString(36).slice(2, 9); }

const RAW_TXN: Omit<Transaction, "id" | "balance">[] = [
  { date: "2026-03-16", type: "income",  category: "Product Sales",   description: "Online store batch #1821",   amount: 8200 },
  { date: "2026-03-15", type: "expense", category: "Salaries",        description: "Staff payroll — week 11",    amount: 3500 },
  { date: "2026-03-14", type: "income",  category: "Product Sales",   description: "B2B order #4432 (RetailCo)", amount: 12400 },
  { date: "2026-03-13", type: "expense", category: "Marketing",       description: "Google Ads March campaign",   amount: 1800 },
  { date: "2026-03-12", type: "income",  category: "Services",        description: "Consulting retainer Q1",     amount: 2500 },
  { date: "2026-03-11", type: "expense", category: "Software & Tools",description: "SaaS subscriptions renewal",  amount: 650 },
  { date: "2026-03-10", type: "expense", category: "Shipping",        description: "Courier bulk invoice",        amount: 480 },
  { date: "2026-03-08", type: "income",  category: "Product Sales",   description: "Marketplace revenue — week",  amount: 5600 },
  { date: "2026-03-07", type: "expense", category: "Rent & Utilities",description: "Office rent — March",        amount: 2400 },
  { date: "2026-03-05", type: "income",  category: "Product Sales",   description: "Weekend flash-sale batch",    amount: 4200 },
  { date: "2026-03-04", type: "expense", category: "Cost of Goods",   description: "Supplier invoice #INV-8821", amount: 7800 },
  { date: "2026-03-03", type: "income",  category: "Other Revenue",   description: "Insurance reimbursement",     amount: 350 },
  { date: "2026-03-02", type: "expense", category: "Miscellaneous",   description: "Office supplies & cleaning",  amount: 220 },
  { date: "2026-03-01", type: "income",  category: "Product Sales",   description: "March 1 opening sales",      amount: 3100 },
  { date: "2026-02-28", type: "expense", category: "Salaries",        description: "Staff payroll — week 8",     amount: 3500 },
  { date: "2026-02-26", type: "income",  category: "Product Sales",   description: "B2C batch order #1780",       amount: 6900 },
  { date: "2026-02-24", type: "expense", category: "Marketing",       description: "Instagram influencer deal",   amount: 1200 },
  { date: "2026-02-22", type: "income",  category: "Product Sales",   description: "Online store batch #1801",   amount: 4800 },
  { date: "2026-02-20", type: "expense", category: "Cost of Goods",   description: "Supplier invoice #INV-8766", amount: 6500 },
  { date: "2026-02-18", type: "income",  category: "Services",        description: "Training workshop fee",       amount: 1800 },
  { date: "2026-02-15", type: "expense", category: "Salaries",        description: "Staff payroll — week 6",     amount: 3500 },
  { date: "2026-02-12", type: "income",  category: "Product Sales",   description: "Valentine's promo batch",    amount: 9200 },
  { date: "2026-02-10", type: "expense", category: "Shipping",        description: "Courier invoice #SP-4412",   amount: 390 },
  { date: "2026-02-08", type: "income",  category: "Product Sales",   description: "Marketplace Feb batch",      amount: 5100 },
  { date: "2026-02-05", type: "expense", category: "Rent & Utilities",description: "February rent + utilities",  amount: 2400 },
  { date: "2026-01-31", type: "expense", category: "Salaries",        description: "Staff payroll — Jan end",    amount: 3500 },
  { date: "2026-01-28", type: "income",  category: "Product Sales",   description: "January closing batch",      amount: 7400 },
  { date: "2026-01-25", type: "expense", category: "Cost of Goods",   description: "Supplier restock #INV-8700", amount: 5900 },
  { date: "2026-01-22", type: "income",  category: "Other Revenue",   description: "Affiliate commissions Jan",  amount:  690 },
  { date: "2026-01-20", type: "expense", category: "Marketing",       description: "Q1 brand campaign deposit",  amount: 2200 },
];

let running = 42500; // opening balance
export const TRANSACTIONS: Transaction[] = RAW_TXN.map((t) => {
  running = t.type === "income" ? running + t.amount : running - t.amount;
  return { ...t, id: genId(), balance: Number(running.toFixed(2)) };
});

export const INCOME_CATEGORIES = [
  "Product Sales", "Services", "Other Revenue", "Refunds Received",
];
export const EXPENSE_CATS = [
  "Cost of Goods", "Salaries", "Marketing", "Rent & Utilities",
  "Software & Tools", "Shipping", "Miscellaneous",
];
