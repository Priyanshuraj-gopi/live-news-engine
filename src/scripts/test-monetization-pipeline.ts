/**
 * Monetization & Syndication Yield Pipeline Test
 * Validates metered paywall logic, Pro subscription unlock, and multi-channel yield calculations.
 */

import {
  getPaywallQuota,
  consumeReadQuota,
  activateSubscription,
  calculateExecutiveRevenue,
} from "../lib/monetization/engine";

// Polyfill localStorage for Node/tsx testing environment
const mockStorage: Record<string, string> = {};
if (typeof globalThis.localStorage === "undefined") {
  (globalThis as any).localStorage = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, val: string) => {
      mockStorage[key] = val;
    },
    removeItem: (key: string) => {
      delete mockStorage[key];
    },
    clear: () => {
      Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
    },
  };
}
if (typeof globalThis.window === "undefined") {
  (globalThis as any).window = {};
}

async function runMonetizationTests() {
  console.log("=================================================");
  console.log("   ZEE MEDIA MONETIZATION & YIELD PIPELINE TEST  ");
  console.log("=================================================\n");

  // Step 1: Initial Quota
  console.log("[Test 1] Initializing Paywall Quota...");
  localStorage.clear();
  const initialQuota = getPaywallQuota();
  console.log(`✓ Default quota: ${initialQuota.freeReadsAllowed} free reads, used: ${initialQuota.readsUsedToday}, remaining: ${initialQuota.readsRemaining}`);
  if (initialQuota.readsRemaining !== 5 || initialQuota.isSubscribed !== false) {
    throw new Error(`Initial quota failed expectation: ${JSON.stringify(initialQuota)}`);
  }

  // Step 2: Consuming 5 reads
  console.log("\n[Test 2] Consuming Free Read Quota Step-by-Step...");
  for (let i = 1; i <= 5; i++) {
    const res = consumeReadQuota();
    console.log(`  Read ${i}: allowed=${res.allowed}, remaining=${res.remaining}`);
    if (!res.allowed) {
      throw new Error(`Read ${i} unexpectedly blocked.`);
    }
  }

  // Step 3: Quota Exhaustion (6th read should be blocked)
  console.log("\n[Test 3] Testing Paywall Gate Trigger (6th Read)...");
  const blockedRes = consumeReadQuota();
  console.log(`  Read 6: allowed=${blockedRes.allowed}, remaining=${blockedRes.remaining}`);
  if (blockedRes.allowed) {
    throw new Error("Paywall gate failed to block after exhausting 5 free reads!");
  }
  console.log("✓ Paywall gate successfully enforced at 0 remaining reads.");

  // Step 4: Pro Subscription Activation
  console.log("\n[Test 4] Activating Zee Citizen Pro Monthly Subscription (₹99/mo)...");
  const proMonthly = activateSubscription("monthly");
  console.log(`✓ Subscription status: isSubscribed=${proMonthly.isSubscribed}, plan=${proMonthly.subscriptionPlan}`);
  console.log(`✓ Quota after subscription: remaining=${proMonthly.readsRemaining}`);
  if (!proMonthly.isSubscribed || proMonthly.readsRemaining < 9000) {
    throw new Error("Subscription failed to unlock unlimited reads!");
  }

  // Verify that subsequent read is allowed now
  const subscribedRead = consumeReadQuota();
  console.log(`  Subscribed Read: allowed=${subscribedRead.allowed}, remaining=${subscribedRead.remaining}`);
  if (!subscribedRead.allowed) {
    throw new Error("Subscribed user blocked from reading!");
  }

  // Step 5: Multi-Channel Executive Revenue Yields
  console.log("\n[Test 5] Calculating Multi-Channel Executive Revenue Projections...");
  const baselineRev = calculateExecutiveRevenue(2500000, 12500);
  console.log(`  Baseline (2.5M impressions, 12.5K subscribers):`);
  console.log(`    - Monthly Ad Revenue: ₹${baselineRev.adRevenueMonthlyInr.toLocaleString()} (~₹${(baselineRev.adRevenueMonthlyInr / 100000).toFixed(2)} Lakhs)`);
  console.log(`    - Subscription ARR:   ₹${baselineRev.subscriptionArrInr.toLocaleString()} (~₹${(baselineRev.subscriptionArrInr / 10000000).toFixed(2)} Crores)`);
  console.log(`    - Total Monthly Rate: ₹${baselineRev.totalMonthlyRunRateInr.toLocaleString()} (~₹${(baselineRev.totalMonthlyRunRateInr / 100000).toFixed(2)} Lakhs)`);
  console.log(`    - Daily Active Read:  ${baselineRev.dailyActiveReaders.toLocaleString()}`);

  console.log("\n  Channel Breakdown:");
  baselineRev.channelBreakdown.forEach((ch) => {
    console.log(`    • [${ch.channel.toUpperCase()}] ${ch.label}`);
    console.log(`        Impressions: ${ch.projectedImpressions.toLocaleString()} | CPM: ₹${ch.projectedCpmInr} | Fit: ${ch.fitScore}% | Rev: ₹${ch.estimatedRevenueInr.toLocaleString()}`);
  });

  if (baselineRev.channelBreakdown.length !== 5) {
    throw new Error(`Expected 5 channels, received ${baselineRev.channelBreakdown.length}`);
  }

  // Step 6: Scaled Simulation (10M impressions, 50K subscribers)
  console.log("\n[Test 6] Testing Scaled Executive Simulation (10M impressions, 50K subscribers)...");
  const scaledRev = calculateExecutiveRevenue(10000000, 50000);
  console.log(`    - Scaled Monthly Ad Revenue: ₹${(scaledRev.adRevenueMonthlyInr / 100000).toFixed(2)} Lakhs`);
  console.log(`    - Scaled Subscription ARR:   ₹${(scaledRev.subscriptionArrInr / 10000000).toFixed(2)} Crores`);
  console.log(`    - Scaled Total Monthly Rate: ₹${(scaledRev.totalMonthlyRunRateInr / 100000).toFixed(2)} Lakhs`);

  if (scaledRev.adRevenueMonthlyInr <= baselineRev.adRevenueMonthlyInr) {
    throw new Error("Scaled ad revenue should be strictly greater than baseline!");
  }

  console.log("\n=================================================");
  console.log("   ✅ ALL MONETIZATION & YIELD TESTS PASSED!     ");
  console.log("=================================================");
}

runMonetizationTests().catch((err) => {
  console.error("❌ Monetization Test Failure:", err);
  process.exit(1);
});
