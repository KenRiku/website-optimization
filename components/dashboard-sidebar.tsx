"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MousePointerClick, LayoutDashboard, Globe, LogOut } from "lucide-react";

export function DashboardSidebar({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/dashboard/sites", label: "Sites", icon: <Globe size={18} /> },
  ];

  return (
    <aside style={{
      width: "240px",
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      padding: "20px 0",
      position: "sticky",
      top: 0,
      height: "100vh",
    }}>
      {/* Logo */}
      <div style={{ padding: "0 20px 24px", borderBottom: "1px solid var(--border)", marginBottom: "16px" }}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{ width: "30px", height: "30px", background: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MousePointerClick size={14} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "16px", color: "var(--foreground)" }}>Clickward</span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 12px" }}>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
                marginBottom: "2px",
                background: active ? "var(--primary-light)" : "transparent",
                color: active ? "var(--primary)" : "var(--muted)",
                transition: "all 0.15s",
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
        <div style={{ marginBottom: "12px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)" }}>{user.name}</div>
          <div style={{ fontSize: "12px", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            width: "100%",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            background: "transparent",
            cursor: "pointer",
            fontSize: "14px",
            color: "var(--muted)",
            fontWeight: 500,
          }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
