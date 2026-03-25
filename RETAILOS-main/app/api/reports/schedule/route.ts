import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const schedules = await prisma.reportSchedule.findMany({
      where: { userId: session.user?.email || "admin" }
    });
    return NextResponse.json(schedules);
  } catch (error: any) {
    console.error("Schedule GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type, frequency, email, dayOfWeek } = await req.json();
    const userId = session.user?.email || "admin";

    const schedule = await prisma.reportSchedule.create({
      data: {
        userId,
        type,
        frequency,
        email,
        dayOfWeek: dayOfWeek ? parseInt(dayOfWeek) : null
      }
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error: any) {
    console.error("Schedule POST Error:", error);
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await prisma.reportSchedule.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Schedule DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete schedule" }, { status: 500 });
  }
}
