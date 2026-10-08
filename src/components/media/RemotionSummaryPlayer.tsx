"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { StoryTranslation, Genre } from "@/types";
import { Video, Sparkles } from "lucide-react";

// Dynamically load Remotion Player on client to avoid SSR hydration mismatches
const Player = dynamic(() => import("@remotion/player").then((mod) => mod.Player), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/10] bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-3 border border-border">
      <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-medium">Initializing Remotion Web Player...</span>
    </div>
  ),
});

interface RemotionSummaryPlayerProps {
  translation: StoryTranslation;
  genre: Genre;
  source: string;
  cityName?: string;
}

export function RemotionSummaryPlayer({
  translation,
  genre,
  source,
  cityName,
}: RemotionSummaryPlayerProps) {
  const [mounted, setMounted] = useState(false);
  const [RemotionComp, setRemotionComp] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    import("./RemotionVideoComposition").then((mod) => {
      setRemotionComp(() => mod.RemotionVideoComposition);
    });
  }, []);

  if (!mounted || !RemotionComp) {
    return (
      <div className="w-full aspect-[16/10] bg-slate-950 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2 border border-border">
        <Sparkles className="w-6 h-6 text-red-500 animate-pulse" />
        <span className="text-xs font-semibold">Generating Video Motion Graphic...</span>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border bg-slate-950 shadow-2xl flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-white/10 text-xs text-white">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-bold tracking-wider uppercase text-[11px] text-red-400 flex items-center gap-1">
            <Video className="w-3.5 h-3.5" />
            Remotion Dynamic Reel
          </span>
        </div>
        <span className="text-slate-400 text-[11px]">10s AI Motion Summary • Zero Server Cost</span>
      </div>

      <div className="w-full aspect-[16/10] relative bg-black">
        <Player
          component={RemotionComp}
          inputProps={{
            translation,
            genre,
            source,
            cityName,
          }}
          durationInFrames={300}
          fps={30}
          compositionWidth={720}
          compositionHeight={450}
          style={{
            width: "100%",
            height: "100%",
          }}
          controls
          loop
          autoPlay={false}
        />
      </div>
    </div>
  );
}
