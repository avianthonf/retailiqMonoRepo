import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  const isDev = process.env.NODE_ENV === "development";

  if (!session && !isDev) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!agentId || agentId === "your_agent_id_here") {
    return NextResponse.json(
      { error: "ElevenLabs Agent ID not configured. Add NEXT_PUBLIC_ELEVENLABS_AGENT_ID to .env" },
      { status: 503 }
    );
  }

  if (!apiKey || apiKey === "your_elevenlabs_api_key_here") {
    return NextResponse.json(
      { error: "ElevenLabs API key not configured. Add ELEVENLABS_API_KEY to .env" },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs signed URL error:", errorText);
      return NextResponse.json(
        { error: "Failed to get signed URL from ElevenLabs" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error("ElevenLabs signed URL request failed:", error);
    return NextResponse.json({ error: "Network error reaching ElevenLabs" }, { status: 500 });
  }
}
