import {
  CategorySales, TopProduct, FunnelStep, HeatmapCell,
  RegionSales, CustomerSegment, AOVData,
} from "./types";

// ── Category sales by month (stacked bar) ──────────────────────────────────
export const CATEGORY_SALES: CategorySales[] = [
  { month: "Apr", Electronics: 18200, HomeGoods: 9400,  Kitchen: 7600,  Outdoor: 5800,  Accessories: 4200 },
  { month: "May", Electronics: 21000, HomeGoods: 10100, Kitchen: 8200,  Outdoor: 6500,  Accessories: 4800 },
  { month: "Jun", Electronics: 22500, HomeGoods: 11200, Kitchen: 8800,  Outdoor: 7100,  Accessories: 5100 },
  { month: "Jul", Electronics: 19800, HomeGoods: 10800, Kitchen: 7900,  Outdoor: 8200,  Accessories: 4600 },
  { month: "Aug", Electronics: 24200, HomeGoods: 11900, Kitchen: 9100,  Outdoor: 8800,  Accessories: 5300 },
  { month: "Sep", Electronics: 27500, HomeGoods: 13200, Kitchen: 10400, Outdoor: 7600,  Accessories: 5800 },
  { month: "Oct", Electronics: 29800, HomeGoods: 14100, Kitchen: 11200, Outdoor: 6900,  Accessories: 6200 },
  { month: "Nov", Electronics: 33500, HomeGoods: 15800, Kitchen: 12800, Outdoor: 5600,  Accessories: 7100 },
  { month: "Dec", Electronics: 38200, HomeGoods: 18400, Kitchen: 14600, Outdoor: 4800,  Accessories: 8200 },
  { month: "Jan", Electronics: 26400, HomeGoods: 13800, Kitchen: 10200, Outdoor: 5100,  Accessories: 5800 },
  { month: "Feb", Electronics: 28100, HomeGoods: 14600, Kitchen: 11400, Outdoor: 5800,  Accessories: 6100 },
  { month: "Mar", Electronics: 31200, HomeGoods: 15200, Kitchen: 12100, Outdoor: 6400,  Accessories: 6800 },
];

// Previous period (shifted down ~12%)
export const CATEGORY_SALES_PREV: CategorySales[] = CATEGORY_SALES.map((d) => ({
  ...d,
  Electronics: Math.round(d.Electronics * 0.87),
  HomeGoods:   Math.round(d.HomeGoods * 0.9),
  Kitchen:     Math.round(d.Kitchen * 0.88),
  Outdoor:     Math.round(d.Outdoor * 0.85),
  Accessories: Math.round(d.Accessories * 0.92),
}));

export const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "#A680FF", // Purple
  HomeGoods:   "#7C3AED", // Deeper Purple
  Kitchen:     "#D97757", // Orange
  Outdoor:     "#E8E2D9", // Clay
  Accessories: "#1D1D1D", // Charcoal
};

// ── Top products ──────────────────────────────────────────────────────────────
export const TOP_PRODUCTS: TopProduct[] = [
  { rank: 1, name: "Wireless Noise-Cancelling Headphones", sku: "EL-WNC-001", revenue: 42800, unitsSold: 389, growth: 18.2 },
  { rank: 2, name: "Mechanical Gaming Keyboard",           sku: "EL-MKB-002", revenue: 31200, unitsSold: 520, growth: 12.4 },
  { rank: 3, name: "Organic French Press Coffee Set",      sku: "KT-FPC-007", revenue: 28400, unitsSold: 712, growth: 24.1 },
  { rank: 4, name: "Premium Yoga Mat (Eco-friendly)",      sku: "OD-YGM-005", revenue: 24600, unitsSold: 615, growth: -3.2 },
  { rank: 5, name: "Smart LED Desk Lamp",                  sku: "HM-LED-004", revenue: 21800, unitsSold: 436, growth: 8.7 },
  { rank: 6, name: "Bamboo Cutting Board Set",             sku: "HM-CUT-012", revenue: 19400, unitsSold: 647, growth: 15.6 },
  { rank: 7, name: "Portable Bluetooth Speaker",           sku: "EL-PBS-015", revenue: 17200, unitsSold: 344, growth: 21.3 },
  { rank: 8, name: "Stainless Steel Water Bottle",         sku: "OD-SSB-009", revenue: 14800, unitsSold: 925, growth: 6.1 },
];

// ── Customer acquisition funnel ───────────────────────────────────────────────
export const FUNNEL_STEPS: FunnelStep[] = [
  { name: "Website Visitors",  value: 48200, color: "#A680FF" },
  { name: "Product Views",     value: 21400, color: "#9333EA" },
  { name: "Added to Cart",     value: 8900,  color: "#7C3AED" },
  { name: "Reached Checkout",  value: 5200,  color: "#D97757" },
  { name: "Completed Purchase",value: 3100,  color: "#1D1D1D" },
];

// ── Heatmap (7 days × 24 hours) ──────────────────────────────────────────────
function seedRandom(seed: number) {
  return () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export function generateHeatmap(): HeatmapCell[] {
  const rng = seedRandom(42);
  const cells: HeatmapCell[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // simulate realistic sales: low at night, peak mid-day, higher on weekends
      const baseActivity = hour >= 9 && hour <= 21 ? 0.7 : 0.15;
      const weekendBoost = day >= 5 ? 1.3 : 1;
      const lunchPeak = hour >= 11 && hour <= 14 ? 1.4 : 1;
      const eveningPeak = hour >= 18 && hour <= 20 ? 1.2 : 1;
      const value = Math.round(
        (baseActivity * weekendBoost * lunchPeak * eveningPeak * (40 + rng() * 60))
      );
      cells.push({ day, hour, value });
    }
  }
  return cells;
}

export const HEATMAP_DATA = generateHeatmap();

// ── Geographic sales (US states) ─────────────────────────────────────────────
export const REGION_SALES: RegionSales[] = [
  { id: "US-CA", name: "California",    value: 42800 },
  { id: "US-TX", name: "Texas",         value: 31200 },
  { id: "US-NY", name: "New York",      value: 38400 },
  { id: "US-FL", name: "Florida",       value: 28600 },
  { id: "US-IL", name: "Illinois",      value: 18200 },
  { id: "US-PA", name: "Pennsylvania",  value: 15400 },
  { id: "US-OH", name: "Ohio",          value: 12800 },
  { id: "US-GA", name: "Georgia",       value: 14200 },
  { id: "US-WA", name: "Washington",    value: 19800 },
  { id: "US-MA", name: "Massachusetts", value: 16400 },
  { id: "US-NC", name: "North Carolina",value: 11200 },
  { id: "US-AZ", name: "Arizona",       value: 9800 },
  { id: "US-CO", name: "Colorado",      value: 10400 },
  { id: "US-MI", name: "Michigan",      value: 8600 },
  { id: "US-OR", name: "Oregon",        value: 7200 },
  { id: "US-NV", name: "Nevada",        value: 6400 },
  { id: "US-MN", name: "Minnesota",     value: 5800 },
  { id: "US-TN", name: "Tennessee",     value: 7400 },
  { id: "US-VA", name: "Virginia",      value: 9200 },
  { id: "US-NJ", name: "New Jersey",    value: 12600 },
];

// ── Customer segments ─────────────────────────────────────────────────────────
export const CUSTOMER_SEGMENTS: CustomerSegment[] = [
  { name: "Returning Customers", value: 62, color: "#6366f1" },
  { name: "New Customers",       value: 38, color: "#10b981" },
];

// ── Average Order Value trend ─────────────────────────────────────────────────
export const AOV_DATA: AOVData[] = [
  { month: "Apr", current: 64.2,  previous: 58.1 },
  { month: "May", current: 67.8,  previous: 61.4 },
  { month: "Jun", current: 71.3,  previous: 63.2 },
  { month: "Jul", current: 68.5,  previous: 62.8 },
  { month: "Aug", current: 73.1,  previous: 65.4 },
  { month: "Sep", current: 76.4,  previous: 68.2 },
  { month: "Oct", current: 79.2,  previous: 70.1 },
  { month: "Nov", current: 84.6,  previous: 73.8 },
  { month: "Dec", current: 91.2,  previous: 78.4 },
  { month: "Jan", current: 74.8,  previous: 67.2 },
  { month: "Feb", current: 77.4,  previous: 69.1 },
  { month: "Mar", current: 81.2,  previous: 71.8 },
];

// ── Helper: slice data by month range ─────────────────────────────────────────
export function sliceByRange<T>(data: T[], months: number): T[] {
  return data.slice(-Math.min(months, data.length));
}
