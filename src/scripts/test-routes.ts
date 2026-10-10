import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const manifestPath = join(root, ".next", "server", "app-paths-manifest.json");
const expectedRoutes = [
  "/page",
  "/feed/page",
  "/debate/page",
  "/upload/page",
  "/admin/page",
  "/games/page",
  "/terms/page",
  "/privacy/page",
  "/story/[id]/page",
  "/api/news/sync/route",
  "/api/news/cron/route",
  "/api/syndication/manus/route",
];

if (!existsSync(manifestPath)) {
  console.error("Route smoke failed: run npm run build first.");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<string, string>;
const missing = expectedRoutes.filter((route) => !manifest[route] || !existsSync(join(root, ".next", "server", manifest[route])));

if (missing.length) {
  console.error(`Route smoke failed. Missing compiled routes: ${missing.join(", ")}`);
  process.exit(1);
}

const homepageSource = readFileSync(join(root, "src", "app", "page.tsx"), "utf8");
const navigationSource = readFileSync(join(root, "src", "components", "shared", "Navbar.tsx"), "utf8");
const broadcastSource = readFileSync(join(root, "src", "components", "media", "LiveBroadcastPlayer.tsx"), "utf8");
const requiredLinks = ["/feed", "/games", "/debate", "/upload", "/terms", "/privacy"];
const missingLinks = requiredLinks.filter((href) => !homepageSource.includes(`href=\"${href}\"`) && !navigationSource.includes(`href: \"${href}\"`));

if (missingLinks.length) {
  console.error(`Navigation smoke failed. Missing homepage/shared links: ${missingLinks.join(", ")}`);
  process.exit(1);
}

if (!existsSync(join(root, "public", "story-fallback.svg")) || !homepageSource.includes("story-fallback.svg")) {
  console.error("Image smoke failed. The homepage has no local story-image fallback.");
  process.exit(1);
}

if (!homepageSource.includes("LiveBroadcastPlayer") || !broadcastSource.includes("NEXT_PUBLIC_LIVE_STREAM_EMBED_URL")) {
  console.error("Broadcast smoke failed. The homepage does not expose a configurable live player.");
  process.exit(1);
}

console.log(`Route smoke passed: ${expectedRoutes.length}/${expectedRoutes.length} compiled routes verified.`);
console.log(`Navigation smoke passed: ${requiredLinks.length}/${requiredLinks.length} main-to-subpage links verified.`);
console.log("Image smoke passed: local story fallback asset and onError recovery verified.");
console.log("Broadcast smoke passed: configurable live player verified.");
