"use client";

import React, { useState } from "react";
import { Genre, Genres, Region } from "@/types";
import { INDIAN_STATES } from "@/lib/region/config";
import { GENRE_COLORS } from "@/lib/utils";
import {
  getUserPreferences,
  saveUserPreferences,
  UserPreferences,
} from "@/lib/recommendation/engine";
import { trackPreferencesSaved } from "@/lib/analytics/posthog";
import {
  Sparkles,
  Check,
  MapPin,
  X,
  Compass,
  Sliders,
  ThumbsUp,
} from "lucide-react";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreferencesUpdated?: () => void;
  currentRegion: Region;
}

export function PreferencesModal({
  isOpen,
  onClose,
  onPreferencesUpdated,
  currentRegion,
}: PreferencesModalProps) {
  const [prefs, setPrefs] = useState<UserPreferences>(() => getUserPreferences());
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>(prefs.favoriteGenres);
  const [selectedState, setSelectedState] = useState<string>(
    prefs.preferredRegion.state || currentRegion.state
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    prefs.preferredRegion.city || currentRegion.city
  );

  if (!isOpen) return null;

  const toggleGenre = (genre: Genre) => {
    if (selectedGenres.includes(genre)) {
      if (selectedGenres.length > 1) {
        setSelectedGenres(selectedGenres.filter((g) => g !== genre));
      }
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSave = () => {
    const updated: UserPreferences = {
      favoriteGenres: selectedGenres,
      preferredRegion: {
        country: "India",
        state: selectedState,
        city: selectedCity,
      },
      hasOnboarded: true,
    };

    saveUserPreferences(updated);
    trackPreferencesSaved(selectedGenres, updated.preferredRegion);

    if (onPreferencesUpdated) {
      onPreferencesUpdated();
    }
    onClose();
  };

  const stateData = INDIAN_STATES.find((s) => s.name === selectedState);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI NEWS PERSONALIZATION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Customize Your Feed Wire
            </h2>
            <p className="text-xs text-muted-foreground">
              Select your priority topics and home region. The Hybrid Recommendation Engine tailors stories using PostHog reading telemetry.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Topic Preferences */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span className="uppercase tracking-wider">Favorite News Topics</span>
            <span className="text-muted-foreground font-normal">
              {selectedGenres.length} selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Genres.map((g) => {
              const isSelected = selectedGenres.includes(g);
              const color = GENRE_COLORS[g] || GENRE_COLORS.breaking;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  className={`p-2.5 rounded-xl text-xs font-bold capitalize transition-all border flex items-center justify-between ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  <span>{g}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Regional Affinity */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Priority Geographic Hub</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                State / Territory
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  const st = INDIAN_STATES.find((s) => s.name === e.target.value);
                  if (st && st.cities[0]) setSelectedCity(st.cities[0].name);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted/40 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                District / City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted/40 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {stateData?.cities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply Personalization</span>
          </button>
        </div>
      </div>
    </div>
  );
}
