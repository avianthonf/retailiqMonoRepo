import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfMonth } from "date-fns";

export async function GET() {
  try {
    const now = new Date();
    const monthStart = startOfMonth(now);

    const [incomeTransactions, expenseTransactions] = await Promise.all([
      prisma.transaction.findMany({
        where: { type: "income", date: { gte: monthStart } },
      }),
      prisma.transaction.findMany({
        where: { type: "expense", date: { gte: monthStart } },
      }),
    ]);

    const revenue = incomeTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
    const expenses = expenseTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
    const netProfit = revenue - expenses;
    const marginPercent = revenue === 0 ? 0 : Math.round((netProfit / revenue) * 100);

    const fmtINR = (n: number) =>
      `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

    const summary =
      `This month: Revenue ${fmtINR(revenue)}, Expenses ${fmtINR(expenses)}, ` +
      `Net profit ${fmtINR(netProfit)} — that's a ${marginPercent}% margin.`;

    return NextResponse.json({ revenue, expenses, netProfit, marginPercent, summary });
  } catch (error) {
    console.error("Voice financials route error:", error);
    return NextResponse.json({
      revenue: 0,
      expenses: 0,
      netProfit: 0,
      marginPercent: 0,
      summary: "Financial data is temporarily unavailable. Please check the Financials page directly.",
    });
  }
}
