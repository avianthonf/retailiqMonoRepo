import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user?.email || "admin";
    const history = await prisma.aIChat.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    return NextResponse.json(history.reverse());
  } catch (error: any) {
    console.error("AI History GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch chat history" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { role, content } = await req.json();
    if (!role || !content) {
      return NextResponse.json({ error: "Role and content are required" }, { status: 400 });
    }

    const userId = session.user?.email || "admin";
    const message = await prisma.aIChat.create({
      data: {
        userId,
        role,
        content
      }
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    console.error("AI History POST Error:", error);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}
