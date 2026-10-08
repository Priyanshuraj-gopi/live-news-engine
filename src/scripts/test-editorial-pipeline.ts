/**
 * Phase 5 Verification Test Suite: Citizen Journalism Portal & Editorial Queue
 * Tests submission veracity evaluation, geographic validation, and editorial promotion.
 */

import { evaluateSubmissionVeracity, promoteSubmissionToStory } from "../lib/editorial/verificationEngine";
import { UploadSubmission } from "../types";

async function runEditorialTests() {
  console.log("=== Phase 5: Citizen Journalism & Editorial Verification Tests ===\n");
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

  // 1. High Veracity Citizen Submission Test
  console.log("--- 1. High Veracity Report Evaluation ---");
  const validReport: UploadSubmission = {
    id: "test-report-1",
    title: "Hyderabad Outer Ring Road Solar Canopy Project Achieves 50MW Milestone",
    body: "Telangana state infrastructure development board has officially commissioned 50 megawatts of rooftop solar arrays over the Outer Ring Road cycling track. The project feeds clean electricity into the municipal grid and shelters commuters from heat, according to zonal authorities.",
    originalLanguage: "en",
    genre: "weather",
    region: { country: "India", state: "Telangana", city: "Hyderabad" },
    images: ["https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200"],
    sourceLinks: ["https://telangana.gov.in/solar-infra"],
    author: {
      id: "contributor-hyd-01",
      name: "Suresh Reddy",
      role: "contributor",
    },
    status: "review",
    createdAt: Date.now(),
  };

  const highVeracityResult = evaluateSubmissionVeracity(validReport);
  assert(
    "High veracity score >= 75",
    highVeracityResult.overallVeracityScore >= 75,
    `score: ${highVeracityResult.overallVeracityScore}`
  );
  assert("Veracity rating is High", highVeracityResult.veracityRating === "High");
  assert("Valid Indian state recognized", highVeracityResult.hasValidLocation === true);
  assert("Evidence attachments recognized", highVeracityResult.hasEvidenceAttachments === true);
  assert(
    "Recommended for approval",
    highVeracityResult.recommendation === "recommend_approval",
    `recommendation: ${highVeracityResult.recommendation}`
  );

  // 2. Suspicious / Clickbait / Toxic Submission Test
  console.log("\n--- 2. Low Veracity & Toxicity Flagging ---");
  const suspiciousReport: UploadSubmission = {
    id: "test-report-2",
    title: "SHOCKING SECRET REVEALED YOU WON'T BELIEVE WHAT IDIOTS DID",
    body: "This is fake news and everyone is corrupt buy now free cash!",
    originalLanguage: "en",
    genre: "politics",
    region: { country: "India", state: "Atlantis", city: "Nowhere" },
    images: [],
    sourceLinks: [],
    author: {
      id: "spammer-99",
      name: "Anonymous",
      role: "reader",
    },
    status: "review",
    createdAt: Date.now(),
  };

  const lowVeracityResult = evaluateSubmissionVeracity(suspiciousReport);
  assert(
    "Suspicious submission scored low (< 50)",
    lowVeracityResult.overallVeracityScore < 50,
    `score: ${lowVeracityResult.overallVeracityScore}`
  );
  assert(
    "Clickbait and toxicity flagged",
    lowVeracityResult.flags.some((f) => f.includes("Clickbait") || f.includes("Sensationalist")) ||
      lowVeracityResult.isToxic
  );
  assert(
    "Invalid location flagged",
    lowVeracityResult.hasValidLocation === false
  );

  // 3. Editorial Promotion to 7-Language Story Test
  console.log("\n--- 3. Editorial Promotion & Translation Pipeline ---");
  console.log("Synthesizing multi-language story from citizen report...");
  const promotedStory = await promoteSubmissionToStory(validReport);

  assert("Story generated with published status", promotedStory.status === "published");
  assert("Citizen author preserved", promotedStory.author.name === "Suresh Reddy");
  assert("English version generated", !!promotedStory.versions?.en?.headline);
  assert("Hindi version generated", !!promotedStory.versions?.hi?.headline);
  assert("Tamil version generated", !!promotedStory.versions?.ta?.headline);
  assert("Takeaways generated", (promotedStory.versions?.en?.takeaways?.length || 0) >= 3);
  assert("Motion specs generated", !!promotedStory.versions?.en?.motionSpec);

  console.log(`\n========================================`);
  console.log(`Results: ${passed}/${total} checks passed (${((passed / total) * 100).toFixed(0)}%)`);
  if (passed === total) {
    console.log("🚀 Phase 5 Verification SUCCESSFUL!");
    process.exit(0);
  } else {
    console.error("❌ Some checks failed!");
    process.exit(1);
  }
}

runEditorialTests().catch((err) => {
  console.error("Editorial pipeline fatal error:", err);
  process.exit(1);
});
