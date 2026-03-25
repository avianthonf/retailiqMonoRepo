import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateTransactionSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type && type !== "all") where.type = type;
    if (category && category !== "all") where.category = category;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" }
      }),
      prisma.transaction.count({ where })
    ]);

    return NextResponse.json({
      transactions,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error("Transactions GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = CreateTransactionSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.format() }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        ...validated.data,
        date: validated.data.date || new Date()
      }
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.error("Transaction POST Error:", error);
    return NextResponse.json({ error: "Failed to log transaction" }, { status: 500 });
  }
}
