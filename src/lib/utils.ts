import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(timestamp: number | string, lang: string = "en"): string {
  const timeNum = typeof timestamp === "string" ? new Date(timestamp).getTime() : timestamp;
  const diffMs = Date.now() - timeNum;
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export const GENRE_COLORS: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  breaking: { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/30", accent: "#EF4444" },
  politics: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/30", accent: "#F59E0B" },
  markets: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/30", accent: "#10B981" },
  tech: { bg: "bg-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/30", accent: "#06B6D4" },
  sports: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30", accent: "#3B82F6" },
  entertainment: { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/30", accent: "#8B5CF6" },
  weather: { bg: "bg-sky-500/10", text: "text-sky-500", border: "border-sky-500/30", accent: "#0EA5E9" },
  crime: { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/30", accent: "#F43F5E" },
  health: { bg: "bg-teal-500/10", text: "text-teal-500", border: "border-teal-500/30", accent: "#14B8A6" },
};
