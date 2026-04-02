import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, pageUrl, eventType, sessionId, metadata } = body;

    if (!token || !pageUrl || !eventType || !sessionId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const site = await prisma.site.findUnique({ where: { scriptToken: token } });
    if (!site) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    await prisma.event.create({
      data: { siteId: site.id, pageUrl, eventType, sessionId, metadata: metadata || null },
    });

    return NextResponse.json({ ok: true }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
