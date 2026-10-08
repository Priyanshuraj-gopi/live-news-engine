"use client";

import React, { useState, useEffect, useRef } from "react";
import { LanguageCode } from "@/types";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/config";
import { Play, Pause, Square, Volume2, Gauge } from "lucide-react";

interface WebSpeechPlayerProps {
  textToRead: string;
  language: LanguageCode;
  title?: string;
}

export function WebSpeechPlayer({ textToRead, language, title = "Listen to AI Brief" }: WebSpeechPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [supported, setSupported] = useState<boolean>(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
    }
  }, []);

  // Cleanup speech synthesis on unmount or text change
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [textToRead]);

  const langMeta = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.en;

  const handlePlay = () => {
    if (!supported || typeof window === "undefined") return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending utterance

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utteranceRef.current = utterance;

    // Pick suitable voice matching language tag
    const voices = window.speechSynthesis.getVoices();
    const targetTag = langMeta.speechLang.toLowerCase();
    const matchedVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith(targetTag) ||
        v.lang.toLowerCase().startsWith(language)
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.lang = langMeta.speechLang;
    utterance.rate = rate;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
      setIsPlaying(false);
    };

    utterance.onresume = () => {
      setIsPaused(false);
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error", e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (!supported || typeof window === "undefined") return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!supported || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleCycleRate = () => {
    const nextRate = rate === 1.0 ? 1.25 : rate === 1.25 ? 0.8 : 1.0;
    setRate(nextRate);
    if (isPlaying) {
      handleStop();
    }
  };

  if (!supported) {
    return (
      <div className="p-3 rounded-xl border border-border bg-muted/40 text-xs text-muted-foreground flex items-center gap-2">
        <Volume2 className="w-4 h-4" />
        <span>Audio synthesis not supported in this browser environment.</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-card/80 backdrop-blur-sm shadow-sm">
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all shadow-md active:scale-95 ${
            isPlaying
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
          aria-label={isPlaying ? "Pause audio" : "Play audio summary"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {isPlaying && (
          <button
            onClick={handleStop}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Stop audio"
            aria-label="Stop audio"
          >
            <Square className="w-4 h-4" />
          </button>
        )}

        {/* Title & Language Indicator */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-primary" />
            {title}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {langMeta.nativeName} ({langMeta.speechLang}) • Web Speech Engine
          </span>
        </div>
      </div>

      {/* Right Controls: Waveform Animation & Playback Speed */}
      <div className="flex items-center gap-2">
        {isPlaying && (
          <div className="flex items-center gap-0.5 px-2 py-1">
            <span className="w-1 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            <span className="w-1 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "450ms" }} />
          </div>
        )}

        <button
          onClick={handleCycleRate}
          className="px-2 py-1 rounded-md text-[11px] font-semibold border border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          title="Playback speed"
        >
          <Gauge className="w-3 h-3" />
          <span>{rate}x</span>
        </button>
      </div>
    </div>
  );
}
