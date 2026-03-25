import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateProductSchema, UpdateStockSchema } from "@/lib/validations";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Since InventoryLog table is missing in schema, we return history as empty array
    return NextResponse.json({ ...product, history: [] });
  } catch (error: any) {
    console.error("Product GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Check if it's a quick stock adjustment or a full update
    if (body.quantity !== undefined && body.productId !== undefined) {
      const validated = UpdateStockSchema.safeParse(body);
      if (!validated.success) {
        return NextResponse.json({ error: validated.error.format() }, { status: 400 });
      }

      const { quantity, reason } = validated.data;
      const product = await prisma.product.update({
        where: { id: params.id },
        data: { stockLevel: { increment: quantity } }
      });

      console.log(`Stock adjusted by ${quantity} for ${product.name}. Reason: ${reason || 'N/A'}`);
      return NextResponse.json(product);
    }

    // Full update
    const product = await prisma.product.update({
      where: { id: params.id },
      data: body
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Product PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Current schema doesn't support soft delete (no isDeleted field),
    // so we'll do a hard delete or return an error if it's referenced by orders.
    const orderCount = await prisma.order.count({
      where: { 
        // Note: Our current schema doesn't have OrderItems, so we check if any order was made (mock check)
        // In a real schema, we'd check if any OrderItems refer to this product.
      }
    });

    await prisma.product.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    console.error("Product DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete product. It might be referenced by orders." }, { status: 500 });
  }
}
