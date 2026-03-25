import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stockLevel: {
          lte: 15,
          gt: 0,
        },
      },
      orderBy: { stockLevel: "asc" },
      take: 10,
    });

    const outOfStockProducts = await prisma.product.findMany({
      where: { stockLevel: 0 },
      take: 5,
    });

    const allItems = [
      ...outOfStockProducts.map((p: any) => ({ name: p.name, stock: 0, critical: true })),
      ...lowStockProducts.map((p: any) => ({ name: p.name, stock: p.stockLevel, critical: false })),
    ];

    if (allItems.length === 0) {
      return NextResponse.json({
        items: [],
        summary: "All stock levels are healthy. No items need immediate reordering.",
      });
    }

    const top5 = allItems.slice(0, 5).map((i) => i.name).join(", ");
    const outCount = outOfStockProducts.length;
    const lowCount = lowStockProducts.length;

    let summary = "";
    if (outCount > 0) summary += `${outCount} item${outCount > 1 ? "s are" : " is"} completely out of stock. `;
    if (lowCount > 0) summary += `${lowCount} item${lowCount > 1 ? "s are" : " is"} running low. `;
    summary += `Top items needing attention: ${top5}.`;

    return NextResponse.json({ items: allItems, summary });
  } catch (error) {
    console.error("Voice low-stock route error:", error);
    return NextResponse.json({
      items: [],
      summary: "Inventory data is temporarily unavailable. Please check the Inventory page directly.",
    });
  }
}
