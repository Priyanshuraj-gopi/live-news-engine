import { GoogleGenerativeAI } from "@google/generative-ai";
import { headroomCompress, HeadroomCompressionResult } from "./headroomJudge";

export type ModelTier = "fast" | "quality" | "moderation";

export interface OmniRouteChatOptions {
  prompt: string;
  systemPrompt?: string;
  tier?: ModelTier;
  temperature?: number;
  maxTokens?: number;
  compressWithHeadroom?: boolean;
}

export interface OmniRouteChatResponse {
  content: string;
  modelUsed: string;
  tier: ModelTier;
  headroomMetrics?: HeadroomCompressionResult;
}

const OMNIROUTE_BASE_URL = process.env.OMNIROUTE_URL || "http://localhost:20128/v1";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

/**
 * OmniRoute Model Catalog per tier with auto-failover order
 */
const TIER_MODEL_COMBOS: Record<ModelTier, { omnirouteModel: string; geminiModel: string; fallbackModel: string }> = {
  fast: {
    omnirouteModel: "combo/fast",
    geminiModel: "gemini-1.5-flash",
    fallbackModel: "gemini-2.0-flash-lite",
  },
  quality: {
    omnirouteModel: "combo/quality",
    geminiModel: "gemini-1.5-pro",
    fallbackModel: "gemini-1.5-flash",
  },
  moderation: {
    omnirouteModel: "combo/moderation",
    geminiModel: "gemini-1.5-flash",
    fallbackModel: "gemini-1.5-flash",
  },
};

/**
 * Universal AI Completion with OmniRoute Multi-Provider Auto-Fallback & Headroom Compression Judge
 */
export async function generateAICompletion(
  options: OmniRouteChatOptions
): Promise<OmniRouteChatResponse | null> {
  const {
    systemPrompt,
    temperature = 0.7,
    maxTokens = 800,
    compressWithHeadroom = true,
  } = options;

  let prompt = options.prompt;
  let headroomMetrics: HeadroomCompressionResult | undefined;

  // 1. Headroom Token Judge & Reversible Compression
  if (compressWithHeadroom) {
    headroomMetrics = headroomCompress(prompt);
    prompt = headroomMetrics.compressedText;
  }

  // Determine target tier (use caller tier or Headroom recommended tier)
  const tier: ModelTier = options.tier || headroomMetrics?.recommendedModelTier || "fast";
  const modelConfig = TIER_MODEL_COMBOS[tier];

  // 2. Try OmniRoute Gateway First (localhost:20128)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${OMNIROUTE_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OMNIROUTE_API_KEY || "omniroute-default-key"}`,
      },
      body: JSON.stringify({
        model: modelConfig.omnirouteModel,
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: prompt },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        return {
          content: content.trim(),
          modelUsed: `omniroute:${modelConfig.omnirouteModel}`,
          tier,
          headroomMetrics,
        };
      }
    }
  } catch (e) {
    // OmniRoute local daemon not responding -> seamlessly failover to next best model
  }

  // 3. Fallback to Google Gemini API (Primary Model for Tier)
  if (GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: modelConfig.geminiModel });
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\nTask: ${prompt}` : prompt;
      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();
      if (text) {
        return {
          content: text.trim(),
          modelUsed: `gemini:${modelConfig.geminiModel}`,
          tier,
          headroomMetrics,
        };
      }
    } catch (geminiPrimaryErr) {
      // 4. Failover to Next Best Model (Flash tier fallback)
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const fallbackModel = genAI.getGenerativeModel({ model: modelConfig.fallbackModel });
        const fullPrompt = systemPrompt ? `${systemPrompt}\n\nTask: ${prompt}` : prompt;
        const result = await fallbackModel.generateContent(fullPrompt);
        const text = result.response.text();
        if (text) {
          return {
            content: text.trim(),
            modelUsed: `gemini-fallback:${modelConfig.fallbackModel}`,
            tier: "fast",
            headroomMetrics,
          };
        }
      } catch (geminiFallbackErr) {
        console.warn("OmniRoute and Gemini fallbacks exhausted:", geminiFallbackErr);
      }
    }
  }

  return null;
}
