import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AddSiteForm } from "@/components/add-site-form";
import { Globe, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id!;

  const sites = await prisma.site.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { events: true } },
    },
  });

  return (
    <div style={{ padding: "40px 48px", maxWidth: "1000px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>
            Welcome back, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "14px" }}>Your sites and optimization projects</p>
        </div>
        <AddSiteForm />
      </div>

      {sites.length === 0 ? (
        <div style={{
          border: "2px dashed var(--border)",
          borderRadius: "16px",
          padding: "64px 32px",
          textAlign: "center",
        }}>
          <div style={{ width: "56px", height: "56px", background: "var(--primary-light)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Globe size={24} style={{ color: "var(--primary)" }} />
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--foreground)", marginBottom: "8px" }}>No sites yet</h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "24px" }}>Add your first site to start tracking and optimizing.</p>
          <AddSiteForm showAsButton />
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {sites.map((site) => (
            <Link
              key={site.id}
              href={`/dashboard/sites/${site.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                textDecoration: "none",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "44px", height: "44px", background: "var(--primary-light)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Globe size={20} style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--foreground)", fontSize: "15px" }}>{site.name}</div>
                  <div style={{ fontSize: "13px", color: "var(--muted)" }}>{site.url}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)" }}>{site._count.events.toLocaleString()}</div>
                  <div style={{ fontSize: "12px", color: "var(--muted)" }}>events</div>
                </div>
                <ArrowRight size={16} style={{ color: "var(--muted)" }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
