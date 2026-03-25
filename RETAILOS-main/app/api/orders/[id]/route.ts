import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        customer: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Order GET Detail Error:", error);
    return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status } = await req.json();
    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: { customer: true }
    });

    // In a real app we'd add to a timeline table here. 
    // Since schema is missing it, we'll log it to system console.
    console.log(`Order status updated to ${status} for Order ID: ${params.id}`);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Order PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx: any) => {
      // 1. Delete associated transactions (approximate match by amount and description)
      const txn = await tx.transaction.findFirst({
        where: {
          amount: order.total,
          type: "income",
          description: { contains: order.id.slice(-6).toUpperCase() }
        }
      });
      if (txn) {
        await tx.transaction.delete({ where: { id: txn.id } });
      }

      // 2. Decrement customer stats
      await tx.customer.update({
        where: { id: order.customerId },
        data: {
          totalSpent: { decrement: order.total },
          orderCount: { decrement: 1 }
        }
      });

      // 3. Delete the order
      await tx.order.delete({ where: { id: params.id } });

      // Note: Stock restoration is impossible without an OrderItem table or metadata.
      console.warn(`Order deleted but stock was NOT restored because order items are not tracked in the current schema.`);
    });

    return NextResponse.json({ success: true, message: "Order cancelled and deleted" });
  } catch (error: any) {
    console.error("Order DELETE Error:", error);
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}
