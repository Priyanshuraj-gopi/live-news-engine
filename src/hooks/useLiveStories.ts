"use client";

import { useState, useEffect, useCallback } from "react";
import { Story, StoryVersion, UploadSubmission } from "@/types";
import { SEED_STORIES } from "@/data/seedStories";
import { db } from "@/lib/firebase/client";
import { collection, onSnapshot, query, orderBy, limit as firestoreLimit } from "firebase/firestore";

const LIVE_REFRESH_MS = 60_000;
const LOCAL_UPLOADS_KEY = "newsengine_citizen_uploads";
const LOCAL_UPLOAD_EVENT = "newsengine:uploads-updated";
const FALLBACK_IMAGE = "/story-fallback.svg";

function submissionToStory(submission: UploadSubmission): Story {
  const headline = submission.title.trim();
  const summary = submission.body.trim().slice(0, 580);
  const version: StoryVersion = {
    language: "en",
    headline,
    summary,
    fullArticle: submission.body.trim(),
    takeaways: ["Submitted by a NewsEngine community contributor.", "Pending editorial review and verification.", "Source links are available to the editorial desk."],
    motionSpec: { topic: headline.slice(0, 40), mood: "dynamic", palette: ["#d9232e", "#f7dfe0", "#a91522", "#f7f4ef"], motif: submission.genre },
    audioUrl: null,
    updatedAt: Date.now(),
  };

  return {
    id: submission.id || `citizen-${submission.createdAt}`,
    originalLanguage: submission.originalLanguage,
    genre: submission.genre,
    region: submission.region,
    imageUrl: submission.images[0] || FALLBACK_IMAGE,
    dominantColor: "#d9232e",
    source: { name: "Citizen report · Pending review", url: submission.sourceLinks[0] || "https://zeemedia.in/" },
    author: submission.author,
    status: "review",
    createdAt: submission.createdAt,
    publishedAt: submission.createdAt,
    velocityScore: 88,
    versions: { en: version },
  };
}

function readLocalSubmissionStories(): Story[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(window.localStorage.getItem(LOCAL_UPLOADS_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter((item): item is UploadSubmission => Boolean(item?.title && item?.body && item?.genre && item?.region)).map(submissionToStory);
  } catch {
    return [];
  }
}

function mergeStories(primary: Story[], secondary: Story[]) {
  const map = new Map<string, Story>();
  [...primary, ...secondary].forEach((story) => {
    if (!map.has(story.id)) map.set(story.id, story);
  });
  return Array.from(map.values());
}

export function useLiveStories() {
  const [stories, setStories] = useState<Story[]>(SEED_STORIES);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [usingLiveWire, setUsingLiveWire] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setStories((current) => mergeStories(readLocalSubmissionStories(), current));
    const refreshLocalStories = () => setStories((current) => mergeStories(readLocalSubmissionStories(), current));
    const handleStorageUpdate = (event: StorageEvent) => { if (event.key === LOCAL_UPLOADS_KEY) refreshLocalStories(); };
    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener(LOCAL_UPLOAD_EVENT, refreshLocalStories);

    if (!db) {
      setLoading(false);
      return () => {
        window.removeEventListener("storage", handleStorageUpdate);
        window.removeEventListener(LOCAL_UPLOAD_EVENT, refreshLocalStories);
      };
    }

    try {
      const q = query(collection(db, "stories"), orderBy("publishedAt", "desc"), firestoreLimit(50));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const liveDocs: Story[] = [];
        snapshot.forEach((doc) => liveDocs.push(doc.data() as Story));
        setUsingLiveWire(liveDocs.length > 0);
        setStories(liveDocs.length > 0 ? mergeStories(readLocalSubmissionStories(), liveDocs) : mergeStories(readLocalSubmissionStories(), SEED_STORIES));
        setLoading(false);
      }, (error) => {
        console.warn("Firestore real-time listener notice (using local cache):", error.message);
        setLoading(false);
      });

      return () => {
        unsubscribe();
        window.removeEventListener("storage", handleStorageUpdate);
        window.removeEventListener(LOCAL_UPLOAD_EVENT, refreshLocalStories);
      };
    } catch (error) {
      console.warn("Could not bind Firestore listener:", error);
      setLoading(false);
      return () => {
        window.removeEventListener("storage", handleStorageUpdate);
        window.removeEventListener(LOCAL_UPLOAD_EVENT, refreshLocalStories);
      };
    }
  }, []);

  const syncLiveNews = useCallback(async (customQuery?: string) => {
    setIsSyncing(true);
    try {
      const qParam = customQuery !== undefined ? customQuery : searchQuery;
      const url = qParam ? `/api/news/sync?q=${encodeURIComponent(qParam)}&limit=12` : "/api/news/sync?limit=12";
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Sync HTTP error ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.stories) && data.stories.length > 0) {
        setUsingLiveWire(true);
        setStories(mergeStories(readLocalSubmissionStories(), data.stories as Story[]));
        setLastSynced(new Date());
        return data.stories.length;
      }
      setUsingLiveWire(false);
      setLastSynced(new Date());
      return 0;
    } catch (error) {
      console.warn("Live news sync notice:", error);
      setUsingLiveWire(false);
      return 0;
    } finally {
      setIsSyncing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    void syncLiveNews();
    const refreshIfVisible = () => { if (document.visibilityState === "visible") void syncLiveNews(); };
    const interval = window.setInterval(refreshIfVisible, LIVE_REFRESH_MS);
    document.addEventListener("visibilitychange", refreshIfVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [syncLiveNews]);

  return { stories, loading, isSyncing, usingLiveWire, lastSynced, searchQuery, setSearchQuery, syncLiveNews };
}
