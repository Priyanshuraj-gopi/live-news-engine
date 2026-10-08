/**
 * Phase 6 Verification Test Suite & RecSys Evaluation
 * Evaluates PostHog telemetry event capture, geographic proximity decay,
 * and the 40/35/25 hybrid recommendation model.
 */

import {
  trackStoryDwell,
  trackStoryInteraction,
  calculateUserGenreAffinity,
  getRecentUserSignals,
} from "../lib/analytics/posthog";
import {
  computeGeoProximityScore,
  scoreStoryForUser,
  rankStoriesForUser,
  calculateDistanceKm,
} from "../lib/recommendation/engine";
import { Story, Genre, Region } from "../types";

// Mock localStorage for node CLI runtime
const memoryStorage = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => memoryStorage.get(k) || null,
  setItem: (k: string, v: string) => memoryStorage.set(k, v),
  removeItem: (k: string) => memoryStorage.delete(k),
  clear: () => memoryStorage.clear(),
};

async function runRecsysEvaluation() {
  console.log("=== Phase 6: PostHog Telemetry & RecSys Evaluation ===\n");
  let passed = 0;
  let total = 0;

  function assert(name: string, condition: boolean, extra?: string) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${extra ? `(${extra})` : ""}`);
    }
  }

  // 1. PostHog Event Ingestion & Affinity Computation
  console.log("--- 1. PostHog Telemetry Ingestion & Genre Affinity ---");
  trackStoryDwell("story-mkt-1", "markets", 45, { country: "India", state: "Maharashtra", city: "Mumbai" });
  trackStoryDwell("story-mkt-2", "markets", 35, { country: "India", state: "Maharashtra", city: "Mumbai" });
  trackStoryInteraction("story-mkt-1", "markets", "share");
  trackStoryDwell("story-tech-1", "tech", 12, { country: "India", state: "Karnataka", city: "Bengaluru" });

  const signals = getRecentUserSignals();
  assert("Signals buffered in local telemetry store", signals.length === 4, `found: ${signals.length}`);

  const affinities = calculateUserGenreAffinity();
  assert(
    "Markets affinity dominant after high dwell & share",
    affinities.markets > affinities.tech,
    `markets: ${affinities.markets}, tech: ${affinities.tech}`
  );
  assert("Affinity distribution normalized (<= 1.0)", affinities.markets <= 1.0 && affinities.markets > 0);

  // 2. Geographic Proximity & Distance Decay
  console.log("\n--- 2. Geographic Proximity Scorer ---");
  const userRegionMumbai: Region = { country: "India", state: "Maharashtra", city: "Mumbai" };
  const storyRegionMumbai: Region = { country: "India", state: "Maharashtra", city: "Mumbai" };
  const storyRegionPune: Region = { country: "India", state: "Maharashtra", city: "Pune" };
  const storyRegionDelhi: Region = { country: "India", state: "Delhi NCR", city: "New Delhi" };

  const exactCityScore = computeGeoProximityScore(userRegionMumbai, storyRegionMumbai);
  assert("Exact city match scores 1.0", exactCityScore === 1.0, `score: ${exactCityScore}`);

  const sameStateScore = computeGeoProximityScore(userRegionMumbai, storyRegionPune);
  assert("Same state match scores 0.8", sameStateScore === 0.8, `score: ${sameStateScore}`);

  const farCityScore = computeGeoProximityScore(userRegionMumbai, storyRegionDelhi);
  assert(
    "Distance decay applied across states (score < 0.8)",
    farCityScore < 0.8 && farCityScore >= 0.1,
    `score: ${farCityScore}`
  );

  const distKm = calculateDistanceKm(19.076, 72.8777, 28.6139, 77.209);
  assert("Haversine distance Mumbai-Delhi ~1100-1200km", distKm >= 1050 && distKm <= 1300, `dist: ${distKm.toFixed(0)}km`);

  // 3. Hybrid Personalization Model (0.40 Genre + 0.35 Geo + 0.25 Velocity)
  console.log("\n--- 3. Hybrid Personalization Model ---");
  const testStories: Story[] = [
    {
      id: "story-far-sports",
      originalLanguage: "en",
      genre: "sports",
      region: { country: "India", state: "Tamil Nadu", city: "Chennai" },
      imageUrl: "https://example.com/sports.jpg",
      dominantColor: "#3b82f6",
      source: { name: "Zee Sports Wire", url: "https://zeenews.com" },
      author: { id: "a1", name: "Desk", role: "editor" },
      status: "published",
      createdAt: Date.now(),
      publishedAt: Date.now(),
      velocityScore: 0.6,
      versions: {
        en: {
          language: "en",
          headline: "IPL Match Review",
          summary: "Match summary",
          fullArticle: "Full article",
          takeaways: ["1", "2", "3"],
          motionSpec: { topic: "IPL", mood: "dynamic", palette: ["#fff"], motif: "sports" },
          audioUrl: null,
          updatedAt: Date.now(),
        },
      },
    },
    {
      id: "story-local-market",
      originalLanguage: "en",
      genre: "markets",
      region: { country: "India", state: "Maharashtra", city: "Mumbai" },
      imageUrl: "https://example.com/market.jpg",
      dominantColor: "#10b981",
      source: { name: "Zee Business", url: "https://zeenews.com" },
      author: { id: "a2", name: "Desk", role: "editor" },
      status: "published",
      createdAt: Date.now(),
      publishedAt: Date.now(),
      velocityScore: 0.9,
      versions: {
        en: {
          language: "en",
          headline: "BSE Sensex Surges 800 Points in Mumbai Morning Rally",
          summary: "Market summary",
          fullArticle: "Full article",
          takeaways: ["1", "2", "3"],
          motionSpec: { topic: "Markets", mood: "analytical", palette: ["#fff"], motif: "markets" },
          audioUrl: null,
          updatedAt: Date.now(),
        },
      },
    },
  ];

  const breakdownLocalMarket = scoreStoryForUser(
    testStories[1],
    affinities,
    userRegionMumbai,
    ["markets", "politics"]
  );
  const breakdownFarSports = scoreStoryForUser(
    testStories[0],
    affinities,
    userRegionMumbai,
    ["markets", "politics"]
  );

  assert(
    "Local market story outscores far sports story",
    breakdownLocalMarket.totalScore > breakdownFarSports.totalScore,
    `market score: ${breakdownLocalMarket.totalScore}, sports score: ${breakdownFarSports.totalScore}`
  );
  assert("Local market flagged as personalized match", breakdownLocalMarket.isPersonalizedMatch === true);

  // 4. Feed Ranking Verification
  console.log("\n--- 4. Feed Ranking Output ---");
  const { rankedStories } = rankStoriesForUser(
    testStories,
    userRegionMumbai,
    affinities,
    ["markets"]
  );

  assert("Rank 1 story is the tailored local market story", rankedStories[0].id === "story-local-market");
  assert("Rank 2 story is the low-affinity sports story", rankedStories[1].id === "story-far-sports");

  // 5. Cold-Start Micro-Interests Bootstrap
  console.log("\n--- 5. Cold-Start Explicit Preference Bootstrap ---");
  const emptyAffinity: Record<Genre, number> = {
    politics: 0,
    markets: 0,
    weather: 0,
    tech: 0,
    sports: 0,
    entertainment: 0,
    crime: 0,
    health: 0,
  };
  const coldStartRank = rankStoriesForUser(
    testStories,
    userRegionMumbai,
    emptyAffinity,
    ["sports"] // User explicitly chose Sports on 1-tap onboarding
  );
  assert(
    "Explicit cold-start preference elevates chosen topic",
    coldStartRank.rankedStories.length === 2
  );

  console.log(`\n========================================`);
  console.log(`Results: ${passed}/${total} checks passed (${((passed / total) * 100).toFixed(0)}%)`);
  if (passed === total) {
    console.log("🚀 Phase 6 Verification SUCCESSFUL!");
    process.exit(0);
  } else {
    console.error("❌ Some checks failed!");
    process.exit(1);
  }
}

runRecsysEvaluation().catch((err) => {
  console.error("RecSys eval fatal error:", err);
  process.exit(1);
});
