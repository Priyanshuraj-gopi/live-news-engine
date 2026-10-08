"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SEED_STORIES } from "@/data/seedStories";
import { useAuth } from "@/context/AuthContext";
import { useLiveStories } from "@/hooks/useLiveStories";
import { GENRE_COLORS, formatTimeAgo } from "@/lib/utils";
import dynamic from "next/dynamic";
import { WebSpeechPlayer } from "@/components/media/WebSpeechPlayer";

const DebateRoom = dynamic(
  () => import("@/components/debate/DebateRoom").then((mod) => mod.DebateRoom),
  { ssr: false }
);

const RemotionSummaryPlayer = dynamic(
  () => import("@/components/media/RemotionSummaryPlayer").then((mod) => mod.RemotionSummaryPlayer),
  { ssr: false }
);
import {
  ArrowLeft,
  Share2,
  Bookmark,
  MapPin,
  Clock,
  Sparkles,
  ThumbsUp,
  Heart,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useAuth();
  const { stories } = useLiveStories();
  const [reactions, setReactions] = useState<{ helpful: number; insightful: number; heart: number }>({
    helpful: 42,
    insightful: 19,
    heart: 88,
  });
  const [userReacted, setUserReacted] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDebate, setShowDebate] = useState(false);

  const storyId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const story = stories.find((s) => s.id === storyId) || SEED_STORIES.find((s) => s.id === storyId);

  if (!story) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold mb-2">Story Not Found</h1>
        <p className="text-sm text-muted-foreground mb-6">
          The requested news article could not be located or has been archived.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const translation = story.versions?.[language] || story.versions?.en;
  if (!translation) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold mb-2">Translation Unavailable</h1>
        <p className="text-sm text-muted-foreground mb-6">
          This story is not yet available in the selected language.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const genreColor = GENRE_COLORS[story.genre] || GENRE_COLORS.breaking;

  const handleReaction = (type: "helpful" | "insightful" | "heart") => {
    if (userReacted === type) {
      setUserReacted(null);
      setReactions((prev) => ({ ...prev, [type]: prev[type] - 1 }));
    } else {
      if (userReacted) {
        setReactions((prev) => ({
          ...prev,
          [userReacted as "helpful" | "insightful" | "heart"]:
            prev[userReacted as "helpful" | "insightful" | "heart"] - 1,
        }));
      }
      setUserReacted(type);
      setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: translation.headline,
          text: translation.summary,
          url,
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-2 rounded-xl border border-border hover:bg-muted transition-colors ${
              bookmarked ? "text-amber-500 bg-amber-500/10 border-amber-500/30" : "text-muted-foreground"
            }`}
            title="Bookmark"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
            {copied && (
              <span className="absolute -top-7 right-0 px-2 py-0.5 text-[10px] font-semibold bg-emerald-600 text-white rounded shadow-md whitespace-nowrap">
                Link copied!
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Story Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${genreColor.bg} ${genreColor.text} ${genreColor.border}`}
          >
            {story.genre}
          </span>

          {story.region?.city && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              {story.region.city}, {story.region.state}
            </span>
          )}

          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatTimeAgo(story.publishedAt, language)}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-foreground">
          {translation.headline}
        </h1>

        {/* Author / Source Meta Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {story.author?.name ? story.author.name.charAt(0) : "Z"}
            </div>
            <div>
              <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                <span>{story.author?.name || story.source.name}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <span className="text-[11px] text-muted-foreground capitalize">
                {story.author?.role || "Editorial Desk"} • {story.source.name}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-semibold text-foreground">
              {(story.velocityScore * 2500 + 350).toFixed(0)} Reads
            </div>
            <span className="text-[11px] text-emerald-500 font-mono">
              Velocity {(story.velocityScore * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </header>

      {/* Audio Synthesis Player */}
      <section aria-label="Audio brief">
        <WebSpeechPlayer
          textToRead={`${translation.headline}. ${translation.summary}. ${translation.takeaways.join(". ")}`}
          language={language}
          title="AI Voice Brief"
        />
      </section>

      {/* AI Key Takeaways Box */}
      <section className="p-5 sm:p-6 rounded-2xl border border-primary/30 bg-primary/5 space-y-3">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>AI Executive Highlights</span>
        </div>
        <ul className="space-y-2.5">
          {translation.takeaways.map((point: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Remotion Video Reel Component */}
      <section className="space-y-2" aria-label="AI Video Brief">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-red-500" />
          AI Video Reel Motion Summary
        </h2>
        <RemotionSummaryPlayer
          translation={translation}
          genre={story.genre}
          source={story.source.name}
          cityName={story.region?.city}
        />
      </section>

      {/* Full Article Body */}
      <section className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-base font-bold text-foreground">Full Coverage</h2>
        <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-4 text-foreground/90">
          {translation.fullArticle.split("\n\n").map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* Real-time Reaction & Debate Bar */}
      <section className="p-6 rounded-2xl border border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleReaction("helpful")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              userReacted === "helpful"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Helpful ({reactions.helpful})</span>
          </button>

          <button
            onClick={() => handleReaction("insightful")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              userReacted === "insightful"
                ? "bg-amber-500 text-white border-amber-500"
                : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Insightful ({reactions.insightful})</span>
          </button>

          <button
            onClick={() => handleReaction("heart")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              userReacted === "heart"
                ? "bg-rose-500 text-white border-rose-500"
                : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Support ({reactions.heart})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDebate(!showDebate)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:opacity-90 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{showDebate ? "Collapse Debate" : "Join Discussion"}</span>
            {showDebate ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <Link
            href={`/debate?storyId=${story.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-xs transition-all"
            title="Open dedicated arena"
          >
            <span>Full Arena</span>
          </Link>
        </div>
      </section>

      {/* Embedded Live Debate Room */}
      {showDebate && (
        <section className="space-y-3 pt-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span>Community Civil Discourse Room</span>
            </h2>
            <span className="text-xs text-muted-foreground font-mono">
              30s Slow Mode Active
            </span>
          </div>
          <DebateRoom
            storyId={story.id}
            storyHeadline={translation.headline}
          />
        </section>
      )}
    </article>
  );
}
