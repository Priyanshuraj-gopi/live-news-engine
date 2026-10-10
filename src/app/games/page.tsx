"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLiveStories } from "@/hooks/useLiveStories";
import { GameTab } from "@/lib/games/types";
import { NewsroomArcadeHeader } from "@/components/games/NewsroomArcadeHeader";
import { LiveNewsQuiz } from "@/components/games/LiveNewsQuiz";
import { AffairsCrossword } from "@/components/games/AffairsCrossword";
import { TwoTruthsAndLie } from "@/components/games/TwoTruthsAndLie";
import { Brain, Grid3X3, ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";

function GamesContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as GameTab) || "quiz";
  const initialStoryId = searchParams.get("storyId") || undefined;

  const [activeTab, setActiveTab] = useState<GameTab>(initialTab);
  const [targetStoryId, setTargetStoryId] = useState<string | undefined>(initialStoryId);

  const { language } = useAuth();
  const { stories, isSyncing, usingLiveWire, syncLiveNews } = useLiveStories();

  // Sync tab with URL search parameter if it changes
  useEffect(() => {
    const tabParam = searchParams.get("tab") as GameTab;
    if (tabParam && (tabParam === "quiz" || tabParam === "crossword" || tabParam === "twotruths")) {
      setActiveTab(tabParam);
    }
    const sId = searchParams.get("storyId");
    if (sId) {
      setTargetStoryId(sId);
    }
  }, [searchParams]);

  return (
    <div className="site-shell arcade-page min-h-[calc(100vh-140px)] py-6 sm:py-8 px-4 max-w-5xl mx-auto">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#687078] hover:text-[#202124] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Live Wire Feed</span>
        </Link>

        <div className="flex items-center gap-2 text-[10px] text-[#687078]">
          <span className="w-2 h-2 rounded-full bg-[#d9232e] animate-pulse" />
          <span>
            {isSyncing ? "Syncing Wire..." : usingLiveWire ? `${stories.length} Live Stories Active` : "Offline Intelligence"}
          </span>
          <button
            onClick={() => void syncLiveNews()}
            disabled={isSyncing}
            className="p-1 hover:text-[#202124] transition-colors"
            title="Refresh wire stories"
            aria-label="Refresh wire stories"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin text-[#d9232e]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Arcade Stats Masthead */}
      <NewsroomArcadeHeader />

      {/* Game Selector Tabs */}
      <div className="arcade-tabs flex items-center border-b border-[#dedbd4] mb-8 overflow-x-auto" role="tablist" aria-label="Newsroom games">
        <button
          onClick={() => {
            setActiveTab("quiz");
            setTargetStoryId(undefined);
          }}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === "quiz"
              ? "border-[#d9232e] text-[#d9232e] bg-[#d9232e]/5"
              : "border-transparent text-[#687078] hover:text-[#202124] hover:bg-[#f7f4ef]"
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Live News Quiz</span>
          <span className="px-1.5 py-0.2 bg-[#d9232e] text-white text-[9px] rounded-full">
            Live
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("crossword");
            setTargetStoryId(undefined);
          }}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === "crossword"
              ? "border-[#d9232e] text-[#d9232e] bg-[#d9232e]/5"
              : "border-transparent text-[#687078] hover:text-[#202124] hover:bg-[#f7f4ef]"
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
          <span>Current Affairs Crossword</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("twotruths");
            setTargetStoryId(undefined);
          }}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === "twotruths"
              ? "border-[#d9232e] text-[#d9232e] bg-[#d9232e]/5"
              : "border-transparent text-[#687078] hover:text-[#202124] hover:bg-[#f7f4ef]"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>2 Truths &amp; 1 Lie</span>
        </button>
      </div>

      {/* Tab Panels */}
      <main className="w-full">
        {activeTab === "quiz" && (
          <LiveNewsQuiz
            stories={stories}
            language={language}
            storyId={targetStoryId}
            onClearStoryId={() => setTargetStoryId(undefined)}
          />
        )}

        {activeTab === "crossword" && <AffairsCrossword />}

        {activeTab === "twotruths" && <TwoTruthsAndLie />}
      </main>
    </div>
  );
}

export default function GamesPage() {
  return (
    <Suspense
      fallback={
        <div className="site-shell min-h-[60vh] flex items-center justify-center text-xs text-[#687078]">
          Loading Newsroom Arcade...
        </div>
      }
    >
      <GamesContent />
    </Suspense>
  );
}
