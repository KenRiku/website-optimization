import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatNumber(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

// Chi-squared significance test for A/B tests
export function calculateSignificance(
  aConversions: number,
  aSessions: number,
  bConversions: number,
  bSessions: number
): { significant: boolean; confidence: number; winner: "A" | "B" | null } {
  if (aSessions === 0 || bSessions === 0) {
    return { significant: false, confidence: 0, winner: null };
  }

  const aRate = aConversions / aSessions;
  const bRate = bConversions / bSessions;

  // Pooled proportion
  const total = aConversions + bConversions;
  const totalSessions = aSessions + bSessions;
  const p = total / totalSessions;

  if (p === 0 || p === 1) return { significant: false, confidence: 0, winner: null };

  const se = Math.sqrt(p * (1 - p) * (1 / aSessions + 1 / bSessions));
  if (se === 0) return { significant: false, confidence: 0, winner: null };

  const z = Math.abs(aRate - bRate) / se;
  // Approximate p-value from z-score
  const confidence = Math.min(99, Math.round((1 - Math.exp(-0.717 * z - 0.416 * z * z)) * 100));

  return {
    significant: confidence >= 95,
    confidence,
    winner: aRate >= bRate ? "A" : "B",
  };
}
