import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfWeek, subDays } from "date-fns";

export async function GET() {
  try {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const thirtyDaysAgo = subDays(now, 30);

    const [totalCustomers, newThisWeek, atRiskCustomers] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({
        where: { createdAt: { gte: weekStart } },
      }),
      // At risk = haven't ordered in 30+ days but have placed orders before
      prisma.customer.count({
        where: {
          lastOrderAt: { lte: thirtyDaysAgo },
          totalSpent: { gt: 0 },
        },
      }),
    ]);

    const summary =
      `You have ${totalCustomers} customers total. ` +
      `${newThisWeek} joined this week. ` +
      `${atRiskCustomers} customers haven't purchased in over 30 days and may need re-engagement.`;

    return NextResponse.json({ totalCustomers, newThisWeek, atRiskCustomers, summary });
  } catch (error) {
    console.error("Voice customers route error:", error);
    return NextResponse.json({
      totalCustomers: 0,
      newThisWeek: 0,
      atRiskCustomers: 0,
      summary: "Customer data is temporarily unavailable. Please check the Customers page directly.",
    });
  }
}
