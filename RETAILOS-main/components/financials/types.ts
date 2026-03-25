export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string; // ISO date string
  type: TransactionType;
  category: string;
  description: string;
  amount: number; // always positive
  balance: number; // running balance
}

export interface MonthlyData {
  month: string;   // "Jan", "Feb" …
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;  // percent
}

export interface WaterfallItem {
  name: string;
  value: number;
  cumulative: number;
  isTotal?: boolean;
  isNegative?: boolean;
}

export interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
}

export interface PLMetric {
  label: string;
  value: number;
  prev: number;     // previous period value for trend
  prefix?: string;
  isExpense?: boolean;
}

export type DateRange = "1m" | "3m" | "6m" | "12m" | "ytd";
