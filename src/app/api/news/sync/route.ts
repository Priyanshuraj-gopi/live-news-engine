import { NextRequest, NextResponse } from "next/server";
import { ingestRealNews } from "@/lib/ingestion/liveNewsEngine";
import { db } from "@/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";
const liveHeaders = { "Cache-Control": "no-store, max-age=0" };

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 12;

    const stories = await ingestRealNews({ query, category, limit });

    if (db) {
      Promise.allSettled(
        stories.map((story) => setDoc(doc(db, "stories", story.id), story, { merge: true }))
      ).catch((error) => {
        console.warn("Firestore sync background warning:", error);
      });
    }

    return NextResponse.json({
      success: true,
      count: stories.length,
      query: query || null,
      source: query ? "Google News Live Search" : "Zee News RSS Wire",
      syncedAt: new Date().toISOString(),
      stories,
    }, { headers: liveHeaders });
  } catch (error: unknown) {
    console.error("API news sync error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to sync live news" },
      { status: 500, headers: liveHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = body.query || undefined;
    const category = body.category || undefined;
    const limit = body.limit || 12;
    const stories = await ingestRealNews({ query, category, limit });

    if (db) {
      await Promise.allSettled(
        stories.map((story) => setDoc(doc(db, "stories", story.id), story, { merge: true }))
      );
    }

    return NextResponse.json({
      success: true,
      count: stories.length,
      query: query || null,
      syncedAt: new Date().toISOString(),
      stories,
    }, { headers: liveHeaders });
  } catch (error: unknown) {
    console.error("API news sync POST error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to sync live news" },
      { status: 500, headers: liveHeaders }
    );
  }
}
