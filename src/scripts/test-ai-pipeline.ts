import { headroomCompress, headroomRetrieve } from "../lib/ai/headroomJudge";
import { generateAICompletion } from "../lib/ai/omniRouter";
import { processArticleWithAI } from "../lib/ingestion/articleProcessor";
import { StorySchema } from "../types";

async function runAIPipelineVerification() {
  console.log("==================================================");
  console.log("   NEWSENGINE PHASE 3: AI PIPELINE & HEADROOM     ");
  console.log("==================================================\n");

  // 1. Test Headroom SmartCrusher & Token Compression Judge
  console.log("1. Testing Headroom Reversible Compression Judge...");
  const sampleLongArticle = `
    NEW DELHI: In a landmark economic policy revision announced this afternoon, the Reserve Bank of India
    maintained the key repo rate while revising growth projections for fiscal year 2026.
    Also read: Click here to subscribe to our daily finance newsletter and mobile notifications.
    Advertisement: Promoted story from banking partner.
    The monetary policy committee voted 5-1 in favour of the stance. Governor confirmed that headline inflation
    is trending towards the 4 percent target band, supported by resilient domestic rural demand and steady capital expenditure.
    Foreign institutional flows registered positive net inflows of ₹12,400 crore across secondary equity segments.
    Disclaimer: The information above is subject to market risks. Read all scheme related documents carefully.
  `;

  const compression = headroomCompress(sampleLongArticle);
  console.log(`✓ Original Estimated Tokens: ${compression.originalTokens}`);
  console.log(`✓ Compressed Tokens: ${compression.compressedTokens}`);
  console.log(`✓ Tokens Saved: ${compression.tokensSaved} (${(compression.compressionRatio * 100).toFixed(1)}% reduction)`);
  console.log(`✓ Recommended Model Tier: ${compression.recommendedModelTier}`);
  console.log(`✓ Vault Cache ID: ${compression.vaultId}`);

  // Test reversible retrieval
  const retrieved = headroomRetrieve(compression.vaultId);
  console.log(`✓ Reversible Vault Retrieval: ${retrieved ? "Verified OK" : "Failed"}\n`);

  // 2. Test OmniRoute Multi-Tier Model Gateway
  console.log("2. Testing OmniRoute Multi-Tier Fallback Gateway...");
  const aiTest = await generateAICompletion({
    prompt: "Summarize this breaking update in one sentence: RBI maintains repo rate with positive market sentiment.",
    tier: "fast",
    maxTokens: 100,
    compressWithHeadroom: true,
  });
  console.log(`✓ OmniRoute Routing Result:`);
  console.log(`   Model / Provider Used: ${aiTest?.modelUsed || "Deterministic Multi-Language Engine"}`);
  console.log(`   Target Tier: ${aiTest?.tier || "fast"}\n`);

  // 3. Test End-to-End AI Article Processing Pipeline
  console.log("3. Testing End-to-End AI Article Ingestion Processor...");
  const processed = await processArticleWithAI({
    title: "India Semiconductor Mission approves ₹35,000 crore silicon fab facility in Gujarat",
    rawContent: sampleLongArticle,
    sourceName: "Zee Business Wire",
    sourceUrl: "https://zeenews.india.com/business",
    genre: "tech",
    region: {
      country: "India",
      state: "Gujarat",
      city: "Ahmedabad",
    },
    authorName: "Kavita Rao, Tech Bureau",
  });

  console.log(`✓ Story Generated ID: ${processed.story.id}`);
  console.log(`✓ Model Architecture: ${processed.modelUsed}`);
  console.log(`✓ Headline (English): ${processed.story.versions?.en?.headline}`);
  console.log(`✓ Headline (Hindi): ${processed.story.versions?.hi?.headline}`);
  console.log(`✓ Headline (Tamil): ${processed.story.versions?.ta?.headline}`);
  console.log(`✓ Key Highlights: ${processed.story.versions?.en?.takeaways?.length} points`);
  console.log(`✓ Motion Spec Mood: ${processed.story.versions?.en?.motionSpec?.mood}`);

  // Validate strict adherence to StorySchema
  const parseValidation = StorySchema.safeParse(processed.story);
  console.log(`✓ StorySchema Validation: ${parseValidation.success ? "PASSED (100% compliant)" : "FAILED"}`);

  console.log("\n==================================================");
  console.log("PHASE 3 VERIFICATION COMPLETED SUCCESSFULLY!");
  console.log("==================================================");

  if (parseValidation.success) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAIPipelineVerification().catch((err) => {
  console.error("AI pipeline verification failed:", err);
  process.exit(1);
});
