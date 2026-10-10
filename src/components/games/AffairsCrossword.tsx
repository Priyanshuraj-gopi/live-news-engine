"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { CrosswordPuzzle, CrosswordClue } from "@/lib/games/types";
import { getActiveCrossword, buildSolutionMatrix, getCellNumbers } from "@/lib/games/crosswordData";
import { awardPoints } from "@/lib/games/engine";
import { Check, Sparkles, HelpCircle, RotateCcw, Lightbulb, Trophy, Calendar } from "lucide-react";

export function AffairsCrossword() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const puzzle: CrosswordPuzzle = useMemo(() => getActiveCrossword(period), [period]);
  const solutionMatrix = useMemo(() => buildSolutionMatrix(puzzle), [puzzle]);
  const cellNumbers = useMemo(() => getCellNumbers(puzzle), [puzzle]);

  // User input grid: (string)[][]
  const [userGrid, setUserGrid] = useState<string[][]>(() =>
    Array.from({ length: puzzle.rows }, () => Array(puzzle.cols).fill(""))
  );

  // Selected cell & direction
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [direction, setDirection] = useState<"across" | "down">("across");
  const [activeClue, setActiveClue] = useState<CrosswordClue | null>(null);

  // Status
  const [isCompleted, setIsCompleted] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Reinitialize when puzzle changes
  useEffect(() => {
    setUserGrid(Array.from({ length: puzzle.rows }, () => Array(puzzle.cols).fill("")));
    setSelectedCell({ r: 0, c: 0 });
    setDirection("across");
    setIsCompleted(false);
    setPointsAwarded(0);
    setHintMessage(null);
  }, [puzzle]);

  // Find active clue whenever selectedCell or direction changes
  useEffect(() => {
    const { r, c } = selectedCell;
    const cluesList = direction === "across" ? puzzle.clues.across : puzzle.clues.down;

    const matched = cluesList.find((clue) => {
      if (direction === "across") {
        return clue.row === r && c >= clue.col && c < clue.col + clue.length;
      } else {
        return clue.col === c && r >= clue.row && r < clue.row + clue.length;
      }
    });

    if (matched) {
      setActiveClue(matched);
    } else {
      // Try opposite direction
      const otherList = direction === "across" ? puzzle.clues.down : puzzle.clues.across;
      const otherMatch = otherList.find((clue) => {
        if (direction === "across") {
          return clue.col === c && r >= clue.row && r < clue.row + clue.length;
        } else {
          return clue.row === r && c >= clue.col && c < clue.col + clue.length;
        }
      });
      if (otherMatch) {
        setActiveClue(otherMatch);
        setDirection(direction === "across" ? "down" : "across");
      }
    }
  }, [selectedCell, direction, puzzle]);

  // Check if whole puzzle is solved
  useEffect(() => {
    if (isCompleted) return;
    let allFilled = true;
    let allCorrect = true;

    for (let r = 0; r < puzzle.rows; r++) {
      for (let c = 0; c < puzzle.cols; c++) {
        const sol = solutionMatrix[r][c];
        if (sol !== null) {
          if (!userGrid[r][c]) {
            allFilled = false;
          } else if (userGrid[r][c].toUpperCase() !== sol) {
            allCorrect = false;
          }
        }
      }
    }

    if (allFilled && allCorrect) {
      setIsCompleted(true);
      const earned = 60;
      setPointsAwarded(earned);
      awardPoints({ points: earned, correct: true, gameType: "crossword" });
    }
  }, [userGrid, solutionMatrix, puzzle, isCompleted]);

  // Cell click
  const handleCellClick = (r: number, c: number) => {
    if (solutionMatrix[r][c] === null) return;
    if (selectedCell.r === r && selectedCell.c === c) {
      // Toggle direction on second click
      setDirection((prev) => (prev === "across" ? "down" : "across"));
    } else {
      setSelectedCell({ r, c });
    }
    gridRef.current?.focus();
    mobileInputRef.current?.focus();
  };

  // Clue click
  const handleClueClick = (clue: CrosswordClue) => {
    setSelectedCell({ r: clue.row, c: clue.col });
    setDirection(clue.direction);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { r, c } = selectedCell;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      for (let nextC = c + 1; nextC < puzzle.cols; nextC++) {
        if (solutionMatrix[r][nextC] !== null) {
          setSelectedCell({ r, c: nextC });
          break;
        }
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      for (let prevC = c - 1; prevC >= 0; prevC--) {
        if (solutionMatrix[r][prevC] !== null) {
          setSelectedCell({ r, c: prevC });
          break;
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      for (let nextR = r + 1; nextR < puzzle.rows; nextR++) {
        if (solutionMatrix[nextR][c] !== null) {
          setSelectedCell({ r: nextR, c });
          break;
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      for (let prevR = r - 1; prevR >= 0; prevR--) {
        if (solutionMatrix[prevR][c] !== null) {
          setSelectedCell({ r: prevR, c });
          break;
        }
      }
    } else if (e.key === "Backspace") {
      e.preventDefault();
      const nextGrid = userGrid.map((row) => [...row]);
      if (nextGrid[r][c]) {
        nextGrid[r][c] = "";
        setUserGrid(nextGrid);
      } else {
        // If already empty, step back and clear previous
        if (direction === "across") {
          for (let prevC = c - 1; prevC >= 0; prevC--) {
            if (solutionMatrix[r][prevC] !== null) {
              nextGrid[r][prevC] = "";
              setUserGrid(nextGrid);
              setSelectedCell({ r, c: prevC });
              break;
            }
          }
        } else {
          for (let prevR = r - 1; prevR >= 0; prevR--) {
            if (solutionMatrix[prevR][c] !== null) {
              nextGrid[prevR][c] = "";
              setUserGrid(nextGrid);
              setSelectedCell({ r: prevR, c });
              break;
            }
          }
        }
      }
    } else if (e.key === " ") {
      e.preventDefault();
      setDirection((prev) => (prev === "across" ? "down" : "across"));
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      const char = e.key.toUpperCase();
      const nextGrid = userGrid.map((row) => [...row]);
      nextGrid[r][c] = char;
      setUserGrid(nextGrid);

      // Advance to next letter in word
      if (direction === "across") {
        for (let nextC = c + 1; nextC < puzzle.cols; nextC++) {
          if (solutionMatrix[r][nextC] !== null) {
            setSelectedCell({ r, c: nextC });
            break;
          }
        }
      } else {
        for (let nextR = r + 1; nextR < puzzle.rows; nextR++) {
          if (solutionMatrix[nextR][c] !== null) {
            setSelectedCell({ r: nextR, c });
            break;
          }
        }
      }
    }
  };

  // Reveal letter hint
  const handleRevealLetter = () => {
    const { r, c } = selectedCell;
    const sol = solutionMatrix[r][c];
    if (sol) {
      const nextGrid = userGrid.map((row) => [...row]);
      nextGrid[r][c] = sol;
      setUserGrid(nextGrid);
      setHintMessage(`Revealed letter at row ${r + 1}, col ${c + 1}: "${sol}" (-5 pts)`);
      setTimeout(() => setHintMessage(null), 3500);
    }
  };

  // Clear grid
  const handleClear = () => {
    setUserGrid(Array.from({ length: puzzle.rows }, () => Array(puzzle.cols).fill("")));
    setIsCompleted(false);
  };

  return (
    <div className="game-panel crossword-panel bg-[#fffdf9] border border-[#dedbd4] p-5 sm:p-7 max-w-4xl mx-auto shadow-sm">
      {/* Top Bar with Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dedbd4] mb-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#a91522]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Current Affairs Crossword</span>
            <span className="text-[#687078]">·</span>
            <span>{puzzle.dateStamp}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#202124] font-bold mt-0.5">
            {puzzle.title}
          </h2>
          <p className="text-xs text-[#687078] mt-0.5">{puzzle.theme}</p>
        </div>

        {/* Weekly / Monthly Toggle */}
        <div className="flex items-center gap-1 bg-[#f7f4ef] p-1 border border-[#dedbd4]">
          <button
            onClick={() => setPeriod("weekly")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              period === "weekly"
                ? "bg-[#d9232e] text-white shadow-xs"
                : "text-[#687078] hover:text-[#202124]"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              period === "monthly"
                ? "bg-[#d9232e] text-white shadow-xs"
                : "text-[#687078] hover:text-[#202124]"
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Puzzle Solved Flawlessly!</h3>
              <p className="text-xs text-emerald-800">
                You correctly mapped this round&apos;s key national policy and economic terminology.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-emerald-700">+{pointsAwarded} pts</span>
            <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Newsroom IQ Credited</div>
          </div>
        </div>
      )}

      {/* Active Clue Ribbon */}
      <div className="bg-[#f7f4ef] border border-[#dedbd4] p-3 mb-6 flex items-center gap-3 text-xs text-[#202124]">
        <span className="px-2 py-0.5 bg-[#d9232e] text-white font-bold text-[10px] uppercase tracking-wider shrink-0">
          {direction === "across" ? "Across" : "Down"} {activeClue ? `#${activeClue.number}` : ""}
        </span>
        <span className="font-medium flex-1">
          {activeClue ? activeClue.clue : "Select any letter cell on the grid"}
        </span>
        {activeClue?.hint && (
          <span className="text-[11px] text-[#687078] italic hidden sm:inline">
            Hint: {activeClue.hint}
          </span>
        )}
      </div>

      {/* Main Grid + Clues Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Crossword Grid */}
        <div
          ref={gridRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-[#f2eee8] border border-[#dedbd4] outline-none focus:ring-2 focus:ring-[#d9232e] relative"
        >
          <input
            ref={mobileInputRef}
            type="text"
            className="sr-only opacity-0 absolute pointer-events-none"
            aria-label="Crossword mobile letter input"
            onChange={(e) => {
              const val = e.target.value.slice(-1);
              if (/^[a-zA-Z]$/.test(val)) {
                const fakeEvent = {
                  key: val,
                  preventDefault: () => {},
                } as unknown as React.KeyboardEvent;
                handleKeyDown(fakeEvent);
              }
              e.target.value = "";
            }}
          />
          <div
            className="grid gap-1 bg-[#202124] p-1.5 border border-[#202124]"
            style={{
              gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))`,
              width: "min(340px, 100%)",
            }}
          >
            {userGrid.map((row, r) =>
              row.map((val, c) => {
                const isBlack = solutionMatrix[r][c] === null;
                const isSelected = selectedCell.r === r && selectedCell.c === c;
                const cellNum = cellNumbers[`${r},${c}`];

                // Check if in active word
                let isInActiveWord = false;
                if (activeClue) {
                  if (activeClue.direction === "across") {
                    isInActiveWord =
                      r === activeClue.row && c >= activeClue.col && c < activeClue.col + activeClue.length;
                  } else {
                    isInActiveWord =
                      c === activeClue.col && r >= activeClue.row && r < activeClue.row + activeClue.length;
                  }
                }

                if (isBlack) {
                  return (
                    <div
                      key={`${r}-${c}`}
                      className="aspect-square bg-[#202124] select-none"
                    />
                  );
                }

                let cellBg = "bg-white text-[#202124]";
                if (isSelected) {
                  cellBg = "bg-[#d9232e] text-white font-bold";
                } else if (isInActiveWord) {
                  cellBg = "bg-[#fbe9ea] text-[#202124]";
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    className={`relative aspect-square flex items-center justify-center font-bold text-sm sm:text-base border border-[#dedbd4] transition-colors select-none ${cellBg}`}
                  >
                    {cellNum && (
                      <span className={`absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-bold leading-none ${isSelected ? "text-white/90" : "text-[#687078]"}`}>
                        {cellNum}
                      </span>
                    )}
                    <span className="mt-1">{val}</span>
                  </button>
                );
              })
            )}
          </div>

          <div className="text-[11px] text-[#687078] mt-3 text-center">
            Click cells to type letters. Press <strong>Space</strong> to switch Across/Down.
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-3 border-t border-[#dedbd4] w-full">
            <button
              onClick={handleRevealLetter}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#dedbd4] hover:border-[#a91522] text-[#202124] text-[11px] font-bold uppercase tracking-wider transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>Reveal Letter</span>
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#dedbd4] hover:border-[#a91522] text-[#202124] text-[11px] font-bold uppercase tracking-wider transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#687078]" />
              <span>Clear</span>
            </button>
          </div>

          {hintMessage && (
            <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded">
              {hintMessage}
            </div>
          )}
        </div>

        {/* Clues Panel */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Across Clues */}
          <div className="bg-[#fffdf9] p-4 border border-[#dedbd4]">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#a91522] pb-2 border-b border-[#dedbd4] mb-3 flex items-center gap-1.5">
              <span>Across</span>
            </h3>
            <div className="space-y-3">
              {puzzle.clues.across.map((clue) => {
                const isActive = activeClue?.number === clue.number && direction === "across";
                return (
                  <button
                    key={`across-${clue.number}`}
                    onClick={() => handleClueClick(clue)}
                    className={`w-full text-left p-2 border transition-all text-xs ${
                      isActive
                        ? "border-[#d9232e] bg-[#fbe9ea] text-[#202124] font-semibold"
                        : "border-transparent hover:bg-[#f7f4ef] text-[#202124]"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#a91522] text-[11px] shrink-0">
                        {clue.number}.
                      </span>
                      <div className="flex-1 leading-snug">
                        {clue.clue}
                        {clue.topic && (
                          <span className="block text-[10px] text-[#687078] mt-0.5">
                            [{clue.topic}]
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Down Clues */}
          <div className="bg-[#fffdf9] p-4 border border-[#dedbd4]">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#164e8b] pb-2 border-b border-[#dedbd4] mb-3 flex items-center gap-1.5">
              <span>Down</span>
            </h3>
            <div className="space-y-3">
              {puzzle.clues.down.map((clue) => {
                const isActive = activeClue?.number === clue.number && direction === "down";
                return (
                  <button
                    key={`down-${clue.number}`}
                    onClick={() => handleClueClick(clue)}
                    className={`w-full text-left p-2 border transition-all text-xs ${
                      isActive
                        ? "border-[#164e8b] bg-blue-50 text-[#202124] font-semibold"
                        : "border-transparent hover:bg-[#f7f4ef] text-[#202124]"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#164e8b] text-[11px] shrink-0">
                        {clue.number}.
                      </span>
                      <div className="flex-1 leading-snug">
                        {clue.clue}
                        {clue.topic && (
                          <span className="block text-[10px] text-[#687078] mt-0.5">
                            [{clue.topic}]
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
