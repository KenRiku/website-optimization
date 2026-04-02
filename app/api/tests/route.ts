import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { siteId, suggestionId, name } = await req.json();

    const site = await prisma.site.findFirst({ where: { id: siteId, userId: session.user.id } });
    if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

    const test = await prisma.abTest.create({
      data: {
        siteId,
        suggestionId,
        name: name || "New A/B Test",
        status: "draft",
        variantALabel: "Original",
        variantBLabel: "AI Variant",
      },
    });

    return NextResponse.json(test);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
