import { startOfDay, subDays, isWithinInterval, format } from "date-fns";
import { prisma } from "./prisma";

/**
 * Calculates profit margin percentage
 */
export function calculateProfitMargin(revenue: number, cost: number): number {
  if (revenue === 0) return 0;
  return ((revenue - cost) / revenue) * 100;
}

/**
 * Calculates RFM (Recency, Frequency, Monetary) scores and segment for a customer
 */
export function calculateRFMScore(customer: {
  lastSeen: Date;
  orderCount: number;
  totalSpent: number;
}) {
  const now = new Date();
  const daysSinceLastSeen = Math.floor(
    (now.getTime() - new Date(customer.lastSeen).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Simple scoring (1-5, 5 being best)
  let r = 1;
  if (daysSinceLastSeen <= 7) r = 5;
  else if (daysSinceLastSeen <= 30) r = 4;
  else if (daysSinceLastSeen <= 60) r = 3;
  else if (daysSinceLastSeen <= 90) r = 2;

  let f = 1;
  if (customer.orderCount >= 20) f = 5;
  else if (customer.orderCount >= 10) f = 4;
  else if (customer.orderCount >= 5) f = 3;
  else if (customer.orderCount >= 2) f = 2;

  let m = 1;
  if (customer.totalSpent >= 2000) m = 5;
  else if (customer.totalSpent >= 1000) m = 4;
  else if (customer.totalSpent >= 500) m = 3;
  else if (customer.totalSpent >= 100) m = 2;

  // Determine segment based on RFM
  let segment = "New";
  const score = r + f + m;

  if (r >= 4 && f >= 4 && m >= 4) segment = "Champions";
  else if (f >= 3 && m >= 3) segment = "Loyal";
  else if (r >= 4 && f <= 2) segment = "Potential Loyalist";
  else if (r === 1) segment = "At Risk";
  else if (score >= 10) segment = "Value Customer";

  return { recency: r, frequency: f, monetary: m, segment };
}

/**
 * Returns a date filter object for Prisma queries
 */
export function getDateRangeFilter(range: "7d" | "30d" | "90d" | "1y") {
  const to = new Date();
  let from = startOfDay(subDays(to, 7));

  if (range === "30d") from = startOfDay(subDays(to, 30));
  else if (range === "90d") from = startOfDay(subDays(to, 90));
  else if (range === "1y") from = startOfDay(subDays(to, 365));

  return { from, to };
}

/**
 * Aggregates transactions by day for a given range
 */
export function aggregateByDay(
  transactions: { date: Date; amount: number }[],
  dateRange: { from: Date; to: Date }
) {
  const map: Record<string, number> = {};
  
  // Initialize map with 0s for all days in range
  let current = new Date(dateRange.from);
  while (current <= dateRange.to) {
    map[format(current, "yyyy-MM-dd")] = 0;
    current.setDate(current.getDate() + 1);
  }

  // Fill with data
  transactions.forEach((t) => {
    const day = format(new Date(t.date), "yyyy-MM-dd");
    if (map[day] !== undefined) {
      map[day] += t.amount;
    }
  });

  return Object.entries(map).map(([date, total]) => ({ date, total }));
}

/**
 * Gets top products by volume/revenue
 */
export async function getTopProducts(limit: number = 5) {
  // In a real app, this would query OrderItems and aggregate.
  // Since our schema is simplified, we'll use stockLevel as a proxy or just query products.
  try {
    const products = await prisma.product.findMany({
      take: limit,
      orderBy: {
        price: 'desc' // Proxy for "top" as in high value
      }
    });
    return products.map((p: any) => ({
      name: p.name,
      sku: p.sku,
      value: p.price
    }));
  } catch (error) {
    console.error("Error fetching top products:", error);
    return [];
  }
}
