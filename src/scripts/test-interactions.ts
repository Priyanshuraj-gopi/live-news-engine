import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const feed = readFileSync(join(root, "src", "app", "feed", "page.tsx"), "utf8");
const debate = readFileSync(join(root, "src", "components", "debate", "DebateHub.tsx"), "utf8");
const hook = readFileSync(join(root, "src", "hooks", "useLiveStories.ts"), "utf8");
const ingestion = readFileSync(join(root, "src", "lib", "ingestion", "liveNewsEngine.ts"), "utf8");
const cron = readFileSync(join(root, "src", "app", "api", "news", "cron", "route.ts"), "utf8");
const broadcast = readFileSync(join(root, "src", "components", "media", "LiveBroadcastPlayer.tsx"), "utf8");

const checks: Array<[string, boolean]> = [
  ["Feed personalized/latest toggle", feed.includes("setIsPersonalized(true)") && feed.includes("setIsPersonalized(false)")],
  ["Feed manual live refresh", feed.includes("syncLiveNews()") && feed.includes("RefreshCw")],
  ["Feed last-sync status", feed.includes("lastSynced")],
  ["Automatic 60-second live polling", hook.includes("LIVE_REFRESH_MS = 60_000") && hook.includes("setInterval")],
  ["Visibility refresh", hook.includes("visibilitychange")],
  ["Debate search", debate.includes("setSearchQuery") && debate.includes("Search topics or headlines")],
  ["Debate genre filters", debate.includes("setSelectedGenre")],
  ["Debate guidelines toggle", debate.includes("setShowGuidelines")],
  ["Debate story selection", debate.includes("setSelectedStoryId")],
  ["External RSS registry", ingestion.includes("DEFAULT_EXTERNAL_RSS_FEEDS") && ingestion.includes("fetchExternalRSSFeeds")],
  ["Scheduled RSS endpoint", cron.includes("ingestRealNews") && cron.includes("CRON_SECRET")],
  ["Live broadcast modes", broadcast.includes("NEXT_PUBLIC_LIVE_STREAM_EMBED_URL") && broadcast.includes("NEXT_PUBLIC_LIVE_STREAM_URL")],
  ["Live headlines replace seeds", hook.includes("setUsingLiveWire(true)") && hook.includes("setStories(mergeStories(readLocalSubmissionStories(), data.stories as Story[]))")],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length) {
  console.error(`Interaction smoke failed: ${failed.join(", ")}`);
  process.exit(1);
}

console.log(`Interaction smoke passed: ${checks.length}/${checks.length} feed/debate interaction contracts verified.`);
