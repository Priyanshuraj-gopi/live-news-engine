import { z } from "zod";

// ----------------------------------------------------
// Core Enums & Literals
// ----------------------------------------------------

export const LanguageCodes = ["en", "hi", "kn", "ta", "te", "mr", "bn"] as const;
export type LanguageCode = (typeof LanguageCodes)[number];

export const Genres = [
  "sports",
  "politics",
  "markets",
  "weather",
  "tech",
  "entertainment",
  "crime",
  "health",
] as const;
export type Genre = (typeof Genres)[number];

export const UserRoles = ["reader", "contributor", "editor", "admin"] as const;
export type UserRole = (typeof UserRoles)[number];

export const StoryStatuses = ["draft", "review", "published", "archived"] as const;
export type StoryStatus = (typeof StoryStatuses)[number];

// ----------------------------------------------------
// Zod Schemas
// ----------------------------------------------------

export const RegionSchema = z.object({
  country: z.string().default("India"),
  state: z.string(),
  city: z.string(),
});
export type Region = z.infer<typeof RegionSchema>;

export const MotionSpecSchema = z.object({
  topic: z.string(),
  mood: z.enum(["urgent", "celebratory", "analytical", "grave", "inspiring", "dynamic"]),
  palette: z.array(z.string()),
  motif: z.enum(["sports", "politics", "markets", "weather", "tech", "entertainment", "crime", "health"]),
});
export type MotionSpec = z.infer<typeof MotionSpecSchema>;

export const StoryVersionSchema = z.object({
  language: z.enum(LanguageCodes),
  headline: z.string().min(5).max(180),
  summary: z.string().min(20).max(600), // ~60 words
  fullArticle: z.string().min(50),
  takeaways: z.array(z.string()).min(3).max(5),
  motionSpec: MotionSpecSchema,
  audioUrl: z.string().nullable().optional(),
  updatedAt: z.number().or(z.string()),
});
export type StoryVersion = z.infer<typeof StoryVersionSchema>;
export type StoryTranslation = StoryVersion;

export const StorySchema = z.object({
  id: z.string(),
  originalLanguage: z.enum(LanguageCodes),
  genre: z.enum(Genres),
  region: RegionSchema,
  imageUrl: z.string().url(),
  dominantColor: z.string().default("#1e293b"),
  source: z.object({
    name: z.string(),
    url: z.string(),
  }),
  author: z.object({
    id: z.string(),
    name: z.string(),
    role: z.enum(UserRoles),
  }),
  status: z.enum(StoryStatuses),
  createdAt: z.number().or(z.string()),
  publishedAt: z.number().or(z.string()),
  velocityScore: z.number().default(0),
  versions: z.record(z.enum(LanguageCodes), StoryVersionSchema).optional(),
});
export type Story = z.infer<typeof StorySchema>;

export const UserSignalSchema = z.object({
  userId: z.string(),
  storyId: z.string(),
  genre: z.enum(Genres),
  region: z.object({
    state: z.string(),
    city: z.string(),
  }),
  language: z.enum(LanguageCodes),
  dwellTimeSeconds: z.number().min(0),
  readMoreClicked: z.boolean().default(false),
  shared: z.boolean().default(false),
  skipped: z.boolean().default(false),
  participatedChat: z.boolean().default(false),
  timestamp: z.number().or(z.string()),
});
export type UserSignal = z.infer<typeof UserSignalSchema>;

export const ChatMessageSchema = z.object({
  id: z.string(),
  storyId: z.string(),
  userId: z.string(),
  userName: z.string(),
  userAvatar: z.string().optional(),
  userCredibilityLevel: z.number().int().min(1).max(5).default(1),
  content: z.string().min(1).max(500),
  toxicityScore: z.number().min(0).max(1).default(0),
  status: z.enum(["approved", "flagged", "hidden"]).default("approved"),
  reactions: z.record(z.string(), z.number()).default({}),
  createdAt: z.number().or(z.string()),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const CredibilityProfileSchema = z.object({
  userId: z.string(),
  overallScore: z.number().min(0).max(100).default(10),
  level: z.number().min(1).max(5).default(1), // 1: Novice, 2: Observer, 3: Contributor, 4: Analyst, 5: Luminary
  readingScore: z.number().min(0).max(100).default(10),
  debateQualityScore: z.number().min(0).max(100).default(0),
  peerReactionScore: z.number().min(0).max(100).default(0),
  penalties: z.number().default(0),
  badges: z.array(z.string()).default([]),
  expertiseTags: z.array(z.string()).default([]),
  updatedAt: z.number().or(z.string()),
});
export type CredibilityProfile = z.infer<typeof CredibilityProfileSchema>;

export const UploadSubmissionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5).max(200),
  originalLanguage: z.enum(LanguageCodes),
  genre: z.enum(Genres),
  region: RegionSchema,
  body: z.string().min(50),
  images: z.array(z.string().url()).min(1),
  sourceLinks: z.array(z.string().url()),
  author: z.object({
    id: z.string(),
    name: z.string(),
    role: z.enum(UserRoles),
  }),
  verificationNotes: z.string().optional(),
  status: z.enum(["draft", "review", "approved", "rejected"]).default("review"),
  createdAt: z.number().or(z.string()),
});
export type UploadSubmission = z.infer<typeof UploadSubmissionSchema>;

export const RecommendedChannelSchema = z.object({
  channel: z.enum(["web", "youtube_shorts", "instagram_reels", "x", "whatsapp"]),
  fitScore: z.number().min(0).max(100),
  rationale: z.string(),
});

export const RecommendedMonetisationSchema = z.object({
  model: z.enum(["ads", "sponsorship", "subscription", "affiliate"]),
  projectedYield: z.enum(["High", "Medium", "Low"]),
  reason: z.string(),
});

export const AdminInsightSchema = z.object({
  storyId: z.string(),
  predictedInterest: z.record(z.string(), z.number()),
  recommendedChannels: z.array(RecommendedChannelSchema),
  recommendedMonetisation: z.array(RecommendedMonetisationSchema),
  computedAt: z.number().or(z.string()),
});
export type AdminInsight = z.infer<typeof AdminInsightSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  photoURL: z.string().optional(),
  role: z.enum(UserRoles).default("reader"),
  credibilityLevel: z.number().int().min(1).max(5).default(1),
  createdAt: z.number().or(z.string()),
});
export type User = z.infer<typeof UserSchema>;

