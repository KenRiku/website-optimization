import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ScriptSnippet } from "@/components/script-snippet";
import { BarChart3, FlaskConical, Sparkles, MousePointerClick, Eye, ArrowUpRight } from "lucide-react";

export default async function SiteDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const site = await prisma.site.findFirst({
    where: { id: params.id, userId: session?.user?.id! },
  });

  if (!site) notFound();

  const events = await prisma.event.findMany({
    where: { siteId: site.id },
    orderBy: { timestamp: "desc" },
    take: 50,
  });

  const totalEvents = await prisma.event.count({ where: { siteId: site.id } });
  const uniqueSessions = await prisma.event.groupBy({
    by: ["sessionId"],
    where: { siteId: site.id },
  });
  const pageViews = events.filter(e => e.eventType === "pageview").length;

  // Top pages by views
  const pageViewMap: Record<string, number> = {};
  events.filter(e => e.eventType === "pageview").forEach(e => {
    pageViewMap[e.pageUrl] = (pageViewMap[e.pageUrl] || 0) + 1;
  });
  const topPages = Object.entries(pageViewMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const navLinks = [
    { href: `/dashboard/sites/${site.id}`, label: "Analytics" },
    { href: `/dashboard/sites/${site.id}/suggestions`, label: "AI Suggestions" },
    { href: `/dashboard/sites/${site.id}/tests`, label: "A/B Tests" },
  ];

  return (
    <div style={{ padding: "40px 48px", maxWidth: "1100px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <Link href="/dashboard" style={{ fontSize: "13px", color: "var(--muted)", textDecoration: "none", marginBottom: "8px", display: "block" }}>
          ← Dashboard
        </Link>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>{site.name}</h1>
            <a href={site.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "14px", color: "var(--muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              {site.url} <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Sub-nav */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "32px", borderBottom: "1px solid var(--border)", paddingBottom: "0" }}>
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              borderBottom: i === 0 ? "2px solid var(--primary)" : "2px solid transparent",
              color: i === 0 ? "var(--primary)" : "var(--muted)",
              marginBottom: "-1px",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Script snippet */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--foreground)", marginBottom: "12px" }}>Tracking Script</h2>
        <ScriptSnippet token={site.scriptToken} />
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Events", value: totalEvents.toLocaleString(), icon: <MousePointerClick size={18} /> },
          { label: "Unique Sessions", value: uniqueSessions.length.toLocaleString(), icon: <Eye size={18} /> },
          { label: "Page Views", value: pageViews.toLocaleString(), icon: <BarChart3 size={18} /> },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--primary)" }}>
              {stat.icon}
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--foreground)" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Top Pages + Recent Events */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 24px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--foreground)", marginBottom: "16px" }}>Top Pages by Views</h3>
          {topPages.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>No page views yet. Install the tracking script to start collecting data.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {topPages.map(([url, count]) => (
                <div key={url} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{url}</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary)" }}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 24px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--foreground)", marginBottom: "16px" }}>Recent Events</h3>
          {events.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>No events yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {events.slice(0, 8).map((event) => (
                <div key={event.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: event.eventType === "pageview" ? "#eef2ff" : event.eventType === "click" ? "#f0fdf4" : "#fffbeb",
                    color: event.eventType === "pageview" ? "#4f46e5" : event.eventType === "click" ? "#16a34a" : "#d97706",
                    textTransform: "uppercase",
                  }}>
                    {event.eventType}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{event.pageUrl}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <Link href={`/dashboard/sites/${site.id}/suggestions`} style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px 20px",
          background: "var(--primary-light)",
          border: "1px solid rgba(79,70,229,0.2)",
          borderRadius: "12px",
          textDecoration: "none",
        }}>
          <Sparkles size={20} style={{ color: "var(--primary)" }} />
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary)" }}>Generate AI Suggestions</div>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>Get headline and CTA variants</div>
          </div>
        </Link>
        <Link href={`/dashboard/sites/${site.id}/tests`} style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px 20px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          textDecoration: "none",
        }}>
          <FlaskConical size={20} style={{ color: "var(--muted)" }} />
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)" }}>View A/B Tests</div>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>Monitor and manage tests</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
