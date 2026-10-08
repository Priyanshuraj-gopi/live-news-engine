"use client";

import React from "react";
import { CREDIBILITY_LEVEL_NAMES } from "@/lib/credibility/engine";
import { Shield, Award, Sparkles } from "lucide-react";

interface CredibilityBadgeProps {
  level: number;
  score?: number;
  showTitle?: boolean;
  size?: "sm" | "md" | "lg";
}

export function CredibilityBadge({
  level,
  score,
  showTitle = true,
  size = "md",
}: CredibilityBadgeProps) {
  const safeLevel = Math.min(5, Math.max(1, level));
  const meta = CREDIBILITY_LEVEL_NAMES[safeLevel] || CREDIBILITY_LEVEL_NAMES[1];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3.5 py-1.5 text-sm gap-2",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border ${sizeClasses[size]} ${meta.badgeClass} transition-all`}
      title={`Credibility Level ${safeLevel}: ${meta.title}${score !== undefined ? ` (${score}/100 pts)` : ""}`}
    >
      <Shield className={size === "sm" ? "w-2.5 h-2.5" : size === "md" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      <span>Lvl {safeLevel}</span>
      {showTitle && <span className="opacity-80 font-normal">• {meta.title}</span>}
      {score !== undefined && (
        <span className="font-mono text-[10px] opacity-90 ml-0.5">[{score}]</span>
      )}
    </span>
  );
}
