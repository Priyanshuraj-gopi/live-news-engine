"use client";

import React from "react";
import { ExternalLink, Sparkles, ShieldCheck } from "lucide-react";

interface SponsoredCardProps {
  variant?: "inshorts" | "grid";
}

export function SponsoredCard({ variant = "grid" }: SponsoredCardProps) {
  if (variant === "inshorts") {
    return (
      <div className="relative w-full max-w-xl mx-auto h-[78vh] sm:h-[82vh] max-h-[750px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-indigo-500/30 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden select-none">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Sponsored Partner
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Zee Brand Wire</span>
          </div>

          <div className="space-y-2 pt-4">
            <h3 className="text-2xl font-black tracking-tight leading-snug">
              Tata Neu Infinity: Experience 10% Unified Cashback Across Digital India
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consolidate everyday flight bookings, electronics, groceries, and healthcare with the unified Tata digital ecosystem.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-3 pt-6 border-t border-indigo-500/20">
          <a
            href="https://www.tatadigital.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg active:scale-95"
          >
            <span>Explore Partner Offer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            <span>Verified Zee Media Brand Partner</span>
          </div>
        </div>
      </div>
    );
  }

  // Grid card format
  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 to-purple-950/20 p-5 shadow-sm flex flex-col justify-between space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Sponsored
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">Partner Post</span>
        </div>

        <h4 className="font-bold text-sm text-foreground leading-snug">
          SBI Yono Global: Zero-Fee NRI Remittances Across 45 Countries
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          Seamlessly transfer funds to India in real-time with zero conversion markups for verified account holders.
        </p>
      </div>

      <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground text-[11px]">State Bank of India</span>
        <a
          href="https://www.sbiyono.sbi"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
        >
          <span>Learn More</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
