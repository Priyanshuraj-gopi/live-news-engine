import { generateQuizSet } from "../lib/games/quizGenerator";
import { getActiveCrossword, buildSolutionMatrix } from "../lib/games/crosswordData";
import { TWO_TRUTHS_ROUNDS, getTwoTruthsRound } from "../lib/games/twoTruthsData";
import { getRankForPoints, RANK_TIERS } from "../lib/games/engine";
import { Story } from "../types";

console.log("=== Testing Newsroom Games Engine ===");

let passed = 0;
let total = 0;

function assert(condition: boolean, msg: string) {
  total++;
  if (condition) {
    console.log(`✅ [PASS] ${msg}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${msg}`);
  }
}

// 1. Quiz Generator Test
const mockStory: Story = {
  id: "story-test-1",
  originalLanguage: "en",
  genre: "tech",
  region: { country: "India", state: "Gujarat", city: "Dholera" },
  imageUrl: "https://example.com/fab.jpg",
  dominantColor: "#1e293b",
  source: { name: "Zee News Tech", url: "https://zeenews.india.com" },
  author: { id: "a1", name: "Correspondent", role: "editor" },
  status: "published",
  createdAt: Date.now(),
  publishedAt: Date.now(),
  velocityScore: 90,
  versions: {
    en: {
      language: "en",
      headline: "Tata & PSMC Commercial Chip Fabrication Plant Accelerates in Dholera",
      summary: "India's first commercial semiconductor wafer fab achieves construction milestone in Dholera, Gujarat.",
      fullArticle: "Detailed brief on semiconductor corridors.",
      takeaways: [
        "First commercial fab in Gujarat",
        "Targeting 50,000 wafer starts monthly",
        "Partnership between Tata Electronics and Taiwan PSMC"
      ],
      motionSpec: { topic: "Semicon", mood: "analytical", palette: ["#fff"], motif: "tech" },
      updatedAt: Date.now(),
    },
  },
};

const spotlightQuiz = generateQuizSet({ stories: [mockStory], language: "en", storyId: "story-test-1" });
assert(spotlightQuiz.questions.length >= 2, "Story spotlight quiz generates questions from story takeaways");
assert(spotlightQuiz.questions[0].storyId === "story-test-1", "Questions tag the origin storyId");

const fallbackQuiz = generateQuizSet({ stories: [], language: "en" });
assert(fallbackQuiz.questions.length >= 5, "Fallback quiz set provides 5 robust current affairs questions");

const hindiQuiz = generateQuizSet({ stories: [], language: "hi" });
assert(hindiQuiz.questions[0].question.length > 10, "Hindi quiz questions render properly");

// 2. Crossword Puzzle Matrix Test
const weeklyPuzzle = getActiveCrossword("weekly");
const weeklyMatrix = buildSolutionMatrix(weeklyPuzzle);
assert(weeklyMatrix.length === 5 && weeklyMatrix[0].length === 5, "Weekly crossword has correct 5x5 dimensions");
assert(weeklyPuzzle.clues.across.length >= 2, "Weekly crossword has across clues");
assert(weeklyPuzzle.clues.down.length >= 2, "Weekly crossword has down clues");

const monthlyPuzzle = getActiveCrossword("monthly");
const monthlyMatrix = buildSolutionMatrix(monthlyPuzzle);
assert(monthlyMatrix.length === 6 && monthlyMatrix[0].length === 6, "Monthly crossword has correct 6x6 dimensions");

// 3. Two Truths & A Lie Test
assert(TWO_TRUTHS_ROUNDS.length >= 4, "Two Truths & a Lie includes multiple rotating current affairs rounds");
for (const round of TWO_TRUTHS_ROUNDS) {
  const lies = round.statements.filter((s) => s.isLie);
  const truths = round.statements.filter((s) => !s.isLie);
  assert(lies.length === 1 && truths.length === 2, `Round "${round.topic}" has exactly 1 lie and 2 truths`);
  assert(lies[0].factCheck.includes("DEBUNKED LIE"), `Lie in "${round.topic}" includes debunking explanation`);
}

// 4. Rank Ladder Test
assert(getRankForPoints(0).title === "Rookie Reader", "0 pts maps to Rookie Reader");
assert(getRankForPoints(150).title === "Fact Checker", "150 pts maps to Fact Checker");
assert(getRankForPoints(300).title === "Senior Correspondent", "300 pts maps to Senior Correspondent");
assert(getRankForPoints(750).title === "Editorial Analyst", "750 pts maps to Editorial Analyst");
assert(getRankForPoints(1200).title === "Newsroom Luminary", "1200 pts maps to Newsroom Luminary");

console.log(`\nResults: ${passed}/${total} checks passed (${Math.round((passed / total) * 100)}%)`);
if (passed === total) {
  console.log("🚀 All Newsroom Games Engine tests PASSED!");
} else {
  process.exit(1);
}
