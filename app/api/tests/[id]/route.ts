import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { action } = await req.json();

    const test = await prisma.abTest.findFirst({
      where: { id: params.id },
      include: { site: true },
    });
    if (!test || test.site.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (action === "start") {
      const updated = await prisma.abTest.update({
        where: { id: params.id },
        data: { status: "running", startedAt: new Date() },
      });
      return NextResponse.json(updated);
    }

    if (action === "complete") {
      // Generate realistic simulated results
      const aSessions = Math.floor(Math.random() * 300) + 150;
      const bSessions = Math.floor(Math.random() * 300) + 150;
      const aRate = 0.02 + Math.random() * 0.08;
      const bRate = aRate + (Math.random() - 0.3) * 0.05;
      const aConversions = Math.round(aSessions * aRate);
      const bConversions = Math.round(bSessions * Math.max(0, bRate));

      const updated = await prisma.abTest.update({
        where: { id: params.id },
        data: {
          status: "completed",
          completedAt: new Date(),
          variantASessions: aSessions,
          variantBSessions: bSessions,
          variantAConversions: aConversions,
          variantBConversions: bConversions,
        },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
