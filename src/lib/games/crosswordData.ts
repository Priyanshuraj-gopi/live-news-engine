import { CrosswordPuzzle } from "./types";

export const CROSSWORD_PUZZLES: Record<string, CrosswordPuzzle> = {
  weekly: {
    id: "cw-weekly",
    title: "Weekly Affairs: Energy, Trade & Diplomacy",
    period: "weekly",
    rows: 5,
    cols: 5,
    dateStamp: "Week 41, 2026",
    theme: "Clean Energy, Global Trade Corridors & Maritime Neighbors",
    difficulty: "standard",
    clues: {
      across: [
        {
          number: 1,
          direction: "across",
          word: "SOLAR",
          row: 0,
          col: 0,
          length: 5,
          clue: "Clean renewable power driving India's national 500 GW net-zero capacity transition",
          hint: "Sun-powered green energy",
          topic: "Energy & Climate",
        },
        {
          number: 4,
          direction: "across",
          word: "TRADE",
          row: 4,
          col: 0,
          length: 5,
          clue: "Bilateral export corridors and free commerce pacts expanding across global partners",
          hint: "Commercial exchange of goods",
          topic: "Economy & Commerce",
        },
      ],
      down: [
        {
          number: 1,
          direction: "down",
          word: "SMART",
          row: 0,
          col: 0,
          length: 5,
          clue: "Digitized urban mission deploying IoT municipal sensors and automated transit",
          hint: "Intelligent cities project",
          topic: "Urban Infrastructure",
        },
        {
          number: 2,
          direction: "down",
          word: "LANKA",
          row: 0,
          col: 2,
          length: 5,
          clue: "Southern island neighbor engaging in digital payments and maritime connectivity treaties",
          hint: "Indian Ocean neighbor (Sri ___)",
          topic: "Diplomacy",
        },
        {
          number: 3,
          direction: "down",
          word: "RUPEE",
          row: 0,
          col: 4,
          length: 5,
          clue: "Sovereign Indian currency setting up bilateral international settlement mechanisms",
          hint: "National Indian currency unit",
          topic: "Central Banking",
        },
      ],
    },
  },

  monthly: {
    id: "cw-monthly",
    title: "Monthly Affairs: Sovereign & Economic Pillars",
    period: "monthly",
    rows: 6,
    cols: 6,
    dateStamp: "October 2026",
    theme: "Constitutional Identity, Union Fiscal Blueprint & Green Hydrogen",
    difficulty: "standard",
    clues: {
      across: [
        {
          number: 1,
          direction: "across",
          word: "BHARAT",
          row: 0,
          col: 0,
          length: 6,
          clue: "Constitutional civilizational name of the Republic of India (Article 1)",
          hint: "Indigenous name of the republic",
          topic: "Governance",
        },
        {
          number: 4,
          direction: "across",
          word: "GREEN",
          row: 3,
          col: 0,
          length: 5,
          clue: "Eco-conscious energy transition, rooftop solar and green hydrogen mission",
          hint: "Eco-friendly sustainability color",
          topic: "Climate",
        },
        {
          number: 5,
          direction: "across",
          word: "TAXES",
          row: 5,
          col: 0,
          length: 5,
          clue: "Direct and indirect GST revenues hitting record national collections",
          hint: "Fiscal levy collected by the treasury",
          topic: "Revenue & Finance",
        },
      ],
      down: [
        {
          number: 1,
          direction: "down",
          word: "BUDGET",
          row: 0,
          col: 0,
          length: 6,
          clue: "Annual Union fiscal blueprint presented to Parliament by the Finance Minister",
          hint: "Annual national financial blueprint",
          topic: "Fiscal Policy",
        },
        {
          number: 2,
          direction: "down",
          word: "RUPEE",
          row: 0,
          col: 3,
          length: 5,
          clue: "Sovereign currency with expanding bilateral international settlement accords",
          hint: "Official Indian currency",
          topic: "Macroeconomics",
        },
        {
          number: 3,
          direction: "down",
          word: "TOTAL",
          row: 0,
          col: 5,
          length: 5,
          clue: "Gross aggregate capital expenditure allocated for national infrastructure",
          hint: "The sum total",
          topic: "Economics",
        },
      ],
    },
  },
};

/**
 * Returns crossword puzzle based on period or day of week hash
 */
export function getActiveCrossword(period: "weekly" | "monthly" = "weekly"): CrosswordPuzzle {
  return CROSSWORD_PUZZLES[period] || CROSSWORD_PUZZLES.weekly;
}

/**
 * Build the solution grid matrix for a puzzle
 */
export function buildSolutionMatrix(puzzle: CrosswordPuzzle): (string | null)[][] {
  const matrix: (string | null)[][] = Array.from({ length: puzzle.rows }, () =>
    Array(puzzle.cols).fill(null)
  );

  for (const a of puzzle.clues.across) {
    for (let i = 0; i < a.word.length; i++) {
      matrix[a.row][a.col + i] = a.word[i].toUpperCase();
    }
  }

  for (const d of puzzle.clues.down) {
    for (let i = 0; i < d.word.length; i++) {
      matrix[d.row + i][d.col] = d.word[i].toUpperCase();
    }
  }

  return matrix;
}

/**
 * Get map of clue numbers at grid cells
 */
export function getCellNumbers(puzzle: CrosswordPuzzle): Record<string, number> {
  const numbers: Record<string, number> = {};

  for (const a of puzzle.clues.across) {
    numbers[`${a.row},${a.col}`] = a.number;
  }
  for (const d of puzzle.clues.down) {
    numbers[`${d.row},${d.col}`] = d.number;
  }

  return numbers;
}
