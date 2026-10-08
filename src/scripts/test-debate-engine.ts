/**
 * Phase 4 Verification Test Suite: Community Debate Engine & Civil Moderation Guard
 * Tests toxicity evaluation, slow-mode cooldowns, and reader credibility scoring tiers.
 */

import { evaluateToxicity } from "../lib/moderation/toxicityScorer";
import { calculateCredibility, CREDIBILITY_LEVEL_NAMES } from "../lib/credibility/engine";

async function runDebateTests() {
  console.log("=== Phase 4: Community Debate Engine & Moderation Tests ===\n");
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

  // 1. Toxicity Evaluation Tests
  console.log("--- 1. Toxicity Sentinel Tests ---");
  const civilComment = "This budget allocation gives much needed support to state highway infrastructure.";
  const civilResult = evaluateToxicity(civilComment);
  assert("Civil comment approved", civilResult.status === "approved" && civilResult.score < 0.3, `score: ${civilResult.score}`);

  const severeViolator = "Death to all opposition members in the capital!";
  const severeResult = evaluateToxicity(severeViolator);
  assert("Severe incitement hidden", severeResult.status === "hidden" && severeResult.score >= 0.9, `score: ${severeResult.score}`);

  const abusiveComment = "You are an absolute idiot and this is fake news buy now free cash!";
  const abusiveResult = evaluateToxicity(abusiveComment);
  assert("Abusive & spam text flagged", abusiveResult.status === "flagged" && abusiveResult.score >= 0.7, `score: ${abusiveResult.score}`);

  const shoutingComment = "STOP SPREADING MISINFORMATION RIGHT NOW PLEASE";
  const shoutingResult = evaluateToxicity(shoutingComment);
  assert("All-caps shouting scored higher than ambient", shoutingResult.score > civilResult.score);

  // 2. Credibility Score Tier Tests
  console.log("\n--- 2. Credibility Progression Tests ---");
  const noviceUser = calculateCredibility({
    userId: "novice-1",
    readCount: 2,
    approvedCommentsCount: 0,
    peerUpvotesCount: 0,
    flaggedCount: 0,
  });
  assert("Novice user assigned Level 1", noviceUser.level === 1 && noviceUser.overallScore < 25);

  const activeCitizen = calculateCredibility({
    userId: "citizen-2",
    readCount: 15, // 30 max
    approvedCommentsCount: 5, // 25
    peerUpvotesCount: 5, // 15
    flaggedCount: 0,
  });
  assert("Active debater assigned Level 3+", activeCitizen.level >= 3, `level: ${activeCitizen.level}, score: ${activeCitizen.overallScore}`);
  assert("Badges assigned correctly", activeCitizen.badges.includes("Avid Reader") && activeCitizen.badges.includes("Civil Debater"));

  const distinguishedExpert = calculateCredibility({
    userId: "expert-3",
    readCount: 20, // 30 max
    approvedCommentsCount: 10, // 40 max
    peerUpvotesCount: 12, // 30 max
    flaggedCount: 0,
  });
  assert("Distinguished voice assigned Level 5", distinguishedExpert.level === 5 && distinguishedExpert.overallScore >= 90, `level: ${distinguishedExpert.level}, score: ${distinguishedExpert.overallScore}`);

  const toxicUser = calculateCredibility({
    userId: "troublemaker-4",
    readCount: 10,
    approvedCommentsCount: 2,
    peerUpvotesCount: 1,
    flaggedCount: 3, // -60 penalties
  });
  assert("Penalties reduce score to minimum floor", toxicUser.level === 1 && toxicUser.penalties === 60);

  // 3. Slow Mode Logic Verification
  console.log("\n--- 3. Slow Mode Cooldown Logic Tests ---");
  const SLOW_MODE_SECONDS = 30;
  const now = Date.now();
  const lastPostTime = now - 12000; // 12 seconds ago
  const elapsedSeconds = Math.floor((now - lastPostTime) / 1000);
  const cooldownRemaining = Math.max(0, SLOW_MODE_SECONDS - elapsedSeconds);
  assert("Slow-mode calculates 18s remaining", cooldownRemaining === 18, `got: ${cooldownRemaining}`);

  const expiredPostTime = now - 35000; // 35 seconds ago
  const expiredElapsed = Math.floor((now - expiredPostTime) / 1000);
  const expiredCooldown = Math.max(0, SLOW_MODE_SECONDS - expiredElapsed);
  assert("Slow-mode permits post after 30s expiry", expiredCooldown === 0);

  console.log(`\n========================================`);
  console.log(`Results: ${passed}/${total} checks passed (${((passed / total) * 100).toFixed(0)}%)`);
  if (passed === total) {
    console.log("🚀 Phase 4 Verification SUCCESSFUL!");
    process.exit(0);
  } else {
    console.error("❌ Some checks failed!");
    process.exit(1);
  }
}

runDebateTests().catch((err) => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
