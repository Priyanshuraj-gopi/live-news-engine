export type GameTab = "quiz" | "crossword" | "twotruths";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceHeadline?: string;
  sourceUrl?: string;
  genre: string;
  pointsValue: number;
  storyId?: string;
}

export interface QuizSet {
  id: string;
  title: string;
  description: string;
  dateStamp: string;
  questions: QuizQuestion[];
}

export interface CrosswordClue {
  number: number;
  direction: "across" | "down";
  clue: string;
  word: string;
  answer?: string;
  row: number; // 0-indexed
  col: number; // 0-indexed
  length: number;
  hint?: string;
  topic?: string;
}

export interface CrosswordPuzzle {
  id: string;
  title: string;
  period: "weekly" | "monthly";
  rows: number;
  cols: number;
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
  dateStamp: string;
  theme: string;
  difficulty: "beginner" | "standard" | "expert";
}

export interface FactStatement {
  id: string;
  text: string;
  isLie: boolean;
  factCheck: string;
  sourceCitation: string;
}

export interface TwoTruthsRound {
  id: string;
  topic: string;
  category: string;
  timeframe: "This Week" | "This Month";
  statements: [FactStatement, FactStatement, FactStatement];
  deepDive: string;
  dateStamp: string;
}

export interface NewsroomIQState {
  totalPoints: number;
  rankTitle: string;
  rankLevel: number;
  dailyStreak: number;
  lastPlayedDate: string;
  quizzesCompleted: number;
  crosswordsSolved: number;
  truthsDetected: number;
  totalCorrect: number;
  totalAnswered: number;
}
