"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { SuggestionCard } from "./suggestion-card";

export function GenerateSuggestionsForm({ siteId }: { siteId: string }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newSuggestions, setNewSuggestions] = useState<any[]>([]);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url) { setError("Please enter a page URL"); return; }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, pageUrl: url }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to generate suggestions");
        return;
      }
      const data = await res.json();
      setNewSuggestions(data.suggestions);
      toast.success("AI suggestions generated!");
      router.refresh();
    } catch {
      setError("Failed to generate suggestions");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{ width: "36px", height: "36px", background: "var(--primary-light)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={18} style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--foreground)" }}>Generate AI Suggestions</h2>
            <p style={{ fontSize: "13px", color: "var(--muted)" }}>Enter any page URL and AI will analyze it and suggest improvements</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px" }}>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://yoursite.com/landing-page"
            style={{ flex: 1, padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "14px", background: "var(--background)", color: "var(--foreground)", outline: "none", fontFamily: "var(--font-sans)" }}
          />
          <button type="submit" disabled={loading} style={{ padding: "10px 20px", background: "var(--primary)", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
            {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Analyzing...</> : <><Sparkles size={14} /> Generate</>}
          </button>
        </form>
        {error && <p style={{ marginTop: "10px", color: "var(--danger)", fontSize: "13px" }}>{error}</p>}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
          <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "14px" }}>AI is analyzing your page content and generating suggestions...</p>
          <p style={{ fontSize: "12px", marginTop: "4px" }}>This may take up to 30 seconds</p>
        </div>
      )}

      {newSuggestions.length > 0 && (
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--foreground)", marginBottom: "16px" }}>New Suggestions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {newSuggestions.map((s: any) => (
              <SuggestionCard key={s.id} suggestion={s} siteId={siteId} />
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
