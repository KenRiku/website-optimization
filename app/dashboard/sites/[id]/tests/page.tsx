import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FlaskConical, Plus, ArrowRight } from "lucide-react";

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: "#f8fafc", text: "#64748b" },
  running: { bg: "#eff6ff", text: "#2563eb" },
  completed: { bg: "#f0fdf4", text: "#16a34a" },
};

export default async function TestsPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const site = await prisma.site.findFirst({
    where: { id: params.id, userId: session?.user?.id! },
  });
  if (!site) notFound();

  const tests = await prisma.abTest.findMany({
    where: { siteId: site.id },
    orderBy: { createdAt: "desc" },
    include: { suggestion: true },
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>{site.name}</h1>
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>A/B Tests</p>
          </div>
          <Link href={`/dashboard/sites/${site.id}/suggestions`} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "var(--primary)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
            <Plus size={14} /> New Test
          </Link>
        </div>
      </div>

      <div style={{ display: "flex", gap: "4px", marginBottom: "32px", borderBottom: "1px solid var(--border)" }}>
        {navLinks.map((link, i) => (
          <Link key={link.href} href={link.href} style={{
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: 500,
            textDecoration: "none",
            borderBottom: i === 2 ? "2px solid var(--primary)" : "2px solid transparent",
            color: i === 2 ? "var(--primary)" : "var(--muted)",
            marginBottom: "-1px",
          }}>{link.label}</Link>
        ))}
      </div>

      {tests.length === 0 ? (
        <div style={{ border: "2px dashed var(--border)", borderRadius: "16px", padding: "64px 32px", textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", background: "var(--primary-light)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <FlaskConical size={24} style={{ color: "var(--primary)" }} />
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--foreground)", marginBottom: "8px" }}>No tests yet</h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "24px" }}>Generate AI suggestions and create your first A/B test.</p>
          <Link href={`/dashboard/sites/${site.id}/suggestions`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "var(--primary)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
            Generate Suggestions
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {tests.map((test) => {
            const colors = statusColors[test.status] || statusColors.draft;
            return (
              <Link
                key={test.id}
                href={`/dashboard/sites/${site.id}/tests/${test.id}`}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", textDecoration: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "40px", height: "40px", background: "var(--primary-light)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FlaskConical size={18} style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)" }}>{test.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--muted)" }}>{test.suggestion.pageUrl}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", background: colors.bg, color: colors.text, textTransform: "capitalize" }}>
                    {test.status}
                  </span>
                  <ArrowRight size={14} style={{ color: "var(--muted)" }} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
