export interface HeadroomCompressionResult {
  originalText: string;
  compressedText: string;
  originalTokens: number;
  compressedTokens: number;
  tokensSaved: number;
  compressionRatio: number;
  vaultId: string;
  recommendedModelTier: "fast" | "quality" | "moderation";
}

/**
 * Local in-memory vault cache for reversible uncompressed text retrieval (CCR)
 */
const HEADROOM_VAULT = new Map<string, string>();

/**
 * Fast token estimation (~4 characters per token for English, ~2 for multilingual)
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 3.8);
}

/**
 * Simple hash code for vault chunk identification
 */
function hashText(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return "vault-" + Math.abs(hash).toString(36);
}

/**
 * Headroom Judge & SmartCrusher for news articles and prompts
 * Slashes unnecessary tokens while preserving quotes, figures, and factual entities.
 */
export function headroomCompress(rawText: string): HeadroomCompressionResult {
  const originalTokens = estimateTokens(rawText);
  const vaultId = hashText(rawText);

  // Store in reversible local vault
  HEADROOM_VAULT.set(vaultId, rawText);

  if (originalTokens < 80) {
    // Already compact, no aggressive compression needed
    return {
      originalText: rawText,
      compressedText: rawText,
      originalTokens,
      compressedTokens: originalTokens,
      tokensSaved: 0,
      compressionRatio: 0,
      vaultId,
      recommendedModelTier: "fast",
    };
  }

  // SmartCrusher pipeline:
  // 1. Strip repetitive journalistic boilerplate & disclaimers
  let cleaned = rawText
    .replace(/(also read:|read more:|click here to read|subscribe now|follow us on|download the app)[\s\S]*?(?=\n|$)/gi, "")
    .replace(/(disclaimer:[\s\S]*?editorial policies\.?)/gi, "")
    .replace(/\b(advertisement|sponsored content|promoted story)\b/gi, "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/<[^>]*>/g, " ");

  // 2. Collapse excess whitespace and duplicate punctuation
  cleaned = cleaned
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .replace(/\.{2,}/g, ".")
    .trim();

  // 3. Extract core declarative sentences if the text is very long (> 2000 chars)
  if (cleaned.length > 2500) {
    const sentences = cleaned.split(/(?<=[.?!])\s+/);
    // Keep first 4 sentences (lead context), middle key sentences with numbers/quotes, and final sentence
    const salient = sentences.filter((s, i) => {
      if (i < 4 || i === sentences.length - 1) return true;
      return /\b\d+\b|"|'|percent|crore|lakh|minister|official|statement/i.test(s);
    });
    cleaned = salient.slice(0, 15).join(" ");
  }

  const compressedTokens = estimateTokens(cleaned);
  const tokensSaved = Math.max(0, originalTokens - compressedTokens);
  const compressionRatio = originalTokens > 0 ? tokensSaved / originalTokens : 0;

  // Headroom Judge model tier recommendation:
  // Dense analytical or long text -> quality model; standard briefs -> fast model
  const recommendedModelTier =
    originalTokens > 800 || /investigation|scandal|geopolitical|budget|treaty|verdict/i.test(rawText)
      ? "quality"
      : "fast";

  return {
    originalText: rawText,
    compressedText: cleaned,
    originalTokens,
    compressedTokens,
    tokensSaved,
    compressionRatio: Number(compressionRatio.toFixed(2)),
    vaultId,
    recommendedModelTier,
  };
}

/**
 * Reversible retrieval of uncompressed text from the Headroom local vault
 */
export function headroomRetrieve(vaultId: string): string | null {
  return HEADROOM_VAULT.get(vaultId) || null;
}
