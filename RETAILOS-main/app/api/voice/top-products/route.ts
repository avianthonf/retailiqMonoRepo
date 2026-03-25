import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, startOfWeek, startOfMonth } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "week";

    const now = new Date();
    let periodStart: Date;
    let periodLabel: string;

    switch (period) {
      case "today":
        periodStart = startOfDay(now);
        periodLabel = "today";
        break;
      case "month":
        periodStart = startOfMonth(now);
        periodLabel = "this month";
        break;
      default:
        periodStart = startOfWeek(now, { weekStartsOn: 1 });
        periodLabel = "this week";
    }

    // Get orders in period with items
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: periodStart },
        status: { notIn: ["cancelled"] },
      },
      include: { items: { include: { product: true } } },
    });

    // Aggregate units sold per product
    const productSales: Record<string, { name: string; unitsSold: number; revenue: number }> = {};

    for (const order of orders) {
      for (const item of (order as any).items ?? []) {
        const pid = item.productId;
        if (!productSales[pid]) {
          productSales[pid] = {
            name: item.product?.name ?? "Unknown",
            unitsSold: 0,
            revenue: 0,
          };
        }
        productSales[pid].unitsSold += item.quantity;
        productSales[pid].revenue += item.quantity * (item.price ?? 0);
      }
    }

    const sorted = Object.values(productSales).sort((a, b) => b.unitsSold - a.unitsSold);
    const top3 = sorted.slice(0, 3);

    if (top3.length === 0) {
      return NextResponse.json({
        products: [],
        summary: `No sales data found for ${periodLabel}.`,
      });
    }

    const summary =
      `Your top products ${periodLabel}: ` +
      top3.map((p, i) => `${i + 1}. ${p.name} with ${p.unitsSold} units sold`).join(", ") +
      ".";

    return NextResponse.json({ products: sorted, summary });
  } catch (error) {
    console.error("Voice top-products route error:", error);
    return NextResponse.json({
      products: [],
      summary: "Sales data is temporarily unavailable. Please check the Analytics page directly.",
    });
  }
}
