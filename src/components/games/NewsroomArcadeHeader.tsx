"use client";

import React, { useEffect, useState } from "react";
import { loadIQState, RANK_TIERS } from "@/lib/games/engine";
import { NewsroomIQState } from "@/lib/games/types";
import { Award, Flame, Zap, CheckCircle2, TrendingUp } from "lucide-react";

export function NewsroomArcadeHeader() {
  const [iqState, setIqState] = useState<NewsroomIQState>(loadIQState());

  useEffect(() => {
    const handleUpdate = () => {
      setIqState(loadIQState());
    };
    window.addEventListener("newsengine:iq_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("newsengine:iq_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const nextTier = RANK_TIERS.find((t) => t.minPoints > iqState.totalPoints) || RANK_TIERS[RANK_TIERS.length - 1];
  const currentTier = RANK_TIERS.slice().reverse().find((t) => iqState.totalPoints >= t.minPoints) || RANK_TIERS[0];
  const progressPercent = nextTier.minPoints > currentTier.minPoints
    ? Math.min(100, Math.round(((iqState.totalPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100))
    : 100;

  const accuracy = iqState.totalAnswered > 0
    ? Math.round((iqState.totalCorrect / iqState.totalAnswered) * 100)
    : 100;

  return (
    <div className="arcade-header w-full bg-[#fffdf9] border border-[#dedbd4] p-5 sm:p-6 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#a91522] tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-[#d9232e] animate-pulse" />
            <span>Editorial Intelligence Arcade</span>
            <span className="text-[#687078]">·</span>
            <span className="text-[#687078]">Community Engagement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#202124] tracking-tight">
            Newsroom <em>Arcade</em>
          </h1>
          <p className="text-xs sm:text-sm text-[#687078] max-w-xl mt-1">
            Test your news literacy with live wire quizzes, current affairs crosswords, and editorial fact-checking challenges.
          </p>
        </div>

        {/* User Stats Card */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 bg-[#f7f4ef] p-3 sm:p-4 border border-[#dedbd4]">
          {/* Newsroom IQ */}
          <div className="flex items-center gap-2.5 pr-3 border-r border-[#dedbd4]">
            <div className="w-9 h-9 rounded-full bg-[#d9232e]/10 text-[#d9232e] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#687078]">Newsroom IQ</div>
              <div className="text-lg font-bold text-[#202124] leading-tight">{iqState.totalPoints} <span className="text-[10px] text-[#a91522]">pts</span></div>
            </div>
          </div>

          {/* Credibility Rank */}
          <div className="flex items-center gap-2.5 pr-3 border-r border-[#dedbd4]">
            <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#687078]">Credibility Rank</div>
              <div className="text-xs sm:text-sm font-bold text-[#202124] leading-tight">{iqState.rankTitle}</div>
            </div>
          </div>

          {/* Daily Streak */}
          <div className="flex items-center gap-2.5 pr-3 border-r border-[#dedbd4]">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#687078]">Daily Streak</div>
              <div className="text-sm font-bold text-[#202124] leading-tight">{iqState.dailyStreak} {iqState.dailyStreak === 1 ? "day" : "days"}</div>
            </div>
          </div>

          {/* Accuracy */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#687078]">Fact Accuracy</div>
              <div className="text-sm font-bold text-[#202124] leading-tight">{accuracy}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="mt-4 pt-3 border-t border-[#dedbd4] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#687078]">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-[#d9232e]" />
          <span>Next Rank: <strong>{nextTier.title}</strong> ({nextTier.minPoints} pts required)</span>
        </div>
        <div className="flex items-center gap-2 sm:w-64">
          <div className="flex-1 h-2 bg-[#ece8e1] overflow-hidden">
            <div
              className="h-full bg-[#d9232e] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-bold text-[#202124] text-[10px]">{progressPercent}%</span>
        </div>
      </div>
    </div>
  );
}
