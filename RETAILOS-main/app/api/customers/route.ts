import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateCustomerSchema } from "@/lib/validations";
import { calculateRFMScore } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const segmentFilter = searchParams.get("segment");
    const search = searchParams.get("search");
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    
    if (segmentFilter && segmentFilter !== "all") {
      where.segment = segmentFilter;
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastSeen: "desc" },
      }),
      prisma.customer.count({ where })
    ]);

    // Recalculate/enrich segments using the RFM helper
    const enrichedCustomers = customers.map((c: any) => {
      const rfm = calculateRFMScore({
        lastSeen: c.lastSeen,
        orderCount: c.orderCount,
        totalSpent: c.totalSpent
      });
      return { ...c, ...rfm };
    });

    return NextResponse.json({
      customers: enrichedCustomers,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error("Customers GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = CreateCustomerSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.format() }, { status: 400 });
    }

    const { name, email, phone, tags } = validated.data;
    // Split name into first and last
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        tags: tags || [],
        segment: "New"
      }
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    console.error("Customer POST Error:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
