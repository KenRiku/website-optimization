"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";

export function AddSiteForm({ showAsButton }: { showAsButton?: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const url = (form.elements.namedItem("url") as HTMLInputElement).value;

    if (!name || !url) {
      setError("Site name and URL are required");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to add site");
      setLoading(false);
      return;
    }

    const site = await res.json();
    toast.success("Site added successfully!");
    setOpen(false);
    router.push(`/dashboard/sites/${site.id}`);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: showAsButton ? "12px 24px" : "8px 16px",
          background: "var(--primary)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <Plus size={16} />
        Add Site
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "24px",
    }}>
      <div style={{
        background: "var(--surface)",
        borderRadius: "16px",
        padding: "32px",
        width: "100%",
        maxWidth: "440px",
        border: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--foreground)" }}>Add a new site</h2>
          <button onClick={() => setOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--muted)" }}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px", marginBottom: "16px", color: "#dc2626", fontSize: "14px" }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "var(--foreground)", marginBottom: "6px" }}>Site Name</label>
            <input name="name" type="text" placeholder="My Awesome Site" required style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "14px", background: "var(--background)", color: "var(--foreground)", outline: "none", fontFamily: "var(--font-sans)", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "var(--foreground)", marginBottom: "6px" }}>Website URL</label>
            <input name="url" type="url" placeholder="https://mysite.com" required style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "14px", background: "var(--background)", color: "var(--foreground)", outline: "none", fontFamily: "var(--font-sans)", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button type="button" onClick={() => setOpen(false)} style={{ flex: 1, padding: "10px", border: "1px solid var(--border)", borderRadius: "8px", background: "transparent", fontSize: "14px", fontWeight: 500, cursor: "pointer", color: "var(--foreground)" }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: "10px", background: "var(--primary)", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Adding..." : "Add Site"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
