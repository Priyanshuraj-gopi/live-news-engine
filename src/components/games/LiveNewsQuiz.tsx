"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Story, LanguageCode } from "@/types";
import { QuizSet, QuizQuestion } from "@/lib/games/types";
import { generateQuizSet } from "@/lib/games/quizGenerator";
import { awardPoints } from "@/lib/games/engine";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Share2, Sparkles, HelpCircle, ShieldCheck } from "lucide-react";

interface LiveNewsQuizProps {
  stories: Story[];
  language: LanguageCode;
  storyId?: string;
  onClearStoryId?: () => void;
}

export function LiveNewsQuiz({ stories, language, storyId, onClearStoryId }: LiveNewsQuizProps) {
  const quizSet: QuizSet = useMemo(() => {
    return generateQuizSet({ stories, language, storyId });
  }, [stories, language, storyId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset when quizSet changes
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setScore(0);
    setSessionPoints(0);
    setIsFinished(false);
  }, [quizSet.id]);

  const currentQ: QuizQuestion | undefined = quizSet.questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (!currentQ || hasSubmitted) return;
    setSelectedOption(idx);
    setHasSubmitted(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      const earned = currentQ.pointsValue || 20;
      setSessionPoints((prev) => prev + earned);
      awardPoints({ points: earned, correct: true, gameType: "quiz" });
    } else {
      awardPoints({ points: 0, correct: false, gameType: "quiz" });
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizSet.questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setScore(0);
    setSessionPoints(0);
    setIsFinished(false);
    if (onClearStoryId) onClearStoryId();
  };

  const handleShare = () => {
    const text = `I just scored ${score}/${quizSet.questions.length} on NewsEngine's Live News Quiz and earned ${sessionPoints} Newsroom IQ Points! Test your news literacy here: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: "NewsEngine Quiz", text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!currentQ || isFinished) {
    const accuracy = quizSet.questions.length > 0 ? Math.round((score / quizSet.questions.length) * 100) : 0;
    let verdict = "Novice Reader · Keep following the live wire to build editorial sharp eyes!";
    if (accuracy >= 80) {
      verdict = "Distinguished News Analyst · Exceptional grasp of breaking national developments!";
    } else if (accuracy >= 50) {
      verdict = "Informed Citizen · Good awareness of key stories, check deeper briefs for total mastery.";
    }

    return (
      <div className="game-panel quiz-result bg-[#fffdf9] border border-[#dedbd4] p-6 sm:p-8 max-w-2xl mx-auto shadow-sm text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#d9232e]/10 text-[#d9232e] flex items-center justify-center mb-4">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="text-[10px] font-bold tracking-widest text-[#a91522] uppercase">Editorial Assessment Report</div>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#202124] mt-1 mb-2">Quiz Round Completed</h2>
        <p className="text-xs text-[#687078] max-w-md mx-auto mb-6">
          {quizSet.title} · {quizSet.dateStamp}
        </p>

        {/* Score Breakdown Cards */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
          <div className="bg-[#f7f4ef] border border-[#dedbd4] p-3">
            <div className="text-[10px] font-bold text-[#687078] uppercase">Correct</div>
            <div className="text-xl font-bold text-[#202124]">{score} / {quizSet.questions.length}</div>
          </div>
          <div className="bg-[#f7f4ef] border border-[#dedbd4] p-3">
            <div className="text-[10px] font-bold text-[#687078] uppercase">Accuracy</div>
            <div className="text-xl font-bold text-[#10B981]">{accuracy}%</div>
          </div>
          <div className="bg-[#f7f4ef] border border-[#dedbd4] p-3">
            <div className="text-[10px] font-bold text-[#687078] uppercase">IQ Points</div>
            <div className="text-xl font-bold text-[#d9232e]">+{sessionPoints}</div>
          </div>
        </div>

        {/* Editorial Verdict Box */}
        <div className="bg-[#f2eee8] border-l-4 border-[#d9232e] p-4 text-left max-w-md mx-auto mb-6 text-xs text-[#202124] leading-relaxed">
          <div className="font-bold uppercase tracking-wider text-[10px] text-[#a91522] mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Editorial Verdict</span>
          </div>
          {verdict}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d9232e] hover:bg-[#a91522] text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again with Fresh Stories</span>
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#dedbd4] hover:border-[#202124] text-[#202124] font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? "Copied Link!" : "Share Result"}</span>
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / quizSet.questions.length) * 100);

  return (
    <div className="game-panel quiz-panel bg-[#fffdf9] border border-[#dedbd4] p-5 sm:p-7 max-w-2xl mx-auto shadow-sm">
      {/* Quiz Header Bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#dedbd4] mb-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#a91522]">
            <span className="w-2 h-2 rounded-full bg-[#d9232e] animate-pulse" />
            <span>Live Wire Intelligence</span>
            {storyId && (
              <span className="bg-[#a91522]/10 text-[#a91522] px-1.5 py-0.5 rounded text-[9px]">
                Story Spotlight
              </span>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-serif text-[#202124] font-bold mt-0.5">
            {quizSet.title}
          </h2>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-[#687078]">
            Question <strong>{currentIndex + 1}</strong> of {quizSet.questions.length}
          </span>
          <div className="text-[10px] text-[#a91522] font-bold mt-0.5">
            +{currentQ.pointsValue || 20} pts
          </div>
        </div>
      </div>

      {/* Progress Strip */}
      <div className="w-full h-1.5 bg-[#ece8e1] mb-6 overflow-hidden">
        <div
          className="h-full bg-[#d9232e] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Source Reference Tag */}
      {currentQ.sourceHeadline && (
        <div className="text-[11px] text-[#687078] mb-2 flex items-center gap-1.5 italic">
          <HelpCircle className="w-3.5 h-3.5 text-[#a91522] shrink-0" />
          <span className="truncate">Source Brief: &ldquo;{currentQ.sourceHeadline}&rdquo;</span>
        </div>
      )}

      {/* Question Text */}
      <h3 className="text-lg sm:text-xl font-serif text-[#202124] leading-snug mb-6">
        {currentQ.question}
      </h3>

      {/* Options List */}
      <div className="space-y-3 mb-6">
        {currentQ.options.map((option, optIdx) => {
          const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
          let optionClasses = "border-[#dedbd4] hover:border-[#a91522] bg-[#fffdf9] text-[#202124]";

          if (hasSubmitted) {
            if (optIdx === currentQ.correctIndex) {
              optionClasses = "border-[#10B981] bg-emerald-50 text-emerald-950 font-semibold";
            } else if (optIdx === selectedOption) {
              optionClasses = "border-[#d9232e] bg-red-50 text-red-950 font-semibold";
            } else {
              optionClasses = "border-[#dedbd4] opacity-50 bg-[#fffdf9] text-[#687078]";
            }
          }

          return (
            <button
              key={optIdx}
              onClick={() => handleSelectOption(optIdx)}
              disabled={hasSubmitted}
              className={`w-full text-left p-3.5 sm:p-4 border transition-all flex items-start gap-3 text-xs sm:text-sm ${optionClasses}`}
            >
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 font-bold text-[11px]">
                {letter}
              </span>
              <span className="flex-1 pt-0.5 leading-relaxed">{option}</span>
              {hasSubmitted && optIdx === currentQ.correctIndex && (
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
              )}
              {hasSubmitted && optIdx === selectedOption && optIdx !== currentQ.correctIndex && (
                <XCircle className="w-5 h-5 text-[#d9232e] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Immediate Explanation Box */}
      {hasSubmitted && (
        <div className="p-4 bg-[#f7f4ef] border-l-4 border-[#202124] mb-6 text-xs text-[#202124] leading-relaxed animate-in fade-in duration-300">
          <div className="font-bold uppercase tracking-wider text-[10px] text-[#a91522] mb-1">
            {selectedOption === currentQ.correctIndex ? "✓ Correct Answer!" : "✕ Incorrect — Verified Fact:"}
          </div>
          <p>{currentQ.explanation}</p>
        </div>
      )}

      {/* Navigation / Next Button */}
      {hasSubmitted && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d9232e] hover:bg-[#a91522] text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <span>{currentIndex + 1 < quizSet.questions.length ? "Next Question" : "View Final Assessment"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
