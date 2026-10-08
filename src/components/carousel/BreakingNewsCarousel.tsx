"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Story, LanguageCode } from "@/types";
import { GENRE_COLORS, formatTimeAgo } from "@/lib/utils";
import { GenreMotionScene } from "./GenreMotionScene";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowRight,
  Flame,
  Radio,
  MapPin,
  Clock,
} from "lucide-react";

interface BreakingNewsCarouselProps {
  stories: Story[];
  language: LanguageCode;
}

export function BreakingNewsCarousel({ stories, language }: BreakingNewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = stories.length;
  const currentStory = stories[currentIndex];

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, total, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  if (!currentStory) return null;

  const translation = currentStory.versions?.[language] || currentStory.versions?.en;
  if (!translation) return null;

  const genreColor = GENRE_COLORS[currentStory.genre] || GENRE_COLORS.breaking;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-border bg-card group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Breaking news carousel"
    >
      {/* Dynamic Background Motion Atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/80 via-black/60 to-black/90 pointer-events-none" />
      <div className="absolute inset-0 z-0 mix-blend-screen pointer-events-none">
        <GenreMotionScene genre={currentStory.genre} />
      </div>

      {/* Main Slide Content */}
      <div className="relative z-10 p-6 sm:p-10 md:p-12 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between text-white">
        {/* Top bar: Live tag, genre badge, timer controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-red-600 text-white shadow-lg animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              BREAKING
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border backdrop-blur-md ${genreColor.bg} ${genreColor.text} ${genreColor.border}`}
            >
              {currentStory.genre}
            </span>
            {currentStory.region?.city && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-slate-300 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
                <MapPin className="w-3 h-3 text-red-400" />
                {currentStory.region.city}
              </span>
            )}
          </div>

          {/* Autoplay & counter */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>
              {currentIndex + 1} / {total}
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              title={isPaused ? "Play carousel" : "Pause carousel"}
              aria-label={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Story Body */}
        <div className="my-6 space-y-4 max-w-3xl">
          <Link href={`/story/${currentStory.id}`} className="group/title block">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight group-hover/title:text-red-400 transition-colors line-clamp-3">
              {translation.headline}
            </h1>
          </Link>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
            {translation.summary}
          </p>
        </div>

        {/* Footer: Metadata & Action button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">{currentStory.source.name}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatTimeAgo(currentStory.publishedAt, language)}
            </span>
            {currentStory.velocityScore > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Flame className="w-3.5 h-3.5" />
                  Velocity {(currentStory.velocityScore * 100).toFixed(0)}%
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <Link
              href={`/story/${currentStory.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-red-500/20 active:scale-95"
            >
              <span>Read Full Story</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Prev / Next controls */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Previous story"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Next story"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Progress Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {stories.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all ${
              currentIndex === idx ? "w-8 bg-red-500" : "w-2 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
