import { NextRequest, NextResponse } from "next/server";
import { ingestRealNews } from "@/lib/ingestion/liveNewsEngine";
import { db } from "@/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const configuredSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (configuredSecret && authorization !== `Bearer ${configuredSecret}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stories = await ingestRealNews({ limit: 24 });
    let persisted = 0;
    if (db) {
      const results = await Promise.allSettled(stories.map((story) => setDoc(doc(db, "stories", story.id), story, { merge: true })));
      persisted = results.filter((result) => result.status === "fulfilled").length;
    }

    return NextResponse.json({
      success: true,
      count: stories.length,
      persisted,
      syncedAt: new Date().toISOString(),
      source: "Zee News and configured external RSS wires",
    }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Scheduled RSS sync failed" }, { status: 500 });
  }
}
