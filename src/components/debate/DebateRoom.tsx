"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { ChatMessage, ChatMessageSchema } from "@/types";
import { db } from "@/lib/firebase/client";
import { evaluateToxicity } from "@/lib/moderation/toxicityScorer";
import { CredibilityBadge } from "./CredibilityBadge";
import { formatTimeAgo } from "@/lib/utils";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit as fsLimit,
  setDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import {
  Send,
  MessageSquare,
  AlertTriangle,
  Clock,
  ThumbsUp,
  Sparkles,
  Shield,
  Heart,
  Info,
} from "lucide-react";

interface DebateRoomProps {
  storyId: string;
  storyHeadline: string;
  compact?: boolean;
}

// Initial demo seed messages for offline or newly created stories
const DEMO_DEBATE_MESSAGES: Record<string, ChatMessage[]> = {
  default: [
    {
      id: "msg-init-1",
      storyId: "default",
      userId: "user-analyst-delhi",
      userName: "Dr. Ananya Sharma",
      userCredibilityLevel: 4,
      content:
        "The policy implications mentioned here reflect a balanced macro-fiscal approach. Long-term capital expenditure is key for sustaining 7%+ growth.",
      toxicityScore: 0.05,
      status: "approved",
      reactions: { helpful: 14, insightful: 8 },
      createdAt: Date.now() - 3600000 * 2,
    },
    {
      id: "msg-init-2",
      storyId: "default",
      userId: "user-citizen-blr",
      userName: "Karthik Venkatesh",
      userCredibilityLevel: 3,
      content:
        "Regional execution timelines often face delays at the state level. Hopefully the unified digital single-window clearance actually streamlines project approvals.",
      toxicityScore: 0.08,
      status: "approved",
      reactions: { helpful: 9, insightful: 3 },
      createdAt: Date.now() - 3600000 * 1,
    },
    {
      id: "msg-init-3",
      storyId: "default",
      userId: "user-reader-mum",
      userName: "Pooja Mehta",
      userCredibilityLevel: 2,
      content:
        "Appreciate the concise AI highlights. Does anyone have details on how this affects retail retail bond yields over the next quarter?",
      toxicityScore: 0.02,
      status: "approved",
      reactions: { helpful: 5 },
      createdAt: Date.now() - 1800000,
    },
  ],
};

export function DebateRoom({ storyId, storyHeadline, compact = false }: DebateRoomProps) {
  const { user, language } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_DEBATE_MESSAGES.default);
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Slow mode: 30s countdown state
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const lastSentRef = useRef<number>(0);

  // 1. Subscribe to real-time messages in Firestore subcollection
  useEffect(() => {
    if (!db || !storyId) return;

    try {
      const messagesRef = collection(db, "stories", storyId, "messages");
      const q = query(messagesRef, orderBy("createdAt", "asc"), fsLimit(50));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const liveMsgs: ChatMessage[] = [];
            snapshot.forEach((d) => {
              liveMsgs.push(d.data() as ChatMessage);
            });
            setMessages(liveMsgs);
          }
        },
        (err) => {
          console.warn("Debate real-time listener notice:", err.message);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.warn("Could not attach debate listener:", e);
    }
  }, [storyId]);

  // 2. Slow mode cooldown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      setCooldownRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setWarningMessage(null);

    const trimmed = inputText.trim();
    if (!trimmed || isSubmitting) return;

    // Slow mode enforcement: 30 seconds
    const now = Date.now();
    const timeSinceLast = (now - lastSentRef.current) / 1000;
    if (timeSinceLast < 30) {
      const waitSeconds = Math.ceil(30 - timeSinceLast);
      setCooldownRemaining(waitSeconds);
      setWarningMessage(`Slow mode active. Please wait ${waitSeconds}s before posting again.`);
      return;
    }

    // Toxicity Screening
    const toxicity = evaluateToxicity(trimmed);
    if (toxicity.status === "hidden") {
      setWarningMessage("Message blocked: violates civil debate standards (toxicity detected).");
      return;
    }

    setIsSubmitting(true);

    const newMsg: ChatMessage = {
      id: "msg-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      storyId,
      userId: user?.id || "guest-user",
      userName: user?.displayName || "Guest Reader",
      userAvatar: user?.photoURL,
      userCredibilityLevel: user?.credibilityLevel || 1,
      content: trimmed,
      toxicityScore: toxicity.score,
      status: toxicity.status,
      reactions: {},
      createdAt: now,
    };

    // Optimistically update local message list
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    lastSentRef.current = now;
    setCooldownRemaining(30);

    // Save to Firestore subcollection if available
    if (db) {
      try {
        await setDoc(doc(db, "stories", storyId, "messages", newMsg.id), newMsg);
      } catch (err) {
        console.warn("Failed saving debate message to Firestore:", err);
      }
    }

    setIsSubmitting(false);
  };

  const handleReaction = async (msgId: string, reactionType: "helpful" | "insightful") => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId) {
          const currentCount = m.reactions[reactionType] || 0;
          return {
            ...m,
            reactions: {
              ...m.reactions,
              [reactionType]: currentCount + 1,
            },
          };
        }
        return m;
      })
    );

    if (db) {
      try {
        await updateDoc(doc(db, "stories", storyId, "messages", msgId), {
          [`reactions.${reactionType}`]: increment(1),
        });
      } catch (e) {
        console.warn("Failed persisting reaction:", e);
      }
    }
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-card overflow-hidden shadow-lg flex flex-col">
      {/* Debate Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-muted/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-foreground">Community Debate Room</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                LIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">{storyHeadline}</p>
          </div>
        </div>

        {/* Civil Slow-Mode Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-card px-2.5 py-1 rounded-lg border border-border">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Slow Mode: 30s</span>
        </div>
      </div>

      {/* Civil Guidelines Banner */}
      <div className="px-4 py-2 bg-primary/5 border-b border-border text-[11px] text-muted-foreground flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-primary" />
          Civil discussion policy active • Toxic comments are flagged automatically
        </span>
        <span className="font-mono text-[10px]">Level 1–5 Credibility Ranking</span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 sm:p-5 space-y-4 max-h-[460px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
            <MessageSquare className="w-6 h-6 mx-auto opacity-50" />
            <p>No debate comments yet. Be the first to share an informed insight!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                msg.status === "flagged"
                  ? "bg-amber-500/5 border-amber-500/30 opacity-75"
                  : "bg-card/70 border-border hover:border-border/80"
              }`}
            >
              {/* Message Header: User, Level Badge, Time */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {msg.userName.charAt(0)}
                  </div>
                  <span className="font-semibold text-xs text-foreground">{msg.userName}</span>
                  <CredibilityBadge level={msg.userCredibilityLevel} size="sm" showTitle={false} />
                </div>

                <span className="text-[10px] text-muted-foreground">
                  {formatTimeAgo(msg.createdAt, language)}
                </span>
              </div>

              {/* Message Body */}
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                {msg.content}
              </p>

              {/* Status Warning if Flagged */}
              {msg.status === "flagged" && (
                <div className="text-[10px] text-amber-500 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Flagged by automated moderation for review</span>
                </div>
              )}

              {/* Message Footer: Reactions */}
              <div className="flex items-center gap-2 pt-1 border-t border-border/40 text-[11px]">
                <button
                  onClick={() => handleReaction(msg.id, "helpful")}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful {msg.reactions.helpful ? `(${msg.reactions.helpful})` : ""}</span>
                </button>

                <button
                  onClick={() => handleReaction(msg.id, "insightful")}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Insightful {msg.reactions.insightful ? `(${msg.reactions.insightful})` : ""}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input & Slow-Mode Cooldown Bar */}
      <div className="p-4 border-t border-border bg-card/90">
        {warningMessage && (
          <div className="mb-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{warningMessage}</span>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="space-y-2">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value.slice(0, 500))}
              placeholder={
                cooldownRemaining > 0
                  ? `Slow mode cooldown (${cooldownRemaining}s remaining)...`
                  : "Share a constructive perspective or ask a question (max 500 chars)..."
              }
              rows={2}
              disabled={cooldownRemaining > 0 || isSubmitting}
              className="w-full p-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-60"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>{inputText.length} / 500</span>
              {cooldownRemaining > 0 && (
                <span className="text-amber-500 font-mono font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Cooldown: {cooldownRemaining}s
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || cooldownRemaining > 0 || isSubmitting}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-all shadow-sm disabled:opacity-40 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Posting..." : "Post Comment"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
