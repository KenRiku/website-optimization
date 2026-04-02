import Link from "next/link";
import { MousePointerClick, BarChart3, Sparkles, FlaskConical, CheckCircle, Zap, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", background: "var(--primary)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MousePointerClick size={16} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: "18px", color: "var(--foreground)" }}>Clickward</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/login" style={{ padding: "8px 18px", border: "1px solid var(--border)", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: 500, color: "var(--foreground)", background: "transparent" }}>
            Sign in
          </Link>
          <Link href="/signup" style={{ padding: "8px 18px", background: "var(--primary)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: "100px 40px 120px",
        textAlign: "center",
        background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #faf5ff 100%)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--primary-light)", border: "1px solid rgba(79,70,229,0.2)", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", fontWeight: 600, color: "var(--primary)", marginBottom: "32px" }}>
            <Sparkles size={13} />
            AI-powered conversion optimization
          </div>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 800, lineHeight: 1.1, color: "var(--foreground)", marginBottom: "24px", letterSpacing: "-0.03em" }}>
            Your site converts more{" "}
            <span style={{ color: "var(--primary)" }}>while you sleep</span>
          </h1>
          <p style={{ fontSize: "20px", color: "var(--muted)", lineHeight: 1.6, maxWidth: "580px", margin: "0 auto 40px" }}>
            Drop in one script tag and let AI analyze your visitors, rewrite your copy, and run A/B tests — automatically.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup" style={{ padding: "14px 32px", background: "var(--primary)", color: "white", borderRadius: "10px", textDecoration: "none", fontSize: "16px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "8px" }}>
              Start optimizing free →
            </Link>
            <Link href="/login" style={{ padding: "14px 32px", background: "white", color: "var(--foreground)", borderRadius: "10px", textDecoration: "none", fontSize: "16px", fontWeight: 600, border: "1px solid var(--border)" }}>
              Sign in
            </Link>
          </div>
          <p style={{ marginTop: "20px", fontSize: "13px", color: "var(--muted)" }}>No credit card required · Free forever on Starter plan</p>
        </div>

        {/* Hero mockup */}
        <div style={{ maxWidth: "900px", margin: "64px auto 0", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 64px rgba(79,70,229,0.12)" }}>
          <div style={{ background: "#1e1e2e", padding: "12px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#28c840" }} />
            <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "6px", padding: "4px 12px", marginLeft: "8px", fontSize: "12px", color: "#a6adc8" }}>
              app.clickward.io/dashboard
            </div>
          </div>
          <div style={{ padding: "32px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {[
              { label: "Total Events", value: "48,291", change: "+12%" },
              { label: "Unique Sessions", value: "8,104", change: "+8%" },
              { label: "Conv. Rate Lift", value: "+23%", change: "vs baseline" },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "var(--background)", borderRadius: "12px", padding: "20px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "8px" }}>{stat.label}</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--foreground)" }}>{stat.value}</div>
                <div style={{ fontSize: "12px", color: "var(--success)", marginTop: "4px", fontWeight: 600 }}>{stat.change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "100px 40px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: 800, color: "var(--foreground)", marginBottom: "12px", letterSpacing: "-0.02em" }}>How it works</h2>
          <p style={{ fontSize: "17px", color: "var(--muted)" }}>Three simple steps to higher conversions</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
          {[
            {
              step: "01",
              icon: <MousePointerClick size={24} />,
              title: "Install the script",
              description: "Copy one line of code and paste it into your site's HTML. Works with any website or framework — no rebuild needed.",
            },
            {
              step: "02",
              icon: <BarChart3 size={24} />,
              title: "AI analyzes behavior",
              description: "Clickward tracks pageviews, clicks, and scroll depth. Our AI identifies drop-off points and underperforming elements.",
            },
            {
              step: "03",
              icon: <FlaskConical size={24} />,
              title: "A/B test automatically",
              description: "AI generates headline and CTA variants. Launch tests with one click and let statistical significance guide your decisions.",
            },
          ].map((item) => (
            <div key={item.step} style={{ textAlign: "center", padding: "40px 32px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", background: "var(--primary-light)", borderRadius: "16px", marginBottom: "20px", color: "var(--primary)" }}>
                {item.icon}
              </div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Step {item.step}</div>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--foreground)", marginBottom: "12px" }}>{item.title}</h3>
              <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.6 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 40px", background: "linear-gradient(180deg, var(--background) 0%, #f5f3ff 100%)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: 800, color: "var(--foreground)", marginBottom: "12px", letterSpacing: "-0.02em" }}>Everything you need</h2>
            <p style={{ fontSize: "17px", color: "var(--muted)" }}>A full optimization stack in one tool</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
            {[
              {
                icon: <BarChart3 size={22} />,
                title: "Behavioral Analytics",
                description: "Track every click, scroll, and pageview. Understand exactly how visitors navigate your site and where they drop off.",
              },
              {
                icon: <Sparkles size={22} />,
                title: "AI Copywriting",
                description: "Claude AI analyzes your page content and generates high-converting headlines and CTAs tailored to your audience.",
              },
              {
                icon: <FlaskConical size={22} />,
                title: "A/B Test Management",
                description: "Create and manage split tests from one dashboard. Control test lifecycle from draft to running to completed.",
              },
              {
                icon: <TrendingUp size={22} />,
                title: "Statistical Significance",
                description: "Built-in chi-squared testing tells you when results are statistically significant so you never act on noise.",
              },
            ].map((feature) => (
              <div key={feature.title} style={{ padding: "32px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", display: "flex", gap: "20px" }}>
                <div style={{ flexShrink: 0, width: "48px", height: "48px", background: "var(--primary-light)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                  {feature.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--foreground)", marginBottom: "8px" }}>{feature.title}</h3>
                  <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.6 }}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: 800, color: "var(--foreground)", marginBottom: "12px", letterSpacing: "-0.02em" }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: "17px", color: "var(--muted)" }}>Start free. Upgrade when you&apos;re ready.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", alignItems: "start" }}>
            {[
              {
                name: "Starter",
                price: "Free",
                period: "forever",
                description: "Perfect for personal projects and small sites.",
                features: ["1 site", "10,000 events/mo", "Basic analytics", "AI suggestions (5/mo)", "1 active A/B test"],
                cta: "Get started free",
                href: "/signup",
                highlighted: false,
              },
              {
                name: "Growth",
                price: "$29",
                period: "/mo",
                description: "For growing businesses that need more power.",
                features: ["5 sites", "500,000 events/mo", "Advanced analytics", "Unlimited AI suggestions", "10 active A/B tests", "Priority support"],
                cta: "Start free trial",
                href: "/signup",
                highlighted: true,
              },
              {
                name: "Scale",
                price: "$99",
                period: "/mo",
                description: "For teams running serious optimization programs.",
                features: ["Unlimited sites", "Unlimited events", "Custom analytics", "Unlimited AI suggestions", "Unlimited A/B tests", "Dedicated support", "Custom integrations"],
                cta: "Start free trial",
                href: "/signup",
                highlighted: false,
              },
            ].map((plan) => (
              <div key={plan.name} style={{
                padding: "36px 32px",
                background: plan.highlighted ? "var(--primary)" : "var(--surface)",
                border: plan.highlighted ? "none" : "1px solid var(--border)",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                boxShadow: plan.highlighted ? "0 20px 60px rgba(79,70,229,0.35)" : "none",
              }}>
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: plan.highlighted ? "rgba(255,255,255,0.7)" : "var(--muted)", marginBottom: "8px" }}>{plan.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "40px", fontWeight: 800, color: plan.highlighted ? "white" : "var(--foreground)" }}>{plan.price}</span>
                    <span style={{ fontSize: "14px", color: plan.highlighted ? "rgba(255,255,255,0.7)" : "var(--muted)" }}>{plan.period}</span>
                  </div>
                  <p style={{ fontSize: "14px", color: plan.highlighted ? "rgba(255,255,255,0.8)" : "var(--muted)", lineHeight: 1.5 }}>{plan.description}</p>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: plan.highlighted ? "rgba(255,255,255,0.9)" : "var(--foreground)" }}>
                      <CheckCircle size={15} style={{ color: plan.highlighted ? "rgba(255,255,255,0.8)" : "var(--success)", flexShrink: 0 }} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} style={{
                  display: "block",
                  textAlign: "center",
                  padding: "12px",
                  background: plan.highlighted ? "white" : "var(--primary)",
                  color: plan.highlighted ? "var(--primary)" : "white",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: 700,
                }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "80px 40px", background: "var(--primary)", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Zap size={40} color="rgba(255,255,255,0.8)" style={{ marginBottom: "20px" }} />
          <h2 style={{ fontSize: "36px", fontWeight: 800, color: "white", marginBottom: "16px", letterSpacing: "-0.02em" }}>Ready to convert more visitors?</h2>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.8)", marginBottom: "32px" }}>Join hundreds of teams using Clickward to grow their conversion rates.</p>
          <Link href="/signup" style={{ display: "inline-block", padding: "14px 36px", background: "white", color: "var(--primary)", borderRadius: "10px", textDecoration: "none", fontSize: "16px", fontWeight: 700 }}>
            Get started free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MousePointerClick size={13} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "15px" }}>Clickward</span>
        </div>
        <div style={{ fontSize: "13px", color: "var(--muted)" }}>
          &copy; {new Date().getFullYear()} Clickward. All rights reserved.
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy", "Terms", "Contact"].map((item) => (
            <a key={item} href="#" style={{ fontSize: "13px", color: "var(--muted)", textDecoration: "none" }}>{item}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
