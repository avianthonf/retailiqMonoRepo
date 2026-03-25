export type AnalyticsDateRange = "1m" | "3m" | "6m" | "12m" | "ytd";

export interface CategorySales {
  month: string;
  Electronics: number;
  HomeGoods: number;
  Kitchen: number;
  Outdoor: number;
  Accessories: number;
}

export interface TopProduct {
  rank: number;
  name: string;
  sku: string;
  revenue: number;
  unitsSold: number;
  growth: number; // percent
}

export interface FunnelStep {
  name: string;
  value: number;
  color: string;
}

export interface HeatmapCell {
  day: number; // 0=Mon … 6=Sun
  hour: number; // 0–23
  value: number;
}

export interface RegionSales {
  id: string; // state postal code
  name: string;
  value: number;
}

export interface CustomerSegment {
  name: string;
  value: number;
  color: string;
}

export interface AOVData {
  month: string;
  current: number;
  previous: number;
}

export interface MonthlyMetric {
  month: string;
  value: number;
  prev: number;
}
