import { CredibilityProfile } from "@/types";

export interface UserCredibilityInputs {
  userId: string;
  readCount: number;
  approvedCommentsCount: number;
  peerUpvotesCount: number;
  flaggedCount: number;
}

export const CREDIBILITY_LEVEL_NAMES: Record<number, { name: string; title: string; color: string; badgeClass: string }> = {
  1: {
    name: "Level 1",
    title: "Novice Reader",
    color: "#64748B",
    badgeClass: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  },
  2: {
    name: "Level 2",
    title: "Informed Citizen",
    color: "#0284C7",
    badgeClass: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  },
  3: {
    name: "Level 3",
    title: "Community Contributor",
    color: "#10B981",
    badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  4: {
    name: "Level 4",
    title: "Verified Analyst",
    color: "#F59E0B",
    badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  5: {
    name: "Level 5",
    title: "Distinguished Voice",
    color: "#8B5CF6",
    badgeClass: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
};

/**
 * Compute real-time reader credibility score and tier
 */
export function calculateCredibility(inputs: UserCredibilityInputs): CredibilityProfile {
  const { userId, readCount, approvedCommentsCount, peerUpvotesCount, flaggedCount } = inputs;

  // 1. Reading Score (Max 30 pts)
  const readingScore = Math.min(30, readCount * 2);

  // 2. Debate Quality Score (Max 40 pts)
  const debateQualityScore = Math.min(40, approvedCommentsCount * 5);

  // 3. Peer Reaction Score (Max 30 pts)
  const peerReactionScore = Math.min(30, peerUpvotesCount * 3);

  // 4. Penalties (-20 pts per flagged comment)
  const penalties = flaggedCount * 20;

  // 5. Total Combined Score
  const rawScore = readingScore + debateQualityScore + peerReactionScore - penalties;
  const overallScore = Math.min(100, Math.max(5, rawScore));

  // Determine Level (1 to 5)
  let level = 1;
  if (overallScore >= 90) level = 5;
  else if (overallScore >= 75) level = 4;
  else if (overallScore >= 50) level = 3;
  else if (overallScore >= 25) level = 2;
  else level = 1;

  const badges: string[] = [];
  if (readCount >= 10) badges.push("Avid Reader");
  if (approvedCommentsCount >= 5) badges.push("Civil Debater");
  if (peerUpvotesCount >= 15) badges.push("Top Insight");
  if (level === 5) badges.push("Distinguished Contributor");

  return {
    userId,
    overallScore,
    level,
    readingScore,
    debateQualityScore,
    peerReactionScore,
    penalties,
    badges,
    expertiseTags: ["Current Affairs", "Fact Verification"],
    updatedAt: Date.now(),
  };
}
