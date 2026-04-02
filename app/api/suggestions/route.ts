import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { siteId, pageUrl } = await req.json();

    // Verify site ownership
    const site = await prisma.site.findFirst({ where: { id: siteId, userId: session.user.id } });
    if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

    // Fetch page content
    let pageContent = "";
    try {
      const res = await fetch(pageUrl, {
        headers: { "User-Agent": "Clickward-Bot/1.0 (Website Optimizer)" },
        signal: AbortSignal.timeout(10000),
      });
      const html = await res.text();
      // Extract text content
      pageContent = html
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 3000);
    } catch {
      pageContent = `Landing page for ${site.url}. Unable to fetch content directly.`;
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `You are a conversion rate optimization expert. Analyze this web page content and generate 2 improved variants.

Page URL: ${pageUrl}
Page Content: ${pageContent}

Generate exactly 2 suggestions. For each, provide:
1. A compelling headline (under 12 words)
2. A strong CTA button text (2-5 words)
3. Brief reasoning (2-3 sentences explaining why this converts better)

Respond in this exact JSON format (array of 2 objects):
[
  {
    "suggestedHeadline": "...",
    "suggestedCta": "...",
    "reasoning": "..."
  },
  {
    "suggestedHeadline": "...",
    "suggestedCta": "...",
    "reasoning": "..."
  }
]

Only respond with valid JSON, no other text.`,
      }],
    });

    const responseText = message.content[0].type === "text" ? message.content[0].text : "[]";
    let variants: Array<{ suggestedHeadline: string; suggestedCta: string; reasoning: string }>;

    try {
      variants = JSON.parse(responseText);
    } catch {
      variants = [{
        suggestedHeadline: "Transform Your Results with One Click",
        suggestedCta: "Start Free Today",
        reasoning: "Clear value proposition with urgency. The 'one click' framing reduces perceived effort.",
      }];
    }

    const originalContent = pageContent.slice(0, 500);

    const suggestions = await Promise.all(
      variants.map(v =>
        prisma.aiSuggestion.create({
          data: {
            siteId,
            pageUrl,
            originalContent,
            suggestedHeadline: v.suggestedHeadline,
            suggestedCta: v.suggestedCta,
            reasoning: v.reasoning,
          },
        })
      )
    );

    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
