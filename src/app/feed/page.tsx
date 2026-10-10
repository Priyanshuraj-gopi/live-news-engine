"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLiveStories } from "@/hooks/useLiveStories";
import { rankStoriesForUser } from "@/lib/recommendation/engine";
import { ArrowLeft, Clock, RefreshCw, Sparkles } from "lucide-react";
import { QuizBanner } from "@/components/games/QuizBanner";

const InshortsFeed = dynamic(
  () => import("@/components/feed/InshortsFeed").then((module) => module.InshortsFeed),
  {
    ssr: false,
    loading: () => <div className="story-skeleton feed-loading" aria-live="polite">Loading live newsroom…</div>,
  }
);

export default function FeedPage() {
  const { language, region } = useAuth();
  const { stories, isSyncing, usingLiveWire, syncLiveNews, lastSynced } = useLiveStories();
  const [isPersonalized, setIsPersonalized] = useState(true);

  const displayStories = useMemo(() => {
    if (isPersonalized) return rankStoriesForUser(stories, region).rankedStories;
    return stories;
  }, [stories, isPersonalized, region]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-2 sm:py-4">
      <div className="max-w-xl mx-auto w-full px-4 flex items-center justify-between mb-2">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md">
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Grid</span>
        </Link>

        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-xl border border-border">
          <button onClick={() => setIsPersonalized(true)} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${isPersonalized ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <Sparkles className="w-3 h-3" />
            <span>For You</span>
          </button>
          <button onClick={() => setIsPersonalized(false)} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${!isPersonalized ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <Clock className="w-3 h-3" />
            <span>Latest</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => void syncLiveNews()} disabled={isSyncing} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Fetch latest live stories" aria-label="Fetch latest live stories">
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-red-500" : ""}`} />
          </button>
        </div>
      </div>

      <div className="max-w-xl w-full mx-auto px-4 mb-2 flex flex-col gap-2">
        <QuizBanner />
        <div className="text-center text-[10px] text-muted-foreground" aria-live="polite">
          {isSyncing ? "Checking Zee News wire…" : usingLiveWire && lastSynced ? `Live Zee News headlines · checked ${lastSynced.toLocaleTimeString()}` : lastSynced ? "Offline demo headlines · live wire unavailable" : "Live wire ready"}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <InshortsFeed stories={displayStories} language={language} />
      </div>
    </div>
  );
}
