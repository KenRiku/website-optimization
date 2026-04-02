import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";
import { Toaster } from "react-hot-toast";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Clickward — Automated Website Optimization",
  description:
    "Drop in one script tag. AI finds where visitors drop off, writes better headlines and CTAs, and A/B tests them automatically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable} h-full`}>
      <body className="min-h-full antialiased font-sans">
        <SessionProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1e1e2e",
                color: "#e2e8f0",
                border: "1px solid rgba(79,70,229,0.3)",
                borderRadius: "8px",
                fontFamily: "var(--font-sans)",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
