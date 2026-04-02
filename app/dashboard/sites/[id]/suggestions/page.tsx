import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GenerateSuggestionsForm } from "@/components/generate-suggestions-form";
import { SuggestionCard } from "@/components/suggestion-card";

export default async function SuggestionsPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const site = await prisma.site.findFirst({
    where: { id: params.id, userId: session?.user?.id! },
  });
  if (!site) notFound();

  const suggestions = await prisma.aiSuggestion.findMany({
    where: { siteId: site.id },
    orderBy: { createdAt: "desc" },
  });

  const navLinks = [
    { href: `/dashboard/sites/${site.id}`, label: "Analytics" },
    { href: `/dashboard/sites/${site.id}/suggestions`, label: "AI Suggestions" },
    { href: `/dashboard/sites/${site.id}/tests`, label: "A/B Tests" },
  ];

  return (
    <div style={{ padding: "40px 48px", maxWidth: "900px" }}>
      <div style={{ marginBottom: "32px" }}>
        <Link href="/dashboard" style={{ fontSize: "13px", color: "var(--muted)", textDecoration: "none", marginBottom: "8px", display: "block" }}>← Dashboard</Link>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>{site.name}</h1>
        <p style={{ color: "var(--muted)", fontSize: "14px" }}>AI-generated optimization suggestions</p>
      </div>

      <div style={{ display: "flex", gap: "4px", marginBottom: "32px", borderBottom: "1px solid var(--border)" }}>
        {navLinks.map((link, i) => (
          <Link key={link.href} href={link.href} style={{
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: 500,
            textDecoration: "none",
            borderBottom: i === 1 ? "2px solid var(--primary)" : "2px solid transparent",
            color: i === 1 ? "var(--primary)" : "var(--muted)",
            marginBottom: "-1px",
          }}>{link.label}</Link>
        ))}
      </div>

      <GenerateSuggestionsForm siteId={site.id} />

      {suggestions.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--foreground)", marginBottom: "16px" }}>Previous Suggestions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {suggestions.map(s => (
              <SuggestionCard key={s.id} suggestion={s} siteId={site.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
