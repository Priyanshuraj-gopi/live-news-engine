"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Story, LanguageCode, Genre } from "@/types";
import { InshortsCard } from "./InshortsCard";
import { ChevronUp, ChevronDown, Filter, Radio } from "lucide-react";

interface InshortsFeedProps {
  stories: Story[];
  language: LanguageCode;
}

export function InshortsFeed({ stories, language }: InshortsFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [direction, setDirection] = useState<number>(0);

  const filteredStories =
    selectedGenre === "all"
      ? stories
      : stories.filter((s) => s.genre === selectedGenre);

  const total = filteredStories.length;
  const currentStory = filteredStories[currentIndex] || filteredStories[0];

  const handleNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, total]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "j") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "k") {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Swipe gesture handler
  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold) {
      handleNext();
    } else if (info.offset.y > threshold) {
      handlePrev();
    }
  };

  const genres: { id: string; label: string }[] = [
    { id: "all", label: "All Briefs" },
    { id: "breaking", label: "Breaking" },
    { id: "politics", label: "Politics" },
    { id: "markets", label: "Markets" },
    { id: "tech", label: "Tech" },
    { id: "sports", label: "Sports" },
    { id: "entertainment", label: "Entertainment" },
    { id: "health", label: "Health" },
    { id: "weather", label: "Weather" },
  ];

  if (!currentStory) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-muted-foreground gap-3">
        <Radio className="w-8 h-8 animate-pulse text-primary" />
        <p className="text-sm">No stories available in this category.</p>
        <button
          onClick={() => setSelectedGenre("all")}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
        >
          View all stories
        </button>
      </div>
    );
  }

  const variants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.25 },
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.2 },
    }),
  };

  return (
    <div className="relative w-full flex flex-col items-center py-4 px-3 sm:px-4">
      {/* Category Filter Pills */}
      <div className="w-full max-w-xl mb-4 overflow-x-auto pb-1 flex items-center gap-1.5 scrollbar-none">
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => {
              setSelectedGenre(g.id);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
              selectedGenre === g.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border bg-card/60 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Main Stack Container with Drag Gestures */}
      <div className="relative w-full max-w-xl flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStory.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.25}
            onDragEnd={handleDragEnd}
            className="w-full cursor-grab active:cursor-grabbing"
          >
            <InshortsCard story={currentStory} language={language} isActive={true} />
          </motion.div>
        </AnimatePresence>

        {/* Side Floating Controls on Desktop */}
        <div className="hidden lg:flex flex-col items-center gap-2 absolute -right-16 top-1/2 -translate-y-1/2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2.5 rounded-full bg-card border border-border shadow-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all disabled:opacity-30 disabled:pointer-events-none"
            title="Previous story (Arrow Up)"
            aria-label="Previous story"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <span className="text-[11px] font-semibold text-muted-foreground py-1">
            {currentIndex + 1} / {total}
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex >= total - 1}
            className="p-2.5 rounded-full bg-card border border-border shadow-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all disabled:opacity-30 disabled:pointer-events-none"
            title="Next story (Arrow Down)"
            aria-label="Next story"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Hint Banner */}
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ChevronUp className="w-3.5 h-3.5" />
          <ChevronDown className="w-3.5 h-3.5" />
          Swipe or use ↑ ↓ keys
        </span>
        <span>•</span>
        <span>
          Story {currentIndex + 1} of {total}
        </span>
      </div>
    </div>
  );
}
