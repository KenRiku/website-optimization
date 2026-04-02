"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";

export function SuggestionCard({ suggestion, siteId }: { suggestion: any; siteId: string }) {
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  async function createTest() {
    setCreating(true);
    try {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, suggestionId: suggestion.id, name: `Test: ${suggestion.suggestedHeadline.slice(0, 40)}` }),
      });
      if (!res.ok) { toast.error("Failed to create test"); return; }
      const test = await res.json();
      toast.success("A/B test created!");
      router.push(`/dashboard/sites/${siteId}/tests/${test.id}`);
    } catch {
      toast.error("Failed to create test");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
        <Lightbulb size={14} style={{ color: "var(--warning)" }} />
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>{suggestion.pageUrl}</span>
        <span style={{ fontSize: "12px", color: "var(--muted)", marginLeft: "auto" }}>{new Date(suggestion.createdAt).toLocaleDateString()}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={{ padding: "16px", background: "var(--background)", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Original</div>
          <div style={{ fontSize: "14px", color: "var(--foreground)", lineHeight: "1.5" }}>
            {suggestion.originalContent?.slice(0, 200) || "Original page content"}
          </div>
        </div>
        <div style={{ padding: "16px", background: "var(--primary-light)", borderRadius: "12px", border: "1px solid rgba(79,70,229,0.2)" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>AI Suggestion</div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)", marginBottom: "8px", lineHeight: "1.4" }}>
            {suggestion.suggestedHeadline}
          </div>
          <div style={{ fontSize: "13px", color: "var(--primary)", fontWeight: 500 }}>
            CTA: {suggestion.suggestedCta}
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 16px", background: "#fffbeb", borderRadius: "10px", border: "1px solid #fef3c7", marginBottom: "16px" }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "#92400e", marginBottom: "4px" }}>AI Reasoning</div>
        <div style={{ fontSize: "13px", color: "#78350f", lineHeight: "1.6" }}>{suggestion.reasoning}</div>
      </div>

      <button
        onClick={createTest}
        disabled={creating}
        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "var(--primary)", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: creating ? "not-allowed" : "pointer", opacity: creating ? 0.7 : 1 }}
      >
        <FlaskConical size={14} />
        {creating ? "Creating test..." : "Create A/B Test"}
      </button>
    </div>
  );
}
