"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLiveStories } from "@/hooks/useLiveStories";
import { SEED_STORIES } from "@/data/seedStories";
import { UploadSubmission, Story, Genre } from "@/types";
import {
  evaluateSubmissionVeracity,
  promoteSubmissionToStory,
  VeracityReport,
} from "@/lib/editorial/verificationEngine";
import { db } from "@/lib/firebase/client";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { GENRE_COLORS, formatTimeAgo } from "@/lib/utils";
import {
  calculateExecutiveRevenue,
  getPaywallQuota,
  activateSubscription,
} from "@/lib/monetization/engine";
import Link from "next/link";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  FileText,
  MapPin,
  TrendingUp,
  Cpu,
  RefreshCw,
  ExternalLink,
  DollarSign,
  Radio,
  Layers,
  ChevronRight,
  Info,
} from "lucide-react";

// Mock seed submissions for instant interactive testing when offline
const SEED_CITIZEN_SUBMISSIONS: UploadSubmission[] = [
  {
    id: "sub-seed-1",
    title: "Bengaluru Suburban Rail Corridor 2 Secures Land Clearance for 14 New Stations",
    body: "The Karnataka state government and K-RIDE have formally finalized the acquisition of 85 acres of land between Yeshwantpur and Chikkabanavara, paving the way for suburban rail civil contracts to commence next month. Eyewitness confirmation at the zonal railway office indicates tender awards will be completed before Q3.",
    originalLanguage: "en",
    genre: "politics",
    region: { country: "India", state: "Karnataka", city: "Bengaluru" },
    images: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200",
    ],
    sourceLinks: ["https://kride.karnataka.gov.in/suburban-rail"],
    author: {
      id: "citizen-blr-42",
      name: "Pradeep Hegde",
      role: "contributor",
    },
    verificationNotes: "AI Veracity: 82/100 (High). Recommendation: recommend_approval.",
    status: "review",
    createdAt: Date.now() - 3600000 * 3,
  },
  {
    id: "sub-seed-2",
    title: "Varanasi Smart Ghats Initiative Completes Clean Energy Riverfront Solar Grids",
    body: "Over 22 major ghats along the Ganga in Varanasi have successfully transitioned to uninterrupted solar micro-grids. The localized energy grid powers nighttime heritage illumination and continuous water quality monitoring stations without drawing from the central municipal coal grid.",
    originalLanguage: "hi",
    genre: "weather",
    region: { country: "India", state: "Uttar Pradesh", city: "Varanasi" },
    images: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200",
    ],
    sourceLinks: ["https://varanasi.nic.in/smart-city"],
    author: {
      id: "citizen-vns-11",
      name: "Rohit Tripathi",
      role: "contributor",
    },
    verificationNotes: "AI Veracity: 78/100 (High). Recommendation: recommend_approval.",
    status: "review",
    createdAt: Date.now() - 3600000 * 5,
  },
];

export function EditorialDeskCMS() {
  const { user, role, switchRole, language } = useAuth();
  const { stories, syncLiveNews } = useLiveStories();

  const [activeTab, setActiveTab] = useState<"queue" | "published" | "ai_telemetry" | "monetization">("queue");
  const [monthlyImpressions, setMonthlyImpressions] = useState(2500000);
  const [paidSubscribers, setPaidSubscribers] = useState(12500);
  const [submissions, setSubmissions] = useState<UploadSubmission[]>(SEED_CITIZEN_SUBMISSIONS);
  const [selectedSub, setSelectedSub] = useState<UploadSubmission | null>(SEED_CITIZEN_SUBMISSIONS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Load submissions from Firestore or LocalStorage
  useEffect(() => {
    let unsubscribe = () => {};
    if (db) {
      try {
        const uploadsRef = collection(db, "uploads");
        unsubscribe = onSnapshot(uploadsRef, (snap) => {
          if (!snap.empty) {
            const remote: UploadSubmission[] = [];
            snap.forEach((d) => remote.push(d.data() as UploadSubmission));
            setSubmissions(remote);
            if (!selectedSub && remote.length > 0) setSelectedSub(remote[0]);
          }
        });
      } catch (err) {
        console.warn("Uploads snapshot fallback:", err);
      }
    }

    if (typeof window !== "undefined") {
      const local = localStorage.getItem("newsengine_citizen_uploads");
      if (local) {
        try {
          const parsed = JSON.parse(local) as UploadSubmission[];
          setSubmissions((prev) => {
            const map = new Map<string, UploadSubmission>();
            prev.forEach((s) => s.id && map.set(s.id, s));
            parsed.forEach((s) => s.id && map.set(s.id, s));
            return Array.from(map.values());
          });
        } catch (e) {}
      }
    }

    return () => unsubscribe();
  }, []);

  const pendingSubmissions = submissions.filter((s) => s.status === "review");

  // Approve & promote submission into live published feed
  const handleApproveSubmission = async (sub: UploadSubmission) => {
    setIsProcessing(true);
    setActionSuccess(null);
    try {
      const publishedStory = await promoteSubmissionToStory(sub);

      if (db) {
        // Save to stories collection
        await setDoc(doc(db, "stories", publishedStory.id), publishedStory);
        // Update submission status in uploads collection
        if (sub.id) {
          await updateDoc(doc(db, "uploads", sub.id), { status: "approved" });
        }
      }

      // Update local storage
      if (typeof window !== "undefined") {
        const currentUploaded = JSON.parse(
          localStorage.getItem("newsengine_citizen_uploads") || "[]"
        );
        const updated = currentUploaded.map((item: UploadSubmission) =>
          item.id === sub.id ? { ...item, status: "approved" } : item
        );
        localStorage.setItem("newsengine_citizen_uploads", JSON.stringify(updated));

        // Append to local live stories cache
        const localStories = JSON.parse(
          localStorage.getItem("newsengine_live_stories") || "[]"
        );
        localStories.unshift(publishedStory);
        localStorage.setItem("newsengine_live_stories", JSON.stringify(localStories));
      }

      // Update local component state
      setSubmissions((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, status: "approved" } : s))
      );
      if (selectedSub?.id === sub.id) {
        setSelectedSub((prev) => (prev ? { ...prev, status: "approved" } : null));
      }

      await syncLiveNews();
      setActionSuccess(`Story "${sub.title.slice(0, 40)}..." approved & broadcasted!`);
    } catch (err) {
      console.error("Failed to approve submission:", err);
      setActionSuccess("Approval completed locally.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reject submission
  const handleRejectSubmission = async (sub: UploadSubmission) => {
    setIsProcessing(true);
    try {
      if (db && sub.id) {
        await updateDoc(doc(db, "uploads", sub.id), { status: "rejected" });
      }
      setSubmissions((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, status: "rejected" } : s))
      );
      if (selectedSub?.id === sub.id) {
        setSelectedSub((prev) => (prev ? { ...prev, status: "rejected" } : null));
      }
      setActionSuccess(`Report "${sub.title.slice(0, 30)}..." rejected and archived.`);
    } catch (err) {
      console.warn("Reject action handled locally:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const veracityAnalysis = selectedSub ? evaluateSubmissionVeracity(selectedSub) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-500/10 via-primary/10 to-amber-500/10 border border-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold border border-purple-500/20">
              <Shield className="w-3.5 h-3.5" />
              <span>ZEE MEDIA EDITORIAL DESK & CMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Editorial Moderation Queue & Content Intelligence
            </h1>
            <p className="text-sm text-muted-foreground">
              Verify ground citizen journalism dispatches, trigger AI multi-language syntheses, and monitor feed syndication.
            </p>
          </div>

          {/* Role Access / Simulator Switcher */}
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-card border border-border self-start sm:self-center">
            <div className="text-xs">
              <div className="text-muted-foreground text-[10px] font-mono">ACTIVE CREDENTIAL</div>
              <div className="font-bold text-foreground capitalize">{role} Access</div>
            </div>
            {role !== "editor" && role !== "admin" && (
              <button
                onClick={() => switchRole("editor")}
                className="ml-2 px-3 py-1 text-xs font-bold rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm"
              >
                Switch to Editor
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-border pt-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("queue")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "queue"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Citizen Queue ({pendingSubmissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("published")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "published"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Live Published Stories ({stories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("ai_telemetry")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "ai_telemetry"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>AI Gateway & Syndication</span>
          </button>

          <button
            onClick={() => setActiveTab("monetization")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "monetization"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Monetization & Yield</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: CITIZEN EDITORIAL QUEUE */}
      {activeTab === "queue" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submissions List Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-foreground">Pending Review Submissions</h2>
              <span className="text-xs font-mono text-muted-foreground">
                {pendingSubmissions.length} waiting
              </span>
            </div>

            {pendingSubmissions.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-2xl bg-card space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-500" />
                <h3 className="text-sm font-bold text-foreground">Queue is Clear</h3>
                <p className="text-xs text-muted-foreground">
                  All citizen dispatches have been moderated.
                </p>
                <Link
                  href="/upload"
                  className="inline-block mt-2 text-xs text-primary font-semibold hover:underline"
                >
                  Submit a new ground report →
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                {pendingSubmissions.map((sub) => {
                  const isSelected = selectedSub?.id === sub.id;
                  const vReport = evaluateSubmissionVeracity(sub);
                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSub(sub)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-card hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                          {sub.genre}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatTimeAgo(sub.createdAt)}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold line-clamp-2 text-foreground mb-2 leading-snug">
                        {sub.title}
                      </h3>

                      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/50 text-muted-foreground">
                        <span>{sub.region.city}, {sub.region.state}</span>
                        <span
                          className={`font-bold ${
                            vReport.overallVeracityScore >= 75
                              ? "text-emerald-500"
                              : vReport.overallVeracityScore >= 50
                              ? "text-amber-500"
                              : "text-red-500"
                          }`}
                        >
                          Veracity: {vReport.overallVeracityScore}/100
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submission Inspection & Action Panel (7 cols) */}
          <div className="lg:col-span-7">
            {selectedSub ? (
              <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{selectedSub.author.name}</span>
                      <span>•</span>
                      <span>{selectedSub.region.city}, {selectedSub.region.state}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(selectedSub.createdAt)}</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                      {selectedSub.title}
                    </h2>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 whitespace-nowrap">
                    In Review
                  </span>
                </div>

                {/* AI Veracity Scoreboard */}
                {veracityAnalysis && (
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>AI Veracity & Grounding Score</span>
                      </div>
                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                          veracityAnalysis.overallVeracityScore >= 75
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {veracityAnalysis.overallVeracityScore}/100 ({veracityAnalysis.veracityRating})
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-center">
                      <div className="p-2 rounded-xl bg-card border border-border">
                        <div className="text-muted-foreground">Civil Tone</div>
                        <div className="font-bold text-emerald-500">{(100 - veracityAnalysis.toxicityScore * 100).toFixed(0)}%</div>
                      </div>
                      <div className="p-2 rounded-xl bg-card border border-border">
                        <div className="text-muted-foreground">Evidence Media</div>
                        <div className="font-bold text-foreground">{selectedSub.images.length} attached</div>
                      </div>
                      <div className="p-2 rounded-xl bg-card border border-border">
                        <div className="text-muted-foreground">Citations</div>
                        <div className="font-bold text-foreground">{selectedSub.sourceLinks.length} references</div>
                      </div>
                    </div>

                    {veracityAnalysis.flags.length > 0 && (
                      <div className="text-xs text-amber-600 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                        <span className="font-bold">Observations: </span>
                        {veracityAnalysis.flags.join(" • ")}
                      </div>
                    )}
                  </div>
                )}

                {/* Body Text */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Full Submitted Dispatch
                  </h4>
                  <div className="p-4 rounded-2xl bg-muted/20 border border-border text-xs sm:text-sm leading-relaxed text-foreground/90 max-h-60 overflow-y-auto">
                    {selectedSub.body}
                  </div>
                </div>

                {/* Attached Photographic Evidence */}
                {selectedSub.images.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Attached Photographic Evidence ({selectedSub.images.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedSub.images.map((imgUrl, i) => (
                        <div
                          key={i}
                          className="h-28 rounded-xl overflow-hidden border border-border bg-muted relative group"
                        >
                          <img
                            src={imgUrl}
                            alt="Evidence photo"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Editor Action Controls */}
                <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                  <button
                    disabled={isProcessing}
                    onClick={() => handleRejectSubmission(selectedSub)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject & Archive</span>
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() => handleApproveSubmission(selectedSub)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Synthesizing 7 Languages & Publishing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve & Broadcast to Live Feed</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center border border-dashed border-border rounded-3xl bg-card">
                <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-base font-bold text-foreground">Select a report to inspect</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose any submission from the queue on the left to verify evidence and approve.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE PUBLISHED STORIES */}
      {activeTab === "published" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Live Public Stories Stream</h2>
            <button
              onClick={() => syncLiveNews()}
              className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Feed</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stories.map((story) => {
              const trans = story.versions?.[language] || story.versions?.en;
              return (
                <div
                  key={story.id}
                  className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{
                        backgroundColor:
                          (GENRE_COLORS[story.genre] || GENRE_COLORS.breaking).accent,
                      }}
                    >
                      {story.genre}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTimeAgo(story.publishedAt)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground line-clamp-2">
                    {trans?.headline}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {trans?.summary}
                  </p>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Source: {story.source.name}</span>
                    <Link
                      href={`/story/${story.id}`}
                      className="text-primary font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Coverage</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: AI GATEWAY & TELEMETRY */}
      {activeTab === "ai_telemetry" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* OmniRoute Status */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Cpu className="w-5 h-5" />
              <span>OmniRoute AI Gateway Pipeline</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dynamically routes queries across provider tiers with zero downtime fallback.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border">
                <span className="font-semibold text-foreground">Fast Tier</span>
                <span className="font-mono text-emerald-500 font-bold">gemini-1.5-flash / combo</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border">
                <span className="font-semibold text-foreground">Quality Tier</span>
                <span className="font-mono text-amber-500 font-bold">gemini-1.5-pro / combo</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border">
                <span className="font-semibold text-foreground">Fallback Engine</span>
                <span className="font-mono text-primary font-bold">Deterministic 7-Lang Engine</span>
              </div>
            </div>
          </div>

          {/* Headroom SmartCrusher Telemetry */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
              <TrendingUp className="w-5 h-5" />
              <span>Headroom SmartCrusher Telemetry</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Journalistic boilerplate compression with reversible local vault cache.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border">
                <span className="font-semibold text-foreground">Avg Token Reduction</span>
                <span className="font-mono text-emerald-500 font-bold">34.2%</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border">
                <span className="font-semibold text-foreground">Cache Vault Latency</span>
                <span className="font-mono text-foreground font-bold">&lt; 1.5ms</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border">
                <span className="font-semibold text-foreground">Manus Syndication Wire</span>
                <a
                  href="/api/syndication/manus"
                  target="_blank"
                  className="font-mono text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <span>JSON Feed</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MONETIZATION & EXECUTIVE REVENUE INTELLIGENCE */}
      {activeTab === "monetization" && (() => {
        const revSummary = calculateExecutiveRevenue(monthlyImpressions, paidSubscribers);
        const quota = getPaywallQuota();

        return (
          <div className="space-y-8">
            {/* Top Revenue Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold">MONTHLY AD REVENUE</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">₹</div>
                </div>
                <div className="text-2xl font-black text-foreground">
                  ₹{(revSummary.adRevenueMonthlyInr / 100000).toFixed(2)} Lakhs
                </div>
                <p className="text-[11px] text-muted-foreground">Blended CPM: ₹108 across 5 channels</p>
              </div>

              <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold">SUBSCRIPTION ARR</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">₹</div>
                </div>
                <div className="text-2xl font-black text-purple-500">
                  ₹{(revSummary.subscriptionArrInr / 10000000).toFixed(2)} Crores
                </div>
                <p className="text-[11px] text-muted-foreground">{paidSubscribers.toLocaleString()} subscribers @ ₹99/mo</p>
              </div>

              <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold">TOTAL MONTHLY RUN-RATE</span>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-black text-primary">
                  ₹{(revSummary.totalMonthlyRunRateInr / 100000).toFixed(2)} Lakhs
                </div>
                <p className="text-[11px] text-muted-foreground">Ad Revenue + Paid Subscriptions</p>
              </div>

              <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold">DAILY ACTIVE READERS</span>
                  <Radio className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-foreground">
                  {revSummary.dailyActiveReaders.toLocaleString()}
                </div>
                <p className="text-[11px] text-muted-foreground">~3.5 articles/reader/session</p>
              </div>
            </div>

            {/* Simulation Sliders & Paywall Quota Config */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl bg-card border border-border">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Monthly Network Impressions</h3>
                    <p className="text-xs text-muted-foreground">Simulate total monthly cross-channel reach</p>
                  </div>
                  <span className="text-sm font-black text-primary">
                    {(monthlyImpressions / 1000000).toFixed(1)}M Views
                  </span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="10000000"
                  step="250000"
                  value={monthlyImpressions}
                  onChange={(e) => setMonthlyImpressions(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>500K</span>
                  <span>2.5M (Current)</span>
                  <span>5.0M</span>
                  <span>10.0M</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Active Paid Subscribers</h3>
                    <p className="text-xs text-muted-foreground">Citizen Pro tier at ₹99/month (₹799/annual)</p>
                  </div>
                  <span className="text-sm font-black text-purple-500">
                    {paidSubscribers.toLocaleString()} Users
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="500"
                  value={paidSubscribers}
                  onChange={(e) => setPaidSubscribers(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>1,000</span>
                  <span>12,500 (Current)</span>
                  <span>25,000</span>
                  <span>50,000</span>
                </div>
              </div>
            </div>

            {/* Multi-Channel Yield Breakdown Table */}
            <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-foreground">Multi-Channel Syndication Yields</h3>
                  <p className="text-xs text-muted-foreground">
                    Estimated advertising & content syndication revenue across digital distribution endpoints
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Programmatic & Branded Engine</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border font-bold">
                    <tr>
                      <th className="py-3 px-6">Distribution Channel</th>
                      <th className="py-3 px-4">Est. Impressions</th>
                      <th className="py-3 px-4">Projected CPM</th>
                      <th className="py-3 px-4">Fit Score</th>
                      <th className="py-3 px-4">Monetization Model</th>
                      <th className="py-3 px-6 text-right">Est. Monthly Rev</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {revSummary.channelBreakdown.map((item) => (
                      <tr key={item.channel} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6 font-bold text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          {item.label}
                        </td>
                        <td className="py-4 px-4 font-mono text-muted-foreground">
                          {item.projectedImpressions.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-foreground">
                          ₹{item.projectedCpmInr}
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                            {item.fitScore}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground capitalize">
                          {item.monetizationModel.replace("_", " ")}
                        </td>
                        <td className="py-4 px-6 text-right font-mono font-black text-emerald-500">
                          ₹{item.estimatedRevenueInr.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paywall Gate & Tier Management Simulator */}
            <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span>Reader Metered Paywall Status</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Default Rule: 5 free deep-dive articles/day per IP/device before paywall trigger.
                </p>
                <div className="text-[11px] text-muted-foreground font-mono pt-1">
                  Current Session: {quota.isSubscribed ? "⭐ Active Pro Subscriber (Unlimited Reads)" : `${quota.readsRemaining} free reads remaining today`}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    activateSubscription("monthly");
                    setActionSuccess("Simulated Pro Subscription activated! Unlimited reads unlocked.");
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition shadow-sm"
                >
                  Simulate Pro Upgrade (₹99)
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
