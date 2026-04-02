import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TestControls } from "@/components/test-controls";
import { calculateSignificance } from "@/lib/utils";

export default async function TestDetailPage({ params }: { params: { id: string; testId: string } }) {
  const session = await auth();
  const test = await prisma.abTest.findFirst({
    where: { id: params.testId, siteId: params.id },
    include: { site: true, suggestion: true },
  });
  if (!test || test.site.userId !== session?.user?.id!) notFound();

  const significance = calculateSignificance(
    test.variantAConversions,
    test.variantASessions,
    test.variantBConversions,
    test.variantBSessions
  );

  const aRate = test.variantASessions > 0 ? ((test.variantAConversions / test.variantASessions) * 100).toFixed(1) : "0.0";
  const bRate = test.variantBSessions > 0 ? ((test.variantBConversions / test.variantBSessions) * 100).toFixed(1) : "0.0";

  return (
    <div style={{ padding: "40px 48px", maxWidth: "900px" }}>
      <div style={{ marginBottom: "32px" }}>
        <Link href={`/dashboard/sites/${test.siteId}/tests`} style={{ fontSize: "13px", color: "var(--muted)", textDecoration: "none", marginBottom: "8px", display: "block" }}>← A/B Tests</Link>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>{test.name}</h1>
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>{test.suggestion.pageUrl}</p>
          </div>
          <span style={{
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 600,
            background: test.status === "running" ? "#eff6ff" : test.status === "completed" ? "#f0fdf4" : "#f8fafc",
            color: test.status === "running" ? "#2563eb" : test.status === "completed" ? "#16a34a" : "#64748b",
            textTransform: "capitalize",
          }}>
            {test.status}
          </span>
        </div>
      </div>

      {/* Variant comparison */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {[
          { label: test.variantALabel, headline: test.suggestion.originalContent?.slice(0, 100), cta: "Original CTA", sessions: test.variantASessions, conversions: test.variantAConversions, rate: aRate, isOriginal: true },
          { label: test.variantBLabel, headline: test.suggestion.suggestedHeadline, cta: test.suggestion.suggestedCta, sessions: test.variantBSessions, conversions: test.variantBConversions, rate: bRate, isOriginal: false },
        ].map((variant) => (
          <div key={variant.label} style={{
            background: "var(--surface)",
            border: `2px solid ${!variant.isOriginal && test.status === "completed" && significance.winner === "B" ? "var(--success)" : "var(--border)"}`,
            borderRadius: "16px",
            padding: "24px",
          }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
              {variant.label}
              {!variant.isOriginal && test.status === "completed" && significance.winner === "B" && (
                <span style={{ marginLeft: "8px", color: "var(--success)" }}>Winner</span>
              )}
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--foreground)", marginBottom: "8px", lineHeight: "1.4" }}>
              {variant.headline}
            </div>
            <div style={{ display: "inline-flex", padding: "6px 14px", background: "var(--primary)", color: "white", borderRadius: "6px", fontSize: "13px", fontWeight: 600, marginBottom: "20px" }}>
              {variant.cta}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--foreground)" }}>{variant.sessions.toLocaleString()}</div>
                <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Sessions</div>
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--foreground)" }}>{variant.conversions.toLocaleString()}</div>
                <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Conversions</div>
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: variant.isOriginal ? "var(--foreground)" : (parseFloat(bRate) > parseFloat(aRate) ? "var(--success)" : "var(--danger)") }}>
                  {variant.rate}%
                </div>
                <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Conv. Rate</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Significance */}
      {test.status !== "draft" && (
        <div style={{
          padding: "16px 20px",
          borderRadius: "12px",
          marginBottom: "24px",
          background: significance.significant ? "#f0fdf4" : "#fffbeb",
          border: `1px solid ${significance.significant ? "#bbf7d0" : "#fef3c7"}`,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          <div style={{ fontSize: "24px" }}>{significance.significant ? "✅" : "⏳"}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "14px", color: significance.significant ? "#15803d" : "#92400e" }}>
              {significance.significant ? `Statistically significant — Variant ${significance.winner} wins!` : "Not yet statistically significant"}
            </div>
            <div style={{ fontSize: "13px", color: significance.significant ? "#166534" : "#78350f" }}>
              {significance.confidence}% confidence level {significance.significant ? "— safe to act on these results." : "— need more data before drawing conclusions."}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <TestControls testId={test.id} siteId={test.siteId} status={test.status} />
    </div>
  );
}
