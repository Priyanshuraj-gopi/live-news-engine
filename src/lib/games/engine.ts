import { NewsroomIQState } from "./types";

const STORAGE_KEY = "newsengine_arcade_iq_v1";

export const RANK_TIERS = [
  { minPoints: 0, level: 1, title: "Rookie Reader", color: "#64748B", badge: "Level 1 · Rookie" },
  { minPoints: 100, level: 2, title: "Fact Checker", color: "#0284C7", badge: "Level 2 · Fact Checker" },
  { minPoints: 250, level: 3, title: "Senior Correspondent", color: "#10B981", badge: "Level 3 · Correspondent" },
  { minPoints: 500, level: 4, title: "Editorial Analyst", color: "#F59E0B", badge: "Level 4 · Analyst" },
  { minPoints: 1000, level: 5, title: "Newsroom Luminary", color: "#8B5CF6", badge: "Level 5 · Luminary" },
];

export function getRankForPoints(points: number) {
  let matched = RANK_TIERS[0];
  for (const tier of RANK_TIERS) {
    if (points >= tier.minPoints) {
      matched = tier;
    }
  }
  return matched;
}

export function getDefaultIQState(): NewsroomIQState {
  return {
    totalPoints: 0,
    rankTitle: "Rookie Reader",
    rankLevel: 1,
    dailyStreak: 1,
    lastPlayedDate: new Date().toISOString().split("T")[0],
    quizzesCompleted: 0,
    crosswordsSolved: 0,
    truthsDetected: 0,
    totalCorrect: 0,
    totalAnswered: 0,
  };
}

export function loadIQState(): NewsroomIQState {
  if (typeof window === "undefined") {
    return getDefaultIQState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultIQState();
    const parsed = JSON.parse(raw);
    const rank = getRankForPoints(parsed.totalPoints || 0);
    return {
      ...getDefaultIQState(),
      ...parsed,
      rankTitle: rank.title,
      rankLevel: rank.level,
    };
  } catch (err) {
    console.error("Failed to load Newsroom IQ state:", err);
    return getDefaultIQState();
  }
}

export function saveIQState(state: NewsroomIQState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("newsengine:iq_updated", { detail: state }));
  } catch (err) {
    console.error("Failed to save Newsroom IQ state:", err);
  }
}

export function awardPoints(params: {
  points: number;
  correct: boolean;
  gameType: "quiz" | "crossword" | "twotruths";
}): NewsroomIQState {
  const current = loadIQState();
  const today = new Date().toISOString().split("T")[0];

  // Calculate streak
  let newStreak = current.dailyStreak;
  if (current.lastPlayedDate !== today) {
    const lastDate = new Date(current.lastPlayedDate);
    const now = new Date(today);
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  }

  const newTotalPoints = Math.max(0, current.totalPoints + params.points);
  const rank = getRankForPoints(newTotalPoints);

  const updated: NewsroomIQState = {
    ...current,
    totalPoints: newTotalPoints,
    rankTitle: rank.title,
    rankLevel: rank.level,
    dailyStreak: newStreak,
    lastPlayedDate: today,
    totalCorrect: current.totalCorrect + (params.correct ? 1 : 0),
    totalAnswered: current.totalAnswered + 1,
    quizzesCompleted: current.quizzesCompleted + (params.gameType === "quiz" ? 1 : 0),
    crosswordsSolved: current.crosswordsSolved + (params.gameType === "crossword" && params.correct ? 1 : 0),
    truthsDetected: current.truthsDetected + (params.gameType === "twotruths" && params.correct ? 1 : 0),
  };

  saveIQState(updated);
  return updated;
}
