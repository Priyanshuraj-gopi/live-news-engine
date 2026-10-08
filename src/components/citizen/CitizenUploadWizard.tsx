"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { INDIAN_STATES } from "@/lib/region/config";
import { Genre, Genres, LanguageCode, LanguageCodes, UploadSubmission } from "@/types";
import { evaluateSubmissionVeracity, VeracityReport } from "@/lib/editorial/verificationEngine";
import { db } from "@/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import {
  Upload,
  MapPin,
  Camera,
  Link as LinkIcon,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Clock,
  Send,
  UserCheck,
  Info,
} from "lucide-react";

export function CitizenUploadWizard() {
  const { user, role, switchRole, language: authLanguage, region: userRegion } = useAuth();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [genre, setGenre] = useState<Genre>("politics");
  const [originalLanguage, setOriginalLanguage] = useState<LanguageCode>(authLanguage);
  const [stateName, setStateName] = useState(userRegion.state || "Maharashtra");
  const [cityName, setCityName] = useState(userRegion.city || "Mumbai");
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200",
  ]);
  const [imageInput, setImageInput] = useState("");
  const [sourceLinks, setSourceLinks] = useState<string[]>([]);
  const [sourceInput, setSourceInput] = useState("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [veracityResult, setVeracityResult] = useState<VeracityReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // Helper to add image URL
  const handleAddImage = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()]);
      setImageInput("");
    }
  };

  // Helper to add source URL
  const handleAddSource = () => {
    if (sourceInput.trim()) {
      setSourceLinks([...sourceLinks, sourceInput.trim()]);
      setSourceInput("");
    }
  };

  // Run AI Pre-Flight Veracity Analysis
  const handleRunAiAnalysis = () => {
    setIsAnalyzing(true);
    const mockSubmission: UploadSubmission = {
      title,
      body,
      genre,
      originalLanguage,
      region: { country: "India", state: stateName, city: cityName },
      images,
      sourceLinks,
      author: {
        id: user?.id || "guest-contributor",
        name: user?.displayName || "Citizen Reporter",
        role: role,
      },
      status: "review",
      createdAt: Date.now(),
    };

    const report = evaluateSubmissionVeracity(mockSubmission);
    setVeracityResult(report);
    setIsAnalyzing(false);
    setCurrentStep(3);
  };

  // Final Submit to Editorial Desk
  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    const newId = `citizen-${Date.now()}`;
    const submissionData: UploadSubmission = {
      id: newId,
      title,
      body,
      genre,
      originalLanguage,
      region: { country: "India", state: stateName, city: cityName },
      images,
      sourceLinks,
      author: {
        id: user?.id || "guest-contributor",
        name: user?.displayName || "Citizen Reporter",
        role: role,
      },
      verificationNotes: veracityResult
        ? `AI Veracity: ${veracityResult.overallVeracityScore}/100 (${veracityResult.veracityRating}). Recommendation: ${veracityResult.recommendation}. Flags: ${veracityResult.flags.join(", ")}`
        : "Pending Editorial Desk Analysis",
      status: "review",
      createdAt: Date.now(),
    };

    try {
      if (db) {
        await setDoc(doc(db, "uploads", newId), submissionData);
      }
      // Also cache in local session
      if (typeof window !== "undefined") {
        const stored = JSON.parse(localStorage.getItem("newsengine_citizen_uploads") || "[]");
        stored.unshift(submissionData);
        localStorage.setItem("newsengine_citizen_uploads", JSON.stringify(stored));
        window.dispatchEvent(new Event("newsengine:uploads-updated"));
      }
      setSubmissionId(newId);
      setCurrentStep(4);
    } catch (err) {
      console.warn("Upload firestore sync notice:", err);
      // Fallback local persistence
      if (typeof window !== "undefined") {
        const stored = JSON.parse(localStorage.getItem("newsengine_citizen_uploads") || "[]");
        stored.unshift(submissionData);
        localStorage.setItem("newsengine_citizen_uploads", JSON.stringify(stored));
        window.dispatchEvent(new Event("newsengine:uploads-updated"));
      }
      setSubmissionId(newId);
      setCurrentStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-primary/10 border border-border space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
              <Upload className="w-3.5 h-3.5" />
              <span>ZEE CITIZEN REPORTERS WIRE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Submit Ground Coverage & Eyewitness Dispatches
            </h1>
            <p className="text-sm text-muted-foreground">
              Empowering grassroots reporting. Every submission undergoes AI veracity verification and editorial review before syndication to millions of readers.
            </p>
          </div>

          {/* Role Status Tag */}
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-card border border-border self-start sm:self-center">
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <div className="text-xs">
              <div className="font-bold text-foreground capitalize">{role} Account</div>
              <div className="text-muted-foreground text-[10px]">
                {role === "contributor" || role === "editor" || role === "admin"
                  ? "Verified Submitter"
                  : "Reader Mode"}
              </div>
            </div>
            {role === "reader" && (
              <button
                onClick={() => switchRole("contributor")}
                className="ml-2 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Become Contributor
              </button>
            )}
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="pt-4 grid grid-cols-4 gap-2 text-xs font-semibold">
          {[
            { step: 1, label: "1. Core Story" },
            { step: 2, label: "2. Evidence & Geo" },
            { step: 3, label: "3. AI Veracity" },
            { step: 4, label: "4. Status" },
          ].map((s) => (
            <div
              key={s.step}
              className={`p-2 rounded-xl text-center border transition-all ${
                currentStep === s.step
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : currentStep > s.step
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-muted/40 text-muted-foreground border-border"
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Core Story Details */}
      {currentStep === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Step 1: Ground Report Overview</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Provide a concise headline and comprehensive factual description of the event.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                Report Headline *
              </label>
              <input
                type="text"
                placeholder="e.g. Pune Metro Line 3 Expands Route Connectivity to Hinjawadi IT Park"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/40 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-[11px] text-muted-foreground mt-1 block">
                {title.length}/200 characters (min 5 chars)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                  Story Genre *
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value as Genre)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-muted/40 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary capitalize"
                >
                  {Genres.map((g) => (
                    <option key={g} value={g} className="capitalize">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                  Original Language *
                </label>
                <select
                  value={originalLanguage}
                  onChange={(e) => setOriginalLanguage(e.target.value as LanguageCode)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-muted/40 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                >
                  {LanguageCodes.map((l) => (
                    <option key={l} value={l}>
                      {l.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                Full Eyewitness Report / Article Body *
              </label>
              <textarea
                rows={6}
                placeholder="Describe what occurred, key individuals or authorities involved, exact timeline, and local impact..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-4 text-xs sm:text-sm rounded-xl bg-muted/40 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
              />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                <span>Word count: {body.trim() ? body.trim().split(/\s+/).length : 0} words</span>
                <span>Minimum 50 characters required</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              disabled={title.trim().length < 5 || body.trim().length < 50}
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs disabled:opacity-50 hover:opacity-90 transition-all shadow-sm"
            >
              <span>Next: Evidence & Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Location & Evidence Attachments */}
      {currentStep === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              <span>Step 2: Location & Documentary Evidence</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Ground your report in verifiable geography and documentary photos or source citations.
            </p>
          </div>

          <div className="space-y-5">
            {/* Geo Selection */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-foreground">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Geographic Origin</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    State / Union Territory *
                  </label>
                  <select
                    value={stateName}
                    onChange={(e) => {
                      setStateName(e.target.value);
                      const stateObj = INDIAN_STATES.find((s) => s.name === e.target.value);
                      if (stateObj && stateObj.cities[0]) setCityName(stateObj.cities[0].name);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="e.g. Pune, Nagpur, Mumbai"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Media Evidence */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                Photo & Video Evidence URLs *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste direct image link (https://...)"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-muted/40 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold border border-border"
                >
                  Add Photo
                </button>
              </div>

              {/* Photos Gallery */}
              <div className="flex flex-wrap gap-2 pt-2">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group w-24 h-24 rounded-xl overflow-hidden border border-border bg-muted"
                  >
                    <img
                      src={imgUrl}
                      alt="Evidence"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Citations */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                Citations & Supporting References (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Government press release, official circular, or local news wire URL"
                  value={sourceInput}
                  onChange={(e) => setSourceInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-muted/40 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleAddSource}
                  className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold border border-border"
                >
                  Add Link
                </button>
              </div>

              {sourceLinks.length > 0 && (
                <ul className="space-y-1 text-xs">
                  {sourceLinks.map((link, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border"
                    >
                      <span className="truncate max-w-[280px] sm:max-w-md font-mono text-muted-foreground">
                        {link}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSourceLinks(sourceLinks.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:underline text-[10px]"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-foreground text-xs font-semibold hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleRunAiAnalysis}
              disabled={images.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs disabled:opacity-50 hover:opacity-90 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run AI Veracity Pre-Flight</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AI Real-Time Veracity & Pre-Flight Review */}
      {currentStep === 3 && veracityResult && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Step 3: AI Pre-Flight Veracity Assessment</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Real-time analysis conducted before dispatching to Zee Media editorial desk editors.
            </p>
          </div>

          {/* Veracity Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1 text-center">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Veracity Score
              </div>
              <div
                className={`text-3xl font-extrabold ${
                  veracityResult.overallVeracityScore >= 75
                    ? "text-emerald-500"
                    : veracityResult.overallVeracityScore >= 50
                    ? "text-amber-500"
                    : "text-red-500"
                }`}
              >
                {veracityResult.overallVeracityScore}/100
              </div>
              <div className="text-xs font-bold capitalize text-foreground">
                Rating: {veracityResult.veracityRating}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1 text-center">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Civil Discourse & Toxicity
              </div>
              <div className="text-3xl font-extrabold text-foreground">
                {(veracityResult.toxicityScore * 100).toFixed(0)}%
              </div>
              <div className="text-xs font-bold text-emerald-500 flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Civil & Clear</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1 text-center">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Desk Recommendation
              </div>
              <div className="text-sm font-bold text-foreground capitalize mt-2">
                {veracityResult.recommendation.replace(/_/g, " ")}
              </div>
              <div className="text-[11px] text-muted-foreground">
                Ready for desk queue
              </div>
            </div>
          </div>

          {/* Flags or Observations */}
          {veracityResult.flags.length > 0 ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                <span>Editorial Desk Observations</span>
              </div>
              <ul className="space-y-1 text-xs text-foreground/90 list-disc list-inside">
                {veracityResult.flags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>All automated veracity checks passed cleanly with zero flags!</span>
            </div>
          )}

          {/* Submission Preview Card */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{genre.toUpperCase()} • {cityName}, {stateName}</span>
              <span>By {user?.displayName || "Citizen Reporter"}</span>
            </div>
            <h3 className="font-bold text-sm text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {body}
            </p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-foreground text-xs font-semibold hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back & Edit</span>
            </button>

            <button
              onClick={handleSubmitReport}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-all shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Submitting to Desk...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit to Zee Editorial Desk</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Submission Success Confirmation */}
      {currentStep === 4 && (
        <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-foreground">
              Report Dispatched to Editorial Desk
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Your ground dispatch has been received. Desk editors will verify documentary evidence and synthesize 7-language AI editions for public broadcast.
            </p>
            {submissionId && (
              <div className="inline-block px-3 py-1.5 rounded-xl bg-muted font-mono text-xs text-muted-foreground mt-2 border border-border">
                Tracking ID: <span className="text-foreground font-bold">{submissionId}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/admin"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:opacity-90 transition-all"
            >
              View in Editorial Queue
            </Link>
            <button
              onClick={() => {
                setTitle("");
                setBody("");
                setImages(["https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200"]);
                setSourceLinks([]);
                setVeracityResult(null);
                setCurrentStep(1);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted font-semibold text-xs transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
