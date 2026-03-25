import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateProductSchema } from "@/lib/validations";

import { format } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const isDev = process.env.NODE_ENV === "development";
  if (!session && !isDev) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const stockStatus = searchParams.get("stockStatus");
    const sort = searchParams.get("sort") || "name";
    const order = searchParams.get("order") || "asc";

    const where: any = {};
    if (category && category !== "all") {
      where.category = category;
    }

    if (stockStatus) {
      if (stockStatus === "low") {
        where.stockLevel = { lte: 15, gt: 0 };
      } else if (stockStatus === "out") {
        where.stockLevel = 0;
      } else if (stockStatus === "healthy") {
        where.stockLevel = { gt: 15 };
      }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { [sort]: order },
    });

    const transformedProducts = products.map((p: any) => {
      const margin = p.price === 0 ? 0 : Math.round(((p.price - p.cost) / p.price) * 100);
      let status: "Critical" | "Low" | "Good" | "Overstocked" = "Good";
      if (p.stockLevel === 0 || p.stockLevel < p.reorderPoint * 0.25) status = "Critical";
      else if (p.stockLevel < p.reorderPoint) status = "Low";
      else if (p.stockLevel > p.reorderPoint * 4) status = "Overstocked";

      return {
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.category,
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=${p.sku}`,
        stock: p.stockLevel,
        reorderPoint: p.reorderPoint,
        price: p.price,
        cost: p.cost,
        margin: margin,
        status: status,
        lastOrdered: format(p.updatedAt, "MMM d, yyyy"),
      };
    });

    return NextResponse.json(transformedProducts);
  } catch (error: any) {
    console.error("Inventory GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const isDev = process.env.NODE_ENV === "development";
  if (!session && !isDev) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = CreateProductSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.format() }, { status: 400 });
    }

    const { name, sku, category, price, costPrice, stock, reorderPoint } = validated.data;

    // Check SKU uniqueness
    const existing = await prisma.product.findUnique({ where: { sku } });
    if (existing) {
      return NextResponse.json({ error: "SKU already exists" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        category,
        price,
        cost: costPrice,
        stockLevel: stock,
        reorderPoint,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Inventory POST Error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
