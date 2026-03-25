"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, Calendar, ToggleLeft, ToggleRight } from "lucide-react";

import CategorySalesChart from "@/components/analytics/CategorySalesChart";
import TopProductsTable from "@/components/analytics/TopProductsTable";
import AcquisitionFunnel from "@/components/analytics/AcquisitionFunnel";
import SalesHeatmap from "@/components/analytics/SalesHeatmap";
import GeoSalesMap from "@/components/analytics/GeoSalesMap";
import CustomerSegmentChart from "@/components/analytics/CustomerSegmentChart";
import AOVTrendChart from "@/components/analytics/AOVTrendChart";

import {
  CATEGORY_SALES,
  CATEGORY_SALES_PREV,
  TOP_PRODUCTS,
  FUNNEL_STEPS,
  HEATMAP_DATA,
  REGION_SALES,
  CUSTOMER_SEGMENTS,
  AOV_DATA,
  sliceByRange,
} from "@/components/analytics/analyticsData";

import { AnalyticsDateRange } from "@/components/analytics/types";

// ── Date range config ─────────────────────────────────────────────────────────
const RANGE_LABELS: Record<AnalyticsDateRange, string> = {
  "1m": "1 Month",
  "3m": "3 Months",
  "6m": "6 Months",
  "12m": "12 Months",
  ytd:  "YTD",
};

const RANGE_MONTHS: Record<AnalyticsDateRange, number> = {
  "1m": 1, "3m": 3, "6m": 6, "12m": 12, ytd: new Date().getMonth() + 1,
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>("12m");
  const [comparePeriod, setComparePeriod] = useState(false);

  const months = RANGE_MONTHS[dateRange];

  // Slice data by date range for responsive charts
  const categorySales     = useMemo(() => sliceByRange(CATEGORY_SALES, months), [months]);
  const categorySalesPrev = useMemo(() => sliceByRange(CATEGORY_SALES_PREV, months), [months]);
  const aovData           = useMemo(() => sliceByRange(AOV_DATA, months), [months]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-primary/15">
              <BarChart3 size={20} className="text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Analytics</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Deep-dive into sales, customers, and product performance
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Date range picker */}
          <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
            <Calendar size={13} className="ml-2 text-muted-foreground" />
            {(Object.keys(RANGE_LABELS) as AnalyticsDateRange[]).map((r) => (
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

          {/* Compare period toggle */}
          <button
            onClick={() => setComparePeriod((p) => !p)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
              comparePeriod
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {comparePeriod
              ? <ToggleRight size={16} className="text-primary" />
              : <ToggleLeft size={16} />}
            Compare Period
          </button>
        </div>
      </motion.div>

      {/* ── Row 1: Category sales + Funnel ───────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CategorySalesChart
            data={categorySales}
            comparePeriod={comparePeriod}
            prevData={categorySalesPrev}
          />
        </div>
        <AcquisitionFunnel data={FUNNEL_STEPS} />
      </div>

      {/* ── Row 2: Top Products + Customer Segments ──────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TopProductsTable data={TOP_PRODUCTS} />
        </div>
        <CustomerSegmentChart data={CUSTOMER_SEGMENTS} />
      </div>

      {/* ── Row 3: Heatmap (full width) ──────────────────────────────────── */}
      <SalesHeatmap data={HEATMAP_DATA} />

      {/* ── Row 4: Geo Map + AOV Trend ───────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GeoSalesMap data={REGION_SALES} />
        <AOVTrendChart data={aovData} comparePeriod={comparePeriod} />
      </div>
    </div>
  );
}
