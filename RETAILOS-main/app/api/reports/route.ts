import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import anthropic from "@/lib/ai";
import { startOfDay, startOfWeek, startOfMonth, subDays, endOfDay } from "date-fns";
import { ReportType, ReportData } from "@/types/reports";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reports = await prisma.report.findMany({
      where: { userId: session.user?.email || "admin" },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error("Reports GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type, dateRange, metrics } = await req.json();
    const userId = session.user?.email || "admin";

    // 1. Query relevant data based on type
    let startDate = new Date();
    if (type === 'daily') startDate = startOfDay(new Date());
    else if (type === 'weekly') startDate = startOfWeek(new Date());
    else if (type === 'monthly') startDate = startOfMonth(new Date());
    else startDate = subDays(new Date(), 30);

    const [income, expenses, orders] = await Promise.all([
      prisma.transaction.aggregate({
        where: { type: "income", date: { gte: startDate } },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: { type: "expense", date: { gte: startDate } },
        _sum: { amount: true }
      }),
      prisma.order.count({
        where: { createdAt: { gte: startDate } }
      })
    ]);

    const revenue = income._sum.amount || 0;
    const cost = expenses._sum.amount || 0;
    const profit = revenue - cost;
    const margin = revenue === 0 ? 0 : (profit / revenue) * 100;

    const reportData: ReportData = {
      summary: { revenue, orders, profit, margin },
      details: {
        expenseBreakdown: [], // In a real app we'd group transactions
        topProducts: []
      },
      generatedAt: new Date().toISOString()
    };

    // 2. Call Claude to generate a narrative summary
    let narrative = "Your business is showing steady performance across core metrics.";
    try {
      if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== "PLACEHOLDER_KEY") {
        const response = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 500,
          messages: [{
            role: "user",
            content: `Generate a brief, professional narrative summary for a ${type} retail report with these metrics: Revenue $${revenue}, Orders ${orders}, Profit $${profit}, Margin ${margin.toFixed(1)}%. Highlight one key win and one area for focus.`
          }]
        });
        narrative = response.content[0].type === 'text' ? response.content[0].text : narrative;
      }
    } catch (aiError) {
      console.warn("AI Narrative generation failed:", aiError);
    }

    // 3. Store in DB
    const report = await prisma.report.create({
      data: {
        userId,
        type,
        data: reportData,
        narrative
      }
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    console.error("Report Post Error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
