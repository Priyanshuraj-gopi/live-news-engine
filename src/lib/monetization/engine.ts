export interface PaywallQuota {
  freeReadsAllowed: number;
  readsUsedToday: number;
  readsRemaining: number;
  isSubscribed: boolean;
  subscriptionPlan?: "monthly" | "annual";
  subscriptionExpiry?: number;
}

export interface ChannelYieldEstimate {
  channel: "web" | "youtube_shorts" | "instagram_reels" | "x" | "whatsapp";
  label: string;
  projectedImpressions: number;
  projectedCpmInr: number;
  estimatedRevenueInr: number;
  fitScore: number;
  monetizationModel: "programmatic_ads" | "branded_content" | "affiliate" | "subscription";
}

export interface ExecutiveRevenueSummary {
  dailyActiveReaders: number;
  monthlyPageviews: number;
  adRevenueMonthlyInr: number;
  subscriptionArrInr: number;
  totalMonthlyRunRateInr: number;
  channelBreakdown: ChannelYieldEstimate[];
}

const LOCAL_STORAGE_PAYWALL_KEY = "newsengine_paywall_quota";

/**
 * Get current reader's paywall quota & subscription state
 */
export function getPaywallQuota(): PaywallQuota {
  if (typeof window === "undefined") {
    return {
      freeReadsAllowed: 5,
      readsUsedToday: 0,
      readsRemaining: 5,
      isSubscribed: false,
    };
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PAYWALL_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // Check if day changed
      const lastDate = new Date(data.lastReadDate || 0).toDateString();
      const todayDate = new Date().toDateString();
      if (lastDate !== todayDate && !data.isSubscribed) {
        data.readsUsedToday = 0;
        data.readsRemaining = data.freeReadsAllowed || 5;
        data.lastReadDate = Date.now();
        localStorage.setItem(LOCAL_STORAGE_PAYWALL_KEY, JSON.stringify(data));
      }
      return data;
    }
  } catch (e) {}

  const initial: PaywallQuota = {
    freeReadsAllowed: 5,
    readsUsedToday: 0,
    readsRemaining: 5,
    isSubscribed: false,
  };
  return initial;
}

/**
 * Increment user's consumed reads; returns whether read is permitted
 */
export function consumeReadQuota(): { allowed: boolean; remaining: number } {
  if (typeof window === "undefined") return { allowed: true, remaining: 5 };

  try {
    const quota = getPaywallQuota();
    if (quota.isSubscribed) {
      return { allowed: true, remaining: 999 };
    }

    if (quota.readsUsedToday >= quota.freeReadsAllowed) {
      return { allowed: false, remaining: 0 };
    }

    quota.readsUsedToday += 1;
    quota.readsRemaining = Math.max(0, quota.freeReadsAllowed - quota.readsUsedToday);
    (quota as any).lastReadDate = Date.now();
    localStorage.setItem(LOCAL_STORAGE_PAYWALL_KEY, JSON.stringify(quota));

    return { allowed: true, remaining: quota.readsRemaining };
  } catch (e) {
    return { allowed: true, remaining: 3 };
  }
}

/**
 * Upgrade user to Zee Citizen Pro
 */
export function activateSubscription(plan: "monthly" | "annual"): PaywallQuota {
  const expiry = Date.now() + (plan === "annual" ? 365 : 30) * 24 * 3600 * 1000;
  const updated: PaywallQuota = {
    freeReadsAllowed: 9999,
    readsUsedToday: 0,
    readsRemaining: 9999,
    isSubscribed: true,
    subscriptionPlan: plan,
    subscriptionExpiry: expiry,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_PAYWALL_KEY, JSON.stringify(updated));
    } catch (e) {}
  }
  return updated;
}

/**
 * Calculate multi-channel syndication yield projections for Executive Desk
 */
export function calculateExecutiveRevenue(
  baseMonthlyImpressions: number = 2500000,
  subscriberCount: number = 12500
): ExecutiveRevenueSummary {
  const channelBreakdown: ChannelYieldEstimate[] = [
    {
      channel: "web",
      label: "Zee News Web & PWA Portal",
      projectedImpressions: Math.round(baseMonthlyImpressions * 0.45),
      projectedCpmInr: 120, // ₹120 per 1,000 views
      estimatedRevenueInr: Math.round((baseMonthlyImpressions * 0.45 * 120) / 1000),
      fitScore: 95,
      monetizationModel: "programmatic_ads",
    },
    {
      channel: "youtube_shorts",
      label: "YouTube Shorts Automated Wire",
      projectedImpressions: Math.round(baseMonthlyImpressions * 0.25),
      projectedCpmInr: 95,
      estimatedRevenueInr: Math.round((baseMonthlyImpressions * 0.25 * 95) / 1000),
      fitScore: 88,
      monetizationModel: "branded_content",
    },
    {
      channel: "instagram_reels",
      label: "Instagram Reels Remotion Motion Feed",
      projectedImpressions: Math.round(baseMonthlyImpressions * 0.15),
      projectedCpmInr: 140,
      estimatedRevenueInr: Math.round((baseMonthlyImpressions * 0.15 * 140) / 1000),
      fitScore: 82,
      monetizationModel: "branded_content",
    },
    {
      channel: "whatsapp",
      label: "WhatsApp Verified News Channel",
      projectedImpressions: Math.round(baseMonthlyImpressions * 0.10),
      projectedCpmInr: 80,
      estimatedRevenueInr: Math.round((baseMonthlyImpressions * 0.10 * 80) / 1000),
      fitScore: 78,
      monetizationModel: "affiliate",
    },
    {
      channel: "x",
      label: "X (Twitter) Live Wire Dispatches",
      projectedImpressions: Math.round(baseMonthlyImpressions * 0.05),
      projectedCpmInr: 60,
      estimatedRevenueInr: Math.round((baseMonthlyImpressions * 0.05 * 60) / 1000),
      fitScore: 70,
      monetizationModel: "programmatic_ads",
    },
  ];

  const adRevenueMonthlyInr = channelBreakdown.reduce(
    (acc, curr) => acc + curr.estimatedRevenueInr,
    0
  );

  // ₹99/mo per active subscriber
  const subscriptionMonthlyInr = subscriberCount * 99;
  const subscriptionArrInr = subscriptionMonthlyInr * 12;
  const totalMonthlyRunRateInr = adRevenueMonthlyInr + subscriptionMonthlyInr;

  return {
    dailyActiveReaders: Math.round(baseMonthlyImpressions / 30 / 3.5),
    monthlyPageviews: baseMonthlyImpressions,
    adRevenueMonthlyInr,
    subscriptionArrInr,
    totalMonthlyRunRateInr,
    channelBreakdown,
  };
}
