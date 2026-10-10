import Link from "next/link";
import { Sparkles, ArrowRight, Brain } from "lucide-react";

interface QuizBannerProps {
  className?: string;
  storyId?: string;
  compact?: boolean;
}

export function QuizBanner({ className = "", storyId, compact = false }: QuizBannerProps) {
  const href = storyId ? `/games?tab=quiz&storyId=${storyId}` : "/games?tab=quiz";

  if (compact) {
    return (
      <Link
        href={href}
        className={`game-link-banner compact inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border border-[#d9232e]/30 bg-[#d9232e]/10 text-[#a91522] hover:bg-[#d9232e] hover:text-white transition-all shadow-xs ${className}`}
        title="Play live quiz on current stories"
      >
        <Brain className="w-3.5 h-3.5 shrink-0" />
        <span>Live Quiz</span>
        <ArrowRight className="w-3 h-3 shrink-0" />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`game-link-banner group flex items-center justify-between gap-3 px-3.5 py-2 bg-[#fffdf9] border border-[#d9232e]/30 hover:border-[#d9232e] text-[#202124] text-xs font-medium transition-all shadow-xs hover:shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#d9232e] animate-pulse shrink-0" />
        <span className="font-bold text-[#a91522] uppercase tracking-wider text-[10px]">
          Live News Intelligence
        </span>
        <span className="text-[#687078] hidden sm:inline">·</span>
        <span className="font-semibold text-xs text-[#202124]">
          Test Your Knowledge: Play Live News Quiz
        </span>
      </div>

      <div className="flex items-center gap-1 text-[11px] font-bold text-[#d9232e] uppercase tracking-wider shrink-0 group-hover:translate-x-0.5 transition-transform">
        <span>Play Quiz</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
}
