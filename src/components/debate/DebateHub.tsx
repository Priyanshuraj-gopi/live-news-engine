"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLiveStories } from "@/hooks/useLiveStories";
import { SEED_STORIES } from "@/data/seedStories";
import { DebateRoom } from "@/components/debate/DebateRoom";
import { CredibilityBadge } from "@/components/debate/CredibilityBadge";
import { GENRE_COLORS, formatTimeAgo } from "@/lib/utils";
import { Genre, Story } from "@/types";
import {
  MessageSquare,
  Shield,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Award,
  Users,
  Flame,
  ArrowRight,
  Info,
} from "lucide-react";

function DebateHubContent() {
  const searchParams = useSearchParams();
  const requestedStoryId = searchParams?.get("storyId");
  const { language, role } = useAuth();
  const { stories, loading } = useLiveStories();

  const allStories = stories.length > 0 ? stories : SEED_STORIES;
  const [selectedStoryId, setSelectedStoryId] = useState<string>(
    requestedStoryId || allStories[0]?.id || "seed-story-1"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [showGuidelines, setShowGuidelines] = useState(false);

  // If query param changes, sync selected story
  useEffect(() => {
    if (requestedStoryId) {
      setSelectedStoryId(requestedStoryId);
    }
  }, [requestedStoryId]);

  const filteredStories = allStories.filter((s) => {
    const translation = s.versions?.[language] || s.versions?.en;
    const headline = translation?.headline || "";
    const matchesSearch =
      headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "all" || s.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const activeStory =
    allStories.find((s) => s.id === selectedStoryId) ||
    filteredStories[0] ||
    allStories[0];

  const activeTranslation =
    activeStory?.versions?.[language] || activeStory?.versions?.en;

  const genres = ["all", "breaking", "national", "economy", "technology", "climate", "sports"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-purple-500/10 border border-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>ZEE MEDIA CIVIL DEBATE FORUM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Real-Time Community Dialogue & Credibility Arena
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Engage in verified, toxicity-filtered discussions on national developments. Readers earn credibility tiers through constructive discourse and peer recognition.
            </p>
          </div>

          <button
            onClick={() => setShowGuidelines(!showGuidelines)}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-all shadow-sm"
          >
            <Info className="w-4 h-4 text-primary" />
            <span>{showGuidelines ? "Hide Rules" : "Community Rules"}</span>
          </button>
        </div>

        {/* Community Guidelines Banner */}
        {showGuidelines && (
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-in fade-in duration-200">
            <div className="p-3 rounded-xl bg-card border border-border space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>30-Second Slow Mode</span>
              </div>
              <p className="text-muted-foreground">
                Prevents spam floods and bots. Reflect before posting consecutive thoughts.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>AI Toxicity Sentinel</span>
              </div>
              <p className="text-muted-foreground">
                Every contribution is evaluated in real time. Personal abuse or slurs are quarantined instantly.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Award className="w-3.5 h-3.5 text-primary" />
                <span>Credibility Levels (1-5)</span>
              </div>
              <p className="text-muted-foreground">
                Quality comments receive peer helpful reactions, unlocking verified citizen analyst tiers.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Split Layout: Left Story Selector / Right Live Debate Room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Stories List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center justify-between">
              <span>Debate Rooms</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {filteredStories.length} Active
              </span>
            </h2>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search topics or headlines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Genre Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap capitalize transition-all ${
                    selectedGenre === g
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Stories List */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredStories.map((story) => {
              const trans = story.versions?.[language] || story.versions?.en;
              const isSelected = story.id === activeStory?.id;
              const genreColor = GENRE_COLORS[story.genre] || GENRE_COLORS.breaking;

              return (
                <div
                  key={story.id}
                  onClick={() => setSelectedStoryId(story.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: genreColor?.accent || "#EF4444" }}
                    >
                      {story.genre}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTimeAgo(story.publishedAt)}
                    </span>
                  </div>

                  <h3
                    className={`text-xs font-bold line-clamp-2 leading-snug mb-2 ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {trans?.headline || "Headline loading..."}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                    <span className="truncate max-w-[140px] font-medium">
                      {story.source.name}
                    </span>
                    <div className="flex items-center gap-1 text-primary font-semibold">
                      <MessageSquare className="w-3 h-3" />
                      <span>Join Room</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Debate Arena (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {activeStory ? (
            <div className="space-y-4">
              {/* Active Story Anchor Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{
                        backgroundColor:
                          (GENRE_COLORS[activeStory.genre] || GENRE_COLORS.breaking).accent,
                      }}
                    >
                      {activeStory.genre}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {activeStory.source.name} • {formatTimeAgo(activeStory.publishedAt)}
                    </span>
                  </div>
                  <a
                    href={`/story/${activeStory.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                  {activeTranslation?.headline}
                </h2>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {activeTranslation?.summary}
                </p>
              </div>

              {/* Debate Room Component */}
              <DebateRoom
                storyId={activeStory.id}
                storyHeadline={activeTranslation?.headline || "Current Topic"}
              />
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-border rounded-2xl">
              <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-base font-bold text-foreground">Select a story to debate</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Choose any active news item from the left panel to join the civil discourse.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DebateHub() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            Loading Community Debate Arena...
          </div>
        </div>
      }
    >
      <DebateHubContent />
    </Suspense>
  );
}
