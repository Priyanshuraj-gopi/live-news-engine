import posthog from "posthog-js";
import { Genre, Region, LanguageCode } from "@/types";

// PostHog public client configuration
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let isPostHogInitialized = false;

export function initPostHog(): void {
  if (typeof window === "undefined" || isPostHogInitialized) return;

  if (POSTHOG_KEY) {
    try {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: false, // Keep clean programmatic event capture
      });
      isPostHogInitialized = true;
    } catch (e) {
      console.warn("PostHog initialization notice:", e);
    }
  }
}

export interface UserEventSignal {
  storyId: string;
  genre: Genre;
  dwellSeconds?: number;
  interactionType?: "read_more" | "share" | "chat" | "bookmark";
  region?: Region;
  language?: LanguageCode;
  timestamp: number;
}

const LOCAL_STORAGE_SIGNALS_KEY = "newsengine_posthog_user_signals";

/**
 * Track reading dwell time on a story
 */
export function trackStoryDwell(
  storyId: string,
  genre: Genre,
  dwellSeconds: number,
  region?: Region,
  language?: LanguageCode
): void {
  const eventPayload = {
    story_id: storyId,
    genre,
    dwell_seconds: dwellSeconds,
    city: region?.city,
    state: region?.state,
    language,
    timestamp: Date.now(),
  };

  // 1. PostHog Event Capture
  if (typeof window !== "undefined" && isPostHogInitialized) {
    try {
      posthog.capture("news_story_dwell", eventPayload);
    } catch (e) {}
  }

  // 2. Local buffer persistence for zero-latency client-side personalization
  recordLocalSignal({
    storyId,
    genre,
    dwellSeconds,
    region,
    language,
    timestamp: Date.now(),
  });
}

/**
 * Track user explicit interaction (Read More, Share, Debate participation)
 */
export function trackStoryInteraction(
  storyId: string,
  genre: Genre,
  interactionType: "read_more" | "share" | "chat" | "bookmark",
  region?: Region
): void {
  const eventPayload = {
    story_id: storyId,
    genre,
    interaction_type: interactionType,
    city: region?.city,
    state: region?.state,
    timestamp: Date.now(),
  };

  if (typeof window !== "undefined" && isPostHogInitialized) {
    try {
      posthog.capture("news_story_interaction", eventPayload);
    } catch (e) {}
  }

  recordLocalSignal({
    storyId,
    genre,
    interactionType,
    region,
    timestamp: Date.now(),
  });
}

/**
 * Track 1-tap user preferences saved
 */
export function trackPreferencesSaved(
  favoriteGenres: Genre[],
  preferredRegion?: Region
): void {
  if (typeof window !== "undefined" && isPostHogInitialized) {
    try {
      posthog.capture("user_preferences_updated", {
        favorite_genres: favoriteGenres,
        preferred_city: preferredRegion?.city,
        preferred_state: preferredRegion?.state,
        timestamp: Date.now(),
      });
    } catch (e) {}
  }
}

/**
 * Store in local circular buffer (up to 100 recent signals)
 */
function recordLocalSignal(signal: UserEventSignal): void {
  if (typeof localStorage === "undefined") return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SIGNALS_KEY);
    const existing: UserEventSignal[] = raw ? JSON.parse(raw) : [];
    existing.unshift(signal);
    const bounded = existing.slice(0, 100);
    localStorage.setItem(LOCAL_STORAGE_SIGNALS_KEY, JSON.stringify(bounded));
  } catch (e) {}
}

/**
 * Retrieve recent local interaction signals
 */
export function getRecentUserSignals(): UserEventSignal[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SIGNALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Compute real-time reader Genre Affinity map (0.0 to 1.0)
 * Evaluates dwell duration and interactions from PostHog local stream
 */
export function calculateUserGenreAffinity(): Record<Genre, number> {
  const signals = getRecentUserSignals();
  const genreWeights: Record<Genre, number> = {
    politics: 0,
    markets: 0,
    weather: 0,
    tech: 0,
    sports: 0,
    entertainment: 0,
    crime: 0,
    health: 0,
  };

  if (signals.length === 0) {
    // Cold start baseline
    return genreWeights;
  }

  let totalPoints = 0;

  signals.forEach((sig) => {
    let points = 1;
    if (sig.dwellSeconds) {
      // Dwell time weighting: > 30s is 3pts, > 10s is 2pts, < 10s is 1pt
      points += sig.dwellSeconds > 30 ? 3 : sig.dwellSeconds > 10 ? 2 : 1;
    }
    if (sig.interactionType === "share") points += 4;
    if (sig.interactionType === "chat") points += 3;
    if (sig.interactionType === "read_more") points += 2;

    if (genreWeights[sig.genre] !== undefined) {
      genreWeights[sig.genre] += points;
      totalPoints += points;
    }
  });

  if (totalPoints === 0) return genreWeights;

  // Normalize each genre to 0.0 - 1.0
  const normalized: Record<Genre, number> = { ...genreWeights };
  (Object.keys(normalized) as Genre[]).forEach((g) => {
    normalized[g] = Number((genreWeights[g] / totalPoints).toFixed(3));
  });

  return normalized;
}
