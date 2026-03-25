import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, startOfMonth } from "date-fns";

export async function GET() {
  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const monthStart = startOfMonth(now);

    // Today's transactions (income)
    const [todayTransactions, todayOrders, monthTransactions] = await Promise.all([
      prisma.transaction.findMany({
        where: { type: "income", date: { gte: todayStart } },
      }),
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.transaction.findMany({
        where: { type: "income", date: { gte: monthStart } },
      }),
    ]);

    const todayRevenue = todayTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
    const monthRevenue = monthTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);

    return NextResponse.json({
      todayRevenue,
      todayOrders,
      monthRevenue,
      summary: `Today's revenue is ₹${todayRevenue.toLocaleString("en-IN")} across ${todayOrders} orders. Month to date: ₹${monthRevenue.toLocaleString("en-IN")}.`,
    });
  } catch (error) {
    console.error("Voice revenue route error:", error);
    return NextResponse.json({
      todayRevenue: 0,
      todayOrders: 0,
      monthRevenue: 0,
      summary: "Revenue data is temporarily unavailable. Please check the dashboard directly.",
    });
  }
}
