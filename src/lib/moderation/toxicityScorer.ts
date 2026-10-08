export interface ToxicityResult {
  score: number;
  status: "approved" | "flagged" | "hidden";
  flaggedReasons: string[];
}

// Regex word lists for profanity, harassment, hate speech, and spam patterns
const TOXIC_PATTERNS = [
  /\b(hate|kill|idiot|stupid|moron|dumb|fraud|scammer|bastard|fake news)\b/i,
  /\b(chutiya|harami|kutta|kamina|bhadwa|gandu)\b/i,
  /\b(buy now|click here|free cash|crypto scam|telegram link|whatsapp \+\d+)\b/i,
];

const SEVERE_PATTERNS = [
  /\b(death to|bomb|terrorist attack|genocide|rape)\b/i,
];

/**
 * Toxicity Scorer & Civil Moderation Guard
 * Evaluates message text and returns a score from 0.0 to 1.0
 */
export function evaluateToxicity(text: string): ToxicityResult {
  if (!text || text.trim().length === 0) {
    return { score: 0, status: "approved", flaggedReasons: [] };
  }

  const clean = text.toLowerCase().trim();
  const flaggedReasons: string[] = [];
  let score = 0.05; // Base ambient noise score

  // Check severe violations
  for (const pattern of SEVERE_PATTERNS) {
    if (pattern.test(clean)) {
      score = 0.95;
      flaggedReasons.push("Severe toxicity or violent incitement");
      return { score, status: "hidden", flaggedReasons };
    }
  }

  // Check standard abusive / spam patterns
  for (const pattern of TOXIC_PATTERNS) {
    if (pattern.test(clean)) {
      score += 0.35;
      flaggedReasons.push("Offensive or non-civil terminology detected");
    }
  }

  // Check aggressive all-caps screaming (e.g. "YOU ARE ALL LIARS")
  const lettersOnly = text.replace(/[^a-zA-Z]/g, "");
  if (lettersOnly.length > 8 && lettersOnly === lettersOnly.toUpperCase()) {
    score += 0.2;
    flaggedReasons.push("Excessive shouting / all-caps emphasis");
  }

  // Check excessive repeated exclamation or question marks (e.g. "WHAT???!!!!")
  if (/([!?]){4,}/.test(text)) {
    score += 0.15;
    flaggedReasons.push("Excessive aggressive punctuation");
  }

  const finalScore = Math.min(1.0, Math.max(0.0, Number(score.toFixed(2))));
  const status = finalScore >= 0.7 ? "flagged" : "approved";

  return {
    score: finalScore,
    status,
    flaggedReasons,
  };
}
