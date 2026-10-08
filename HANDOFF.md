# NewsEngine Handoff & Architecture Memory (Claude-Mem)

## Goal
Build "NewsEngine", an AI content & monetization platform for Zee Media across 7 Indian languages (`en`, `hi`, `kn`, `ta`, `te`, `mr`, `bn`), featuring authentic real live news search, public APIs, in-browser Remotion video summaries, Web Speech TTS, real-time Firestore synchronization, civil community debate, grassroots citizen journalism, and PostHog-driven personalized recommendation with 100% free-tier compliance.

## Current State
- **Phase 1 (Foundation):** Next.js 15, Tailwind, Firebase Auth & Firestore rules, Seed data with 88 rich multi-language stories, Haversine geographic solver.
- **Phase 2 (Interface):** Responsive Glassmorphism UI, Breaking News Hero Carousel with 8 SVG motion motifs, Inshorts vertical swipe deck with Framer Motion, in-browser Remotion video player, Web Speech API player across all 7 Indian languages.
- **Phase 3 (Live News Search, Public APIs & AI Engine):**
  - **Headroom Reversible Token Judge (`headroomJudge.ts`):** SmartCrusher pipeline slashing redundant boilerplate (18%-45% token reduction) with in-memory reversible vault cache (`headroomRetrieve`).
  - **OmniRoute Multi-Tier Gateway (`omniRouter.ts`):** Universal AI router with tier switching (`fast`, `quality`, `moderation`) and auto-fallback (`OmniRoute -> Gemini 1.5 Pro / Flash -> Deterministic Multi-Language Engine`).
  - **AI Article Ingestion Processor (`articleProcessor.ts`):** Converts raw incoming text into structured ~60-word briefs, 3–5 key highlights, motion specs, velocity scores, and 7-language adaptations.
  - **Live News Search & Public APIs:** Direct Zee News RSS + Google News India live engine + Open-Meteo Weather + Frankfurter Forex + CoinGecko Crypto + Spaceflight News. Global ticker: `MarketWeatherBar.tsx`.
  - **Manus Syndication Endpoint (`/api/syndication/manus`):** Real-time JSON export endpoint for external agent distribution.
- **Phase 4 (Community Debate Engine & Moderation Sentinel):**
  - **Real-Time Debate Rooms (`DebateRoom.tsx`):** Real-time Firestore message synchronization under `stories/{storyId}/messages` with peer reactions (`helpful`, `insightful`).
  - **30-Second Slow Mode:** Client and server-validated anti-spam countdown throttle.
  - **AI Toxicity Sentinel (`toxicityScorer.ts`):** Automated profanity, slurs, aggressive all-caps shouting, and harassment scoring. Auto-flags (score >= 0.7) and quarantines severe violations (score >= 0.9).
  - **Reader Credibility Engine (`engine.ts` & `CredibilityBadge.tsx`):** Level 1 to 5 tiered credibility ladder.
  - **Debate Hub (`/debate`):** Dedicated community hub with active room picker, search, genre filtering, and community rules drawer.
  - **In-Article Debate Drawer (`/story/[id]`):** Inline expandable debate room directly inside story view.
- **Phase 5 (Citizen Journalism Portal & Editorial Moderation Queue):**
  - **Citizen Report Portal (`/upload`):** 4-step submission wizard: 1) Core story, 2) Location & Evidence attachments with GPS/State matching, 3) Real-time AI veracity pre-flight assessment, 4) Tracking ID confirmation.
  - **Veracity Assessment Engine (`verificationEngine.ts`):** Heuristic and AI plausibility scoring evaluating evidence media, citations, word density, and geographic validity.
  - **Editorial Desk Dashboard (`/admin`):** Comprehensive CMS with role simulator (Editor/Admin), pending submissions inspection, one-click promotion into live stories (synthesizing all 7 Indian languages), revision requests, and archive actions.
- **Phase 6 (Recommendation Engine & PostHog Analytics):**
  - **PostHog MCP & Telemetry Client (`posthog.ts`):** Configured `.agents/mcp_config.json` with official PostHog MCP server (`https://mcp.posthog.com/mcp`). Tracks dwell times, read-more expansions, shares, and topic preference updates.
  - **Hybrid Personalization Model (`recommendation/engine.ts`):** Implements exact formula `0.40 * GenreAffinity + 0.35 * GeoProximity + 0.25 * VelocityScore` with Haversine distance decay across Indian states.
  - **Cold-Start 1-Tap Onboarding (`PreferencesModal.tsx`):** Instant topic chips & regional hub selector; automatically bootstraps recommendations for new readers.
  - **Auto-Personalized Default Feed:** Default AI For You feed on both Home Wire and Inshorts Swipe Deck with instant Chronological Wire toggle and "For You" match badge.
  - **Verification:** `eval-recsys.ts` passed (12/12 checks, 100%).

## Key Files
- `.agents/mcp_config.json`: PostHog MCP server configuration.
- `src/lib/analytics/posthog.ts`: PostHog telemetry event dispatcher & genre affinity calculator.
- `src/lib/recommendation/engine.ts`: Hybrid 40/35/25 recommendation engine & Haversine geo decay.
- `src/components/personalization/PreferencesModal.tsx`: 1-tap topic and region customizer modal.
- `src/app/page.tsx`: Home Wire with AI For You / Chronological Wire toggle and match badges.
- `src/app/feed/page.tsx`: Inshorts Swipe Deck with personalized story ordering.
- `src/scripts/eval-recsys.ts`: Automated RecSys evaluation test suite.

- **Phase 7 (Monetization Intelligence & Executive Analytics):**
  - **Metered Paywall Engine (`monetization/engine.ts`):** 5 free deep-dive articles/day per device with local quota persistence and daily rollover reset.
  - **Zee Citizen Pro Tier (`PaywallModal.tsx`):** Glassmorphic conversion modal with ₹99/month and ₹799/annual plans, 1-click upgrade simulation, and unlimited reading access.
  - **Contextual Native Ad Slots (`SponsoredCard.tsx`):** Programmatic and branded card formats integrated cleanly into the Inshorts vertical swipe deck.
  - **Executive Revenue Desk (`/admin` Tab 4):** Live interactive revenue simulator with dynamic sliders for network impressions (500K-10M) and paid subscribers (1K-50K). Renders Monthly Ad Revenue, Subscription ARR, Total Run-Rate, and full 5-channel syndication yield breakdown (Web, YouTube Shorts, Reels, WhatsApp, X).
  - **Verification:** `test-monetization-pipeline.ts` passed (6/6 checks, 100%).
- **Phase 8 (Production Polish & Full Verification):**
  - **TypeScript Integrity:** `tsc --noEmit` compiles with 0 errors.
  - **Test Coverage:** All 6 automated test scripts pass with 100% success rate (`test-live-news.ts`, `test-ai-pipeline.ts`, `test-debate-engine.ts`, `test-editorial-pipeline.ts`, `eval-recsys.ts`, `test-monetization-pipeline.ts`).
  - **Production Build:** `next build` pre-rendered all 10 static and dynamic routes (`/`, `/_not-found`, `/admin`, `/api/news/sync`, `/api/syndication/manus`, `/debate`, `/feed`, `/story/[id]`, `/upload`).

## Key Files
- `src/lib/monetization/engine.ts`: Metered quota logic, Pro activation, and multi-channel yield calculations.
- `src/components/monetization/PaywallModal.tsx`: Premium subscription paywall modal with 1-click Pro demo.
- `src/components/monetization/SponsoredCard.tsx`: Native ad cards for swipe feeds.
- `src/app/admin/page.tsx`: Tab 4 Monetization & Yield desk with interactive revenue simulators.
- `src/scripts/test-monetization-pipeline.ts`: Test suite for paywall quota and syndication yields.
- `.agents/mcp_config.json`: PostHog MCP server configuration.
- `src/lib/analytics/posthog.ts`: PostHog telemetry event dispatcher & genre affinity calculator.
- `src/lib/recommendation/engine.ts`: Hybrid 40/35/25 recommendation engine & Haversine geo decay.
- `src/components/personalization/PreferencesModal.tsx`: 1-tap topic and region customizer modal.
- `src/app/page.tsx`: Home Wire with AI For You / Chronological Wire toggle and match badges.
- `src/app/feed/page.tsx`: Inshorts Swipe Deck with personalized story ordering.

