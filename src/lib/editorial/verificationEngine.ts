import { UploadSubmission, Story, Genre, LanguageCode } from "@/types";
import { evaluateToxicity } from "@/lib/moderation/toxicityScorer";
import { processArticleWithAI } from "@/lib/ingestion/articleProcessor";
import { INDIAN_STATES } from "@/lib/region/config";

export interface VeracityReport {
  overallVeracityScore: number; // 0 - 100
  toxicityScore: number;
  isToxic: boolean;
  hasValidLocation: boolean;
  hasEvidenceAttachments: boolean;
  hasReputableSources: boolean;
  veracityRating: "High" | "Moderate" | "Low" | "Suspicious";
  recommendation: "recommend_approval" | "needs_editorial_review" | "recommend_rejection";
  flags: string[];
  suggestedTags: string[];
}

/**
 * Evaluates a citizen journalist submission for plausibility, evidence, and toxicity
 */
export function evaluateSubmissionVeracity(submission: UploadSubmission): VeracityReport {
  const flags: string[] = [];
  let score = 50; // Starting baseline

  // 1. Toxicity & Harassment Check
  const combinedText = `${submission.title} ${submission.body}`;
  const toxicity = evaluateToxicity(combinedText);
  if (toxicity.status === "hidden" || toxicity.score >= 0.8) {
    flags.push("Severe toxicity or offensive slurs detected");
    score -= 40;
  } else if (toxicity.status === "flagged" || toxicity.score >= 0.5) {
    flags.push("Borderline contentious or inflammatory phrasing");
    score -= 15;
  } else {
    score += 10;
  }

  // 2. Evidence Attachments Check
  const hasImages = Array.isArray(submission.images) && submission.images.length > 0;
  if (hasImages) {
    score += 15;
  } else {
    flags.push("No photographic or documentary evidence attached");
    score -= 10;
  }

  // 3. Source Links Check
  const hasSources = Array.isArray(submission.sourceLinks) && submission.sourceLinks.length > 0;
  let hasReputableSources = false;
  if (hasSources) {
    const reputableDomains = ["gov.in", "nic.in", "reuters.com", "zeenews", "pib.gov.in", "hindustantimes", "thehindu"];
    for (const link of submission.sourceLinks) {
      if (reputableDomains.some((dom) => link.toLowerCase().includes(dom))) {
        hasReputableSources = true;
        break;
      }
    }
    score += hasReputableSources ? 20 : 10;
  } else {
    flags.push("No primary source references or external citations provided");
  }

  // 4. Content Depth & Structure
  const wordCount = submission.body.trim().split(/\s+/).length;
  if (wordCount >= 100) {
    score += 10;
  } else if (wordCount < 40) {
    flags.push("Story text is brief; lacks detailed factual grounding");
    score -= 10;
  }

  // 5. Geographic Accuracy Check
  const stateMatch = INDIAN_STATES.find(
    (s) => s.name.toLowerCase() === submission.region.state.toLowerCase()
  );
  const hasValidLocation = !!stateMatch;
  if (hasValidLocation) {
    score += 5;
  } else {
    flags.push(`State '${submission.region.state}' not matched to standard Indian regional registry`);
    score -= 5;
  }

  // 6. Sensationalism / Clickbait Check
  const clickbaitRegex = /\b(shocking|you won't believe|miracle|secret revealed|unbelievable|100% cure)\b/i;
  if (clickbaitRegex.test(combinedText)) {
    flags.push("Sensationalist or clickbait terminology detected");
    score -= 15;
  }

  // Clamp final score
  const finalScore = Math.min(100, Math.max(5, score));

  let veracityRating: "High" | "Moderate" | "Low" | "Suspicious" = "Moderate";
  let recommendation: "recommend_approval" | "needs_editorial_review" | "recommend_rejection" = "needs_editorial_review";

  if (finalScore >= 75) {
    veracityRating = "High";
    recommendation = "recommend_approval";
  } else if (finalScore >= 50) {
    veracityRating = "Moderate";
    recommendation = "needs_editorial_review";
  } else if (finalScore >= 30) {
    veracityRating = "Low";
    recommendation = "needs_editorial_review";
  } else {
    veracityRating = "Suspicious";
    recommendation = "recommend_rejection";
  }

  const suggestedTags = [
    submission.genre,
    submission.region.city,
    submission.region.state,
    "Citizen Journalism",
  ];

  return {
    overallVeracityScore: finalScore,
    toxicityScore: toxicity.score,
    isToxic: toxicity.status !== "approved",
    hasValidLocation,
    hasEvidenceAttachments: hasImages,
    hasReputableSources,
    veracityRating,
    recommendation,
    flags,
    suggestedTags,
  };
}

/**
 * Promotes an approved citizen submission into a full multi-language public story
 */
export async function promoteSubmissionToStory(
  submission: UploadSubmission,
  editorNotes?: string
): Promise<Story> {
  // Use our AI processor pipeline to synthesize multi-language versions, motion specs & briefs
  const result = await processArticleWithAI({
    title: submission.title,
    rawContent: submission.body,
    sourceName: `Citizen Desk: ${submission.author.name}`,
    sourceUrl: submission.sourceLinks[0] || "https://zeenews.india.com/citizen",
    genre: submission.genre,
    region: submission.region,
    authorName: submission.author.name,
  });

  const processed = result.story;

  // Attach citizen contributor metadata
  const story: Story = {
    ...processed,
    id: submission.id || `citizen-${Date.now()}`,
    imageUrl: submission.images[0] || processed.imageUrl,
    source: {
      name: `Zee Citizen Wire (${submission.author.name})`,
      url: "https://zeenews.india.com/citizen",
    },
    author: submission.author,
    status: "published",
    publishedAt: Date.now(),
  };

  return story;
}
