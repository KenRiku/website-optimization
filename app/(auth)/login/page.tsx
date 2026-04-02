"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <div style={{ width: "36px", height: "36px", background: "var(--primary)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: "18px" }}>↗</span>
            </div>
            <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--foreground)" }}>Clickward</span>
          </a>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--foreground)", marginBottom: "8px" }}>Welcome back</h1>
          <p style={{ color: "var(--muted)", marginBottom: "24px", fontSize: "14px" }}>Sign in to your Clickward account</p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px", marginBottom: "16px", color: "#dc2626", fontSize: "14px" }}>
                {error}
              </div>
            )}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "var(--foreground)", marginBottom: "6px" }}>Email</label>
              <input name="email" type="email" placeholder="you@example.com" required style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "14px", background: "var(--background)", color: "var(--foreground)", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "var(--foreground)", marginBottom: "6px" }}>Password</label>
              <input name="password" type="password" placeholder="••••••••" required style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "14px", background: "var(--background)", color: "var(--foreground)", outline: "none", boxSizing: "border-box" }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", background: "var(--primary)", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "var(--muted)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
