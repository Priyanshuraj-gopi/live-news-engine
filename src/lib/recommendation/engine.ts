import { Story, Genre, Region } from "@/types";
import { REGIONS_DATA, DEFAULT_REGION } from "@/lib/region/config";
import { calculateUserGenreAffinity, getRecentUserSignals } from "@/lib/analytics/posthog";

export interface UserPreferences {
  favoriteGenres: Genre[];
  preferredRegion: Region;
  hasOnboarded: boolean;
}

export interface StoryPersonalizationBreakdown {
  storyId: string;
  totalScore: number;
  genreScore: number;
  geoScore: number;
  velocityScore: number;
  isPersonalizedMatch: boolean;
}

const LOCAL_STORAGE_PREFS_KEY = "newsengine_user_preferences";

/**
 * Retrieve user explicit preferences (Cold-Start onboarding)
 */
export function getUserPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return {
      favoriteGenres: ["politics", "markets", "tech"],
      preferredRegion: DEFAULT_REGION,
      hasOnboarded: false,
    };
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return {
    favoriteGenres: ["politics", "markets", "tech"],
    preferredRegion: DEFAULT_REGION,
    hasOnboarded: false,
  };
}

/**
 * Save user explicit preferences
 */
export function saveUserPreferences(prefs: UserPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {}
}

/**
 * Haversine formula distance between two coordinates in kilometers
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Compute geographic proximity score (0.1 to 1.0)
 * Uses exact city match (1.0), same state match (0.8), or Haversine distance decay
 */
export function computeGeoProximityScore(
  userRegion: Region,
  storyRegion?: Region
): number {
  if (!storyRegion || !storyRegion.city) return 0.5; // Ambient default for national wire

  // Exact city match
  if (
    userRegion.city.toLowerCase() === storyRegion.city.toLowerCase() &&
    userRegion.state.toLowerCase() === storyRegion.state.toLowerCase()
  ) {
    return 1.0;
  }

  // Same state match
  if (userRegion.state.toLowerCase() === storyRegion.state.toLowerCase()) {
    return 0.8;
  }

  // Look up coordinates from REGIONS_DATA
  const userStateData = REGIONS_DATA[userRegion.state];
  const userCityData = userStateData?.cities.find(
    (c) => c.name.toLowerCase() === userRegion.city.toLowerCase()
  );

  const storyStateData = REGIONS_DATA[storyRegion.state];
  const storyCityData = storyStateData?.cities.find(
    (c) => c.name.toLowerCase() === storyRegion.city.toLowerCase()
  );

  if (userCityData && storyCityData) {
    const dist = calculateDistanceKm(
      userCityData.lat,
      userCityData.lng,
      storyCityData.lat,
      storyCityData.lng
    );
    // Exponential / linear distance decay across India (~3000km span)
    return Math.max(0.1, Number((1 - dist / 2000).toFixed(3)));
  }

  return 0.4;
}

/**
 * Score an individual story according to the agreed Hybrid Formula:
 * Score = 0.40 * GenreAffinity + 0.35 * GeoProximity + 0.25 * Velocity
 */
export function scoreStoryForUser(
  story: Story,
  genreAffinityMap: Record<Genre, number>,
  userRegion: Region,
  favoriteGenres: Genre[]
): StoryPersonalizationBreakdown {
  const recentSignals = getRecentUserSignals();
  const hasReadingHistory = recentSignals.length >= 3;

  // 1. Genre Score (0.0 to 1.0)
  let genreScore = 0.2;
  if (hasReadingHistory && genreAffinityMap[story.genre] !== undefined) {
    // Scale normalized affinity with baseline
    genreScore = Math.min(1.0, genreAffinityMap[story.genre] * 2.5);
  } else {
    // Cold start explicit fallback
    genreScore = favoriteGenres.includes(story.genre) ? 0.85 : 0.25;
  }

  // 2. Geographic Proximity Score (0.1 to 1.0)
  const geoScore = computeGeoProximityScore(userRegion, story.region);

  // 3. Velocity / Freshness Score (0.0 to 1.0)
  const velocityScore = Math.min(1.0, Math.max(0.1, story.velocityScore || 0.5));

  // 4. Combined Weighted Score
  // 40% Genre + 35% Geo + 25% Velocity
  const totalScore = Number(
    (0.4 * genreScore + 0.35 * geoScore + 0.25 * velocityScore).toFixed(4)
  );

  return {
    storyId: story.id,
    totalScore,
    genreScore,
    geoScore,
    velocityScore,
    isPersonalizedMatch: totalScore >= 0.55,
  };
}

/**
 * Rank stories using the hybrid personalization model
 */
export function rankStoriesForUser(
  stories: Story[],
  userRegion: Region,
  customAffinityMap?: Record<Genre, number>,
  customFavorites?: Genre[]
): { rankedStories: Story[]; breakdowns: Map<string, StoryPersonalizationBreakdown> } {
  const affinityMap = customAffinityMap || calculateUserGenreAffinity();
  const prefs = getUserPreferences();
  const favorites = customFavorites || prefs.favoriteGenres;

  const breakdowns = new Map<string, StoryPersonalizationBreakdown>();

  stories.forEach((story) => {
    const breakdown = scoreStoryForUser(story, affinityMap, userRegion, favorites);
    breakdowns.set(story.id, breakdown);
  });

  const rankedStories = [...stories].sort((a, b) => {
    const scoreA = breakdowns.get(a.id)?.totalScore || 0;
    const scoreB = breakdowns.get(b.id)?.totalScore || 0;
    return scoreB - scoreA;
  });

  return { rankedStories, breakdowns };
}
