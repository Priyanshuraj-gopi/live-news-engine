"use client";

import React, { useState } from "react";
import { TwoTruthsRound, FactStatement } from "@/lib/games/types";
import { TWO_TRUTHS_ROUNDS, getTwoTruthsRound } from "@/lib/games/twoTruthsData";
import { awardPoints } from "@/lib/games/engine";
import { AlertCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, ShieldAlert, Sparkles, BookOpen } from "lucide-react";

export function TwoTruthsAndLie() {
  const [roundIndex, setRoundIndex] = useState(0);
  const currentRound: TwoTruthsRound = getTwoTruthsRound(roundIndex);

  const [selectedStatementId, setSelectedStatementId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [pointsEarned, setPointsAwarded] = useState(0);

  const handleSelect = (stmt: FactStatement) => {
    if (isRevealed) return;
    setSelectedStatementId(stmt.id);
    setIsRevealed(true);

    if (stmt.isLie) {
      // Caught the lie!
      const pts = 30;
      setPointsAwarded(pts);
      awardPoints({ points: pts, correct: true, gameType: "twotruths" });
    } else {
      // Picked a true fact mistakenly
      setPointsAwarded(0);
      awardPoints({ points: 0, correct: false, gameType: "twotruths" });
    }
  };

  const handleNextRound = () => {
    setSelectedStatementId(null);
    setIsRevealed(false);
    setPointsAwarded(0);
    setRoundIndex((prev) => (prev + 1) % TWO_TRUTHS_ROUNDS.length);
  };

  const selectedStmt = currentRound.statements.find((s) => s.id === selectedStatementId);
  const guessedCorrectly = selectedStmt?.isLie === true;

  return (
    <div className="game-panel truths-panel bg-[#fffdf9] border border-[#dedbd4] p-5 sm:p-7 max-w-3xl mx-auto shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dedbd4] mb-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#a91522]">
            <span className="w-2 h-2 rounded-full bg-[#d9232e] animate-pulse" />
            <span>Fact Check Duel</span>
            <span className="text-[#687078]">·</span>
            <span>{currentRound.timeframe}</span>
            <span className="text-[#687078]">·</span>
            <span className="text-[#687078]">{currentRound.category}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#202124] font-bold mt-0.5">
            2 Truths &amp; 1 Lie
          </h2>
          <p className="text-xs text-[#687078] mt-0.5">
            Topic: <strong>{currentRound.topic}</strong>
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-[#687078]">
            Round <strong>{roundIndex + 1}</strong> of {TWO_TRUTHS_ROUNDS.length}
          </span>
          <div className="text-[10px] text-[#a91522] font-bold mt-0.5">
            +30 IQ pts for spotting the lie
          </div>
        </div>
      </div>

      {/* Instructions Prompt */}
      <div className="bg-[#f7f4ef] p-3 border-l-4 border-[#d9232e] mb-6 text-xs text-[#202124] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#d9232e] shrink-0" />
          <span>
            {isRevealed
              ? "Editorial Fact Check Breakdown rendered below:"
              : "Read carefully: Two statements below are verified facts. One statement is a fabrication. Click the one you believe is THE LIE."}
          </span>
        </div>
      </div>

      {/* Statements Stack */}
      <div className="space-y-4 mb-6">
        {currentRound.statements.map((stmt, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C
          const isSelected = selectedStatementId === stmt.id;

          let cardClasses = "border-[#dedbd4] hover:border-[#a91522] bg-white text-[#202124]";
          if (isRevealed) {
            if (stmt.isLie) {
              cardClasses = "border-[#d9232e] bg-red-50 text-red-950 ring-2 ring-[#d9232e]/30";
            } else {
              cardClasses = "border-[#10B981] bg-emerald-50 text-emerald-950";
            }
          }

          return (
            <div
              key={stmt.id}
              onClick={() => handleSelect(stmt)}
              className={`p-4 sm:p-5 border transition-all cursor-pointer ${cardClasses}`}
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                  {letter}
                </span>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#687078]">
                      Statement {letter}
                    </span>
                    {isRevealed && (
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${
                          stmt.isLie
                            ? "bg-[#d9232e] text-white"
                            : "bg-[#10B981] text-white"
                        }`}
                      >
                        {stmt.isLie ? "DEBUNKED LIE" : "VERIFIED FACT"}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed">{stmt.text}</p>

                  {/* Fact-check citation breakdown shown after click */}
                  {isRevealed && (
                    <div className="mt-3 pt-3 border-t border-current/15 text-xs space-y-1 animate-in fade-in duration-300">
                      <div className="font-semibold">{stmt.factCheck}</div>
                      <div className="text-[10px] opacity-75">
                        Citation: {stmt.sourceCitation}
                      </div>
                    </div>
                  )}
                </div>

                {isRevealed && (
                  <div className="shrink-0 mt-1">
                    {stmt.isLie ? (
                      <XCircle className="w-5 h-5 text-[#d9232e]" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Results and Next Round Bar */}
      {isRevealed && (
        <div className="p-4 bg-[#f2eee8] border border-[#dedbd4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div>
            <div className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              {guessedCorrectly ? (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Eagle-Eyed Fact Checker! +{pointsEarned} IQ Points</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-[#d9232e]" />
                  <span className="text-[#a91522]">Fooled by the Lie! Review the verified citation above.</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-[#687078] mt-1 max-w-md">
              Context: {currentRound.deepDive}
            </p>
          </div>

          <button
            onClick={handleNextRound}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d9232e] hover:bg-[#a91522] text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
          >
            <span>Next Current Affairs Deck</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
