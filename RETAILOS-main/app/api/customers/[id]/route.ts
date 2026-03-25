import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateRFMScore } from "@/lib/analytics";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: params.id, deletedAt: null },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const rfm = calculateRFMScore({
      lastSeen: customer.lastSeen,
      orderCount: customer.orderCount,
      totalSpent: customer.totalSpent
    });

    return NextResponse.json({ ...customer, ...rfm });
  } catch (error: any) {
    console.error("Customer Detail GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch customer profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Support partial updates for name, tags, notes
    const updateData: any = { ...body };
    
    // Note: 'notes' is not in schema but we can store it in some field or just ignore/mock
    // For now, only update what's in schema
    delete updateData.notes;

    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json(customer);
  } catch (error: any) {
    console.error("Customer PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.customer.update({
      where: { id: params.id },
      data: { deletedAt: new Date() }
    });

    return NextResponse.json({ success: true, message: "Customer soft-deleted" });
  } catch (error: any) {
    console.error("Customer DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
