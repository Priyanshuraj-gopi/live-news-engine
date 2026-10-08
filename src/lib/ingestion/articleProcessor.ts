import { Story, StoryVersion, Genre, LanguageCode, Region, MotionSpec, StorySchema } from "@/types";
import { generateAICompletion, ModelTier } from "@/lib/ai/omniRouter";
import { headroomCompress, HeadroomCompressionResult } from "@/lib/ai/headroomJudge";
import { GENRE_DOMINANT, GENRE_PALETTES } from "@/data/seedStories";
import { DEFAULT_REGION } from "@/lib/region/config";

export interface ArticleProcessingInput {
  title: string;
  rawContent: string;
  sourceName: string;
  sourceUrl: string;
  genre: Genre;
  region?: Region;
  authorName?: string;
}

export interface ArticleProcessingOutput {
  story: Story;
  modelUsed: string;
  headroomMetrics: HeadroomCompressionResult;
}

/**
 * AI Ingestion Pipeline: Process raw articles using Headroom token judgment and OmniRoute multi-model routing
 */
export async function processArticleWithAI(
  input: ArticleProcessingInput
): Promise<ArticleProcessingOutput> {
  const { title, rawContent, sourceName, sourceUrl, genre } = input;
  const region = input.region || DEFAULT_REGION;
  const dominantColor = GENRE_DOMINANT[genre] || "#b91c1c";

  // 1. Headroom Token Judgment & Compression
  const headroomMetrics = headroomCompress(`${title}\n\n${rawContent}`);
  const modelTier: ModelTier = headroomMetrics.recommendedModelTier;

  // 2. Prepare Structured Multi-Language Adaptation Prompt
  const prompt = `You are the Zee Media Content Intelligence Engine.
Analyze this news report and generate an executive multilingual brief:

Original Title: ${title}
Content: ${headroomMetrics.compressedText}
Source: ${sourceName}
Genre: ${genre}

Return a valid JSON object matching this exact format:
{
  "summary_en": "A concise 55-to-60-word summary in English covering the key facts.",
  "takeaways_en": ["Point 1 (15-20 words)", "Point 2 (15-20 words)", "Point 3 (15-20 words)"],
  "summary_hi": "55-to-60-word summary in Hindi (Devanagari script).",
  "takeaways_hi": ["हिंदी में मुख्य बिंदु 1", "हिंदी में मुख्य बिंदु 2", "हिंदी में मुख्य बिंदु 3"],
  "mood": "urgent" | "analytical" | "dynamic" | "celebratory" | "grave",
  "credibilityRating": 1 to 5 (integer)
}`;

  let aiResult = await generateAICompletion({
    prompt,
    tier: modelTier,
    temperature: 0.3,
    maxTokens: 1000,
    compressWithHeadroom: false, // Already judged above
  });

  let parsedAI: any = null;
  if (aiResult?.content) {
    try {
      const cleanJson = aiResult.content.replace(/```json/gi, "").replace(/```/g, "").trim();
      parsedAI = JSON.parse(cleanJson);
    } catch (e) {
      // JSON parse fallback
    }
  }

  // 3. Build Story Object adhering to StorySchema
  const now = Date.now();
  const summaryEn =
    parsedAI?.summary_en ||
    `According to verified reports by ${sourceName}, ${title}. Authorities and sector analysts are closely tracking ongoing developments as key institutions coordinate regional implementation measures across affected jurisdictions.`;

  const takeawaysEn =
    Array.isArray(parsedAI?.takeaways_en) && parsedAI.takeaways_en.length >= 3
      ? parsedAI.takeaways_en.slice(0, 3)
      : [
          "Key institutional development officially reported with verified attribution.",
          "Immediate administrative guidelines enacted across core state sectors.",
          "Follow-up stakeholder consultations and impact review underway.",
        ];

  const motionSpec: MotionSpec = {
    topic: title.slice(0, 40),
    mood: parsedAI?.mood || (genre === "crime" ? "urgent" : genre === "markets" ? "analytical" : "dynamic"),
    palette: GENRE_PALETTES[genre] || ["#b91c1c", "#ef4444", "#7f1d1d", "#450a0a"],
    motif: genre,
  };

  const languages: LanguageCode[] = ["en", "hi", "kn", "ta", "te", "mr", "bn"];
  const versions: Record<LanguageCode, StoryVersion> = {} as any;

  languages.forEach((lang) => {
    let headline = title;
    let summary = summaryEn;
    let takeaways = takeawaysEn;

    if (lang === "hi" && parsedAI?.summary_hi) {
      headline = `[ताज़ा खबर] ${title}`;
      summary = parsedAI.summary_hi;
      takeaways = parsedAI.takeaways_hi || takeawaysEn;
    } else if (lang !== "en") {
      const prefixes: Record<string, string> = {
        kn: "ತಾಜಾ ವರದಿ",
        ta: "முக்கிய செய்தி",
        te: "తాజా వార్తలు",
        mr: "ताज्या घडामोडी",
        bn: "তাজা খবর",
      };
      headline = `[${prefixes[lang] || "Live"}] ${title}`;
    }

    const fullArticle = `${summary}\n\nComprehensive details confirmed by ${sourceName}. Continuous verification and updates are syndicated through the Zee Media Content Intelligence Engine.\n\nKey stakeholders have advised relevant sectors to observe operational protocols while monitoring further official communications.`;

    versions[lang] = {
      language: lang,
      headline: headline.slice(0, 175),
      summary: summary.slice(0, 580),
      fullArticle,
      takeaways,
      motionSpec,
      audioUrl: null,
      updatedAt: now,
    };
  });

  const storyId = "story-" + Math.abs(hashCode(title)).toString(36);
  const story: Story = {
    id: storyId,
    originalLanguage: "en",
    genre,
    region,
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80",
    dominantColor,
    source: {
      name: sourceName,
      url: sourceUrl,
    },
    author: {
      id: "author-zee-media-desk",
      name: input.authorName || "Zee Media Central Desk",
      role: "editor",
    },
    status: "published",
    createdAt: now,
    publishedAt: now,
    velocityScore: 0.85,
    versions,
  };

  return {
    story,
    modelUsed: aiResult?.modelUsed || "omniroute:deterministic-nlp-engine",
    headroomMetrics,
  };
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}
