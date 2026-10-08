import { fetchZeeNews, searchLiveNewsGoogle, ingestRealNews } from "../lib/ingestion/liveNewsEngine";
import { StorySchema } from "../types";

async function runLiveNewsVerification() {
  console.log("==================================================");
  console.log("   NEWSENGINE LIVE SEARCH & RSS VERIFICATION      ");
  console.log("==================================================\n");

  // Test 1: Fetch Official Zee News RSS
  console.log("1. Fetching official Zee News RSS feeds...");
  const zeeItems = await fetchZeeNews("general");
  console.log(`✓ Zee News items fetched: ${zeeItems.length}`);
  if (zeeItems.length > 0) {
    console.log(`   Sample Headline: "${zeeItems[0].title}"`);
    console.log(`   Source: ${zeeItems[0].source} | Date: ${zeeItems[0].pubDate}\n`);
  }

  // Test 2: Live Real-Time Search Query via Google News India
  const searchQuery = "Bengaluru technology";
  console.log(`2. Executing live search query: "${searchQuery}"...`);
  const searchItems = await searchLiveNewsGoogle(searchQuery);
  console.log(`✓ Live search items returned: ${searchItems.length}`);
  if (searchItems.length > 0) {
    console.log(`   Sample Match: "${searchItems[0].title}"`);
    console.log(`   Source: ${searchItems[0].source}\n`);
  }

  // Test 3: End-to-End Ingestion, Classification, 7-Language Adaptation & Zod Validation
  console.log("3. Ingesting & adapting live news into StorySchema...");
  const liveStories = await ingestRealNews({ query: "Sensex RBI", limit: 3 });
  console.log(`✓ Processed stories: ${liveStories.length}`);

  let validCount = 0;
  for (const story of liveStories) {
    const parseRes = StorySchema.safeParse(story);
    if (parseRes.success) {
      validCount++;
      const en = story.versions?.en;
      const hi = story.versions?.hi;
      const kn = story.versions?.kn;
      console.log(`\n   [Story ID: ${story.id}]`);
      console.log(`   Genre: ${story.genre} | Region: ${story.region.city}, ${story.region.state}`);
      console.log(`   Headline (EN): ${en?.headline}`);
      console.log(`   Headline (HI): ${hi?.headline}`);
      console.log(`   Headline (KN): ${kn?.headline}`);
      console.log(`   Takeaways: ${en?.takeaways.length} key points`);
      console.log(`   Velocity: ${(story.velocityScore * 100).toFixed(0)}%`);
    } else {
      console.error(`✗ Validation failed for story ${story.id}:`, parseRes.error.format());
    }
  }

  console.log("\n==================================================");
  console.log(`VERIFICATION RESULT: ${validCount}/${liveStories.length} stories strictly passed StorySchema!`);
  console.log("==================================================");

  if (validCount === liveStories.length && validCount > 0) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runLiveNewsVerification().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
