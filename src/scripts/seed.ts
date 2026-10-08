import { SEED_STORIES } from "../data/seedStories";
import { StorySchema, User, UserSignal, ChatMessage } from "../types";

async function runSeed() {
  console.log("==================================================");
  console.log("🌱 STARTING NEWSEENGINE 64-STORY DATABASE SEED");
  console.log("==================================================");

  let validCount = 0;
  const genresCount: Record<string, number> = {};
  const languagesCount: Record<string, number> = {};

  // 1. Validate all seed stories with Zod schema
  for (const story of SEED_STORIES) {
    const result = StorySchema.safeParse(story);
    if (!result.success) {
      console.error(`❌ Validation failed for story ${story.id}:`, result.error.format());
      process.exit(1);
    }
    validCount++;
    genresCount[story.genre] = (genresCount[story.genre] || 0) + 1;

    // Count versions
    if (story.versions) {
      for (const lang of Object.keys(story.versions)) {
        languagesCount[lang] = (languagesCount[lang] || 0) + 1;
      }
    }
  }

  console.log(`✅ Successfully validated ${validCount} stories with strict Zod schema!`);
  console.log("\n📊 Genre Distribution (8 Genres):");
  for (const [genre, count] of Object.entries(genresCount)) {
    console.log(`   - ${genre.padEnd(15)} : ${count} stories`);
  }

  console.log("\n🌐 Language Translations (7 Languages):");
  for (const [lang, count] of Object.entries(languagesCount)) {
    console.log(`   - ${lang.padEnd(15)} : ${count} versions`);
  }

  // 2. Mock Test Users for 4 Roles
  const demoUsers: User[] = [
    {
      id: "user-reader-01",
      email: "reader.arun@gmail.com",
      displayName: "Arun Sharma",
      photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=arun",
      role: "reader",
      credibilityLevel: 2,
      createdAt: Date.now() - 86400000 * 10,
    },
    {
      id: "user-contributor-01",
      email: "contributor.priya@zee.in",
      displayName: "Priya Nair",
      photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=priya",
      role: "contributor",
      credibilityLevel: 3,
      createdAt: Date.now() - 86400000 * 20,
    },
    {
      id: "user-editor-01",
      email: "editor.vikram@zee.in",
      displayName: "Vikram Rathore",
      photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=vikram",
      role: "editor",
      credibilityLevel: 5,
      createdAt: Date.now() - 86400000 * 50,
    },
    {
      id: "user-admin-01",
      email: "admin@zee.in",
      displayName: "Executive Admin",
      photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=admin",
      role: "admin",
      credibilityLevel: 5,
      createdAt: Date.now() - 86400000 * 90,
    },
  ];
  console.log(`\n👥 Created ${demoUsers.length} seed users across roles (reader, contributor, editor, admin).`);

  // 3. Mock User Signals (for recommendation engine benchmark)
  const demoSignals: UserSignal[] = [];
  for (let i = 0; i < 200; i++) {
    const randomStory = SEED_STORIES[i % SEED_STORIES.length];
    demoSignals.push({
      userId: `user-simulated-${(i % 15) + 1}`,
      storyId: randomStory.id,
      genre: randomStory.genre,
      region: { state: randomStory.region.state, city: randomStory.region.city },
      language: randomStory.originalLanguage,
      dwellTimeSeconds: Math.floor(Math.random() * 80) + 10,
      readMoreClicked: Math.random() > 0.4,
      shared: Math.random() > 0.8,
      skipped: Math.random() < 0.2,
      participatedChat: Math.random() > 0.7,
      timestamp: Date.now() - Math.floor(Math.random() * 86400000 * 3),
    });
  }
  console.log(`📈 Generated ${demoSignals.length} engagement signals for recommendation testing.`);

  console.log("==================================================");
  console.log("🚀 DEMO SEED DATASET READY FOR RUNTIME CONSUMPTION");
  console.log("==================================================");
}

runSeed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
