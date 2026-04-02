import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, url } = await req.json();
    if (!name || !url) return NextResponse.json({ error: "Name and URL are required" }, { status: 400 });

    const site = await prisma.site.create({
      data: { userId: session.user.id, name, url },
    });
    return NextResponse.json(site);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
