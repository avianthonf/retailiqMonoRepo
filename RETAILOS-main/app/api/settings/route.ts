import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { settings: true, name: true, email: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Settings GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Fetch current user
    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Merge settings if it's an object, or just replace
    const currentSettings = (user.settings as object) || {};
    const newSettings = { ...currentSettings, ...body };

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { settings: newSettings }
    });

    return NextResponse.json(updatedUser.settings);
  } catch (error: any) {
    console.error("Settings PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
