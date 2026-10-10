"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Story, LanguageCode } from "@/types";
import { GENRE_COLORS, formatTimeAgo } from "@/lib/utils";
import { GenreMotionScene } from "../carousel/GenreMotionScene";
import { WebSpeechPlayer } from "../media/WebSpeechPlayer";
import { RemotionSummaryPlayer } from "../media/RemotionSummaryPlayer";
import { trackStoryDwell, trackStoryInteraction } from "@/lib/analytics/posthog";
import {
  ExternalLink,
  Share2,
  Bookmark,
  Volume2,
  Video,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle,
  Brain,
} from "lucide-react";

interface InshortsCardProps {
  story: Story;
  language: LanguageCode;
  isActive: boolean;
}

export function InshortsCard({ story, language, isActive }: InshortsCardProps) {
  const [showTakeaways, setShowTakeaways] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  // PostHog Reading Dwell Time Tracking
  React.useEffect(() => {
    if (!isActive) return;
    const startTime = Date.now();
    return () => {
      const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
      if (elapsedSeconds >= 2) {
        trackStoryDwell(story.id, story.genre, elapsedSeconds, story.region, language);
      }
    };
  }, [isActive, story.id, story.genre, story.region, language]);

  const translation = story.versions?.[language] || story.versions?.en;
  if (!translation) return null;

  const genreColor = GENRE_COLORS[story.genre] || GENRE_COLORS.breaking;

  const handleShare = async () => {
    trackStoryInteraction(story.id, story.genre, "share", story.region);
    const url = typeof window !== "undefined" ? `${window.location.origin}/story/${story.id}` : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: translation.headline,
          text: translation.summary,
          url,
        });
      } catch (e) {
        // user cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto h-[78vh] sm:h-[82vh] max-h-[750px] bg-card text-card-foreground rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col justify-between select-none">
      {/* Background Graphic Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30">
        <GenreMotionScene genre={story.genre} />
      </div>

      {/* Card Header */}
      <div className="relative z-10 p-5 sm:p-6 pb-2 border-b border-border/40 bg-card/60 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${genreColor.bg} ${genreColor.text} ${genreColor.border}`}
            >
              {story.genre}
            </span>
            {story.region?.city && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                <MapPin className="w-3 h-3 text-red-500" />
                {story.region.city}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-full border border-border hover:bg-muted transition-colors ${
                bookmarked ? "text-amber-500 bg-amber-500/10" : "text-muted-foreground"
              }`}
              title="Bookmark story"
              aria-label="Bookmark"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative"
              title="Share story"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
              {copied && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-semibold bg-emerald-600 text-white rounded shadow-md whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Headline */}
        <Link href={`/story/${story.id}`}>
          <h2 className="text-lg sm:text-xl font-bold leading-snug tracking-tight hover:text-primary transition-colors line-clamp-3">
            {translation.headline}
          </h2>
        </Link>
      </div>

      {/* Card Body: ~60-Word Summary or Media Player */}
      <div className="relative z-10 flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
        {showVideo ? (
          <div className="space-y-3">
            <RemotionSummaryPlayer
              translation={translation}
              genre={story.genre}
              source={story.source.name}
              cityName={story.region?.city}
            />
            <button
              onClick={() => setShowVideo(false)}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Back to text summary
            </button>
          </div>
        ) : showAudio ? (
          <div className="space-y-4">
            <WebSpeechPlayer
              textToRead={`${translation.headline}. ${translation.summary}`}
              language={language}
              title="Audio Brief"
            />
            <p className="text-sm text-foreground/90 leading-relaxed font-normal">
              {translation.summary}
            </p>
            <button
              onClick={() => setShowAudio(false)}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Hide audio player
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-normal">
              {translation.summary}
            </p>

            {/* AI Highlights Accordion */}
            <div className="rounded-xl border border-border/80 bg-muted/30 overflow-hidden">
              <button
                onClick={() => setShowTakeaways(!showTakeaways)}
                className="w-full flex items-center justify-between p-3 text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors"
              >
                <span className="flex items-center gap-1.5 text-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  Key Takeaways ({translation.takeaways.length})
                </span>
                {showTakeaways ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showTakeaways && (
                <ul className="p-3 pt-0 space-y-2 border-t border-border/40 text-xs text-foreground/80">
                  {translation.takeaways.map((point: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Media Quick-Action Pills */}
      {!showVideo && (
        <div className="px-5 sm:px-6 py-2 flex items-center gap-2 border-t border-border/30 bg-muted/10">
          <button
            onClick={() => {
              setShowAudio(!showAudio);
              setShowVideo(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              showAudio
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border bg-card hover:bg-muted text-foreground"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{showAudio ? "Playing" : "Listen"}</span>
          </button>

          <button
            onClick={() => {
              setShowVideo(!showVideo);
              setShowAudio(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              showVideo
                ? "bg-red-600 text-white border-red-600"
                : "border-border bg-card hover:bg-muted text-foreground"
            }`}
          >
            <Video className="w-3.5 h-3.5 text-red-500" />
            <span>AI Reel</span>
          </button>

          <Link
            href={`/games?tab=quiz&storyId=${story.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-border bg-card hover:border-primary hover:text-primary transition-colors ml-auto"
            title="Take an interactive quiz on this story"
          >
            <Brain className="w-3.5 h-3.5 text-primary" />
            <span>Story Quiz</span>
          </Link>
        </div>
      )}

      {/* Card Footer */}
      <div className="relative z-10 p-4 sm:p-5 border-t border-border bg-muted/30 flex items-center justify-between text-xs">
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{story.source.name}</span>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(story.publishedAt, language)}
          </span>
        </div>

        <Link
          href={`/story/${story.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-sm active:scale-95"
        >
          <span>Read Full Story</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
