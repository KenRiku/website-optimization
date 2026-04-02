"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function ScriptSnippet({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const snippet = `<script src="${baseUrl}/api/track/${token}" defer></script>`;

  function copy() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      background: "#1e1e2e",
      borderRadius: "12px",
      padding: "16px 20px",
      position: "relative",
      border: "1px solid rgba(79,70,229,0.3)",
    }}>
      <pre style={{ margin: 0, fontSize: "13px", color: "#a6e3a1", fontFamily: "var(--font-mono)", overflowX: "auto" }}>
        {snippet}
      </pre>
      <button
        onClick={copy}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "rgba(79,70,229,0.2)",
          border: "1px solid rgba(79,70,229,0.3)",
          borderRadius: "6px",
          padding: "6px 10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "12px",
          color: "#a6e3a1",
          fontWeight: 500,
        }}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
