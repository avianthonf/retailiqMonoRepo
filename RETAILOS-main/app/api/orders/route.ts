import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateOrderSchema } from "@/lib/validations";

import { format } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== "all") {
      where.status = status.toLowerCase();
    }
    if (search) {
      where.customer = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ]
      };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: { firstName: true, lastName: true, email: true }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    // Flatten and enrich data for the DataTable
    const enrichedOrders = orders.map((o: any) => ({
      ...o,
      customer: `${o.customer?.firstName} ${o.customer?.lastName}`,
      profitMargin: Math.floor(Math.random() * 15) + 15, // Mock margin
      date: format(o.createdAt, "MMM d, yyyy"),
      status: o.status.charAt(0).toUpperCase() + o.status.slice(1)
    }));

    return NextResponse.json({
      orders: enrichedOrders,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error("Orders GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = CreateOrderSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.format() }, { status: 400 });
    }

    const { customerId, items, discount = 0 } = validated.data;

    // 1. Fetch products to get prices and cost
    const productIds = items.map(i => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json({ error: "One or more products not found" }, { status: 404 });
    }

    // 2. Calculate totals
    let subtotal = 0;
    for (const item of items) {
      const product = dbProducts.find((p: any) => p.id === item.productId);
      if (product) {
        subtotal += product.price * item.quantity;
      }
    }
    const total = subtotal - discount;

    // 3. Database Transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          customerId,
          total,
          status: "completed",
          items: items.reduce((sum: number, i: any) => sum + i.quantity, 0),
        },
      });

      // Update product stock and check constraints
      for (const item of items) {
        const product = dbProducts.find((p: any) => p.id === item.productId);
        if (product && product.stockLevel < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }
        
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockLevel: { decrement: item.quantity }
          }
        });
      }

      // Create transaction log (income)
      await tx.transaction.create({
        data: {
          type: "income",
          category: "Sales",
          amount: total,
          description: `Order #${order.id.slice(-6).toUpperCase()} payment`,
          date: new Date()
        }
      });

      // Update customer stats
      await tx.customer.update({
        where: { id: customerId },
        data: {
          totalSpent: { increment: total },
          orderCount: { increment: 1 },
          lastSeen: new Date()
        }
      });

      return order;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Order POST Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
