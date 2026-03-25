import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfMonth, subMonths, endOfMonth, format, startOfDay, subDays } from "date-fns";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    
    // 1. Summary Metrics (Current Month)
    const monthStart = startOfMonth(now);
    const incomeThisMonth = await prisma.transaction.aggregate({
      where: { type: "income", date: { gte: monthStart } },
      _sum: { amount: true }
    });
    const expenseThisMonth = await prisma.transaction.aggregate({
      where: { type: "expense", date: { gte: monthStart } },
      _sum: { amount: true }
    });

    const revenue = incomeThisMonth._sum.amount || 0;
    const expenses = expenseThisMonth._sum.amount || 0;
    const cogs = expenses * 0.4; // Assuming 40% of expenses are COGS in this simplified model
    const grossProfit = revenue - cogs;
    const netProfit = revenue - expenses;

    // 2. Trends (Last 12 Months)
    const trends = [];
    for (let i = 0; i < 12; i++) {
      const targetMonth = subMonths(now, i);
      const start = startOfMonth(targetMonth);
      const end = endOfMonth(targetMonth);

      const [inc, exp] = await Promise.all([
        prisma.transaction.aggregate({
          where: { type: "income", date: { gte: start, lte: end } },
          _sum: { amount: true }
        }),
        prisma.transaction.aggregate({
          where: { type: "expense", date: { gte: start, lte: end } },
          _sum: { amount: true }
        })
      ]);

      trends.unshift({
        month: format(start, "MMM yyyy"),
        revenue: inc._sum.amount || 0,
        expenses: exp._sum.amount || 0,
        profit: (inc._sum.amount || 0) - (exp._sum.amount || 0)
      });
    }

    // 3. Expense Breakdown
    const expenseData = await prisma.transaction.groupBy({
      by: ['category'],
      where: { type: "expense", date: { gte: monthStart } },
      _sum: { amount: true }
    });
    const expenseBreakdown = expenseData.map((d: any) => ({
      category: d.category,
      total: d._sum.amount || 0
    }));

    // 4. Cash Flow (Last 30 Days)
    const thirtyDaysAgo = startOfDay(subDays(now, 30));
    const cashFlowTransactions = await prisma.transaction.findMany({
      where: { date: { gte: thirtyDaysAgo } },
      orderBy: { date: "asc" }
    });

    const cashFlowMap: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
       cashFlowMap[format(subDays(now, i), "yyyy-MM-dd")] = 0;
    }

    cashFlowTransactions.forEach((t: any) => {
      const d = format(t.date, "yyyy-MM-dd");
      if (cashFlowMap[d] !== undefined) {
        cashFlowMap[d] += t.type === "income" ? t.amount : -t.amount;
      }
    });

    const cashFlow = Object.entries(cashFlowMap)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 5. Recent Transactions
    const transactions = await prisma.transaction.findMany({
      take: 20,
      orderBy: { date: "desc" }
    });

    return NextResponse.json({
      summary: { revenue, cogs, grossProfit, expenses, netProfit },
      trends,
      expenseBreakdown,
      cashFlow,
      transactions
    });
  } catch (error: any) {
    console.error("Financials GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch financial data" }, { status: 500 });
  }
}
