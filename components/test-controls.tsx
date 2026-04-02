"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function TestControls({ testId, siteId, status }: { testId: string; siteId: string; status: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function updateTest(action: "start" | "complete") {
    setLoading(true);
    try {
      const res = await fetch(`/api/tests/${testId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) { toast.error("Failed to update test"); return; }
      toast.success(action === "start" ? "Test started!" : "Test completed!");
      router.refresh();
    } catch {
      toast.error("Failed to update test");
    } finally {
      setLoading(false);
    }
  }

  if (status === "completed") {
    return (
      <div style={{ padding: "16px 20px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px", color: "#15803d" }}>
        <CheckCircle size={18} />
        <span style={{ fontSize: "14px", fontWeight: 500 }}>Test completed. Review the results above.</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "12px" }}>
      {status === "draft" && (
        <button
          onClick={() => updateTest("start")}
          disabled={loading}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "var(--primary)", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Play size={14} />}
          Start Test
        </button>
      )}
      {status === "running" && (
        <button
          onClick={() => updateTest("complete")}
          disabled={loading}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <CheckCircle size={14} />}
          Complete Test
        </button>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
