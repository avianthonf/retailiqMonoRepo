import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { buildBusinessContext, streamChatResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const context = await buildBusinessContext(session.user?.email || "admin");
    const stream = await streamChatResponse(messages, context);

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = (chunk as any).choices?.[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(content);
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json({ error: "Assistant is currently resting. Please try again later." }, { status: 500 });
  }
}
