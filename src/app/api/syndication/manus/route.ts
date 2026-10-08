import { NextRequest, NextResponse } from "next/server";
import { SEED_STORIES } from "@/data/seedStories";
import { ingestRealNews } from "@/lib/ingestion/liveNewsEngine";
import { LanguageCode } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get("genre");
    const lang = (searchParams.get("lang") || "en") as LanguageCode;
    const city = searchParams.get("city");
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    // Fetch live ingested news
    const liveStories = await ingestRealNews({ limit: 10 }).catch(() => []);
    const allStories = [...liveStories, ...SEED_STORIES];

    // Filter by genre and city if requested
    let filtered = allStories;
    if (genre && genre !== "all") {
      filtered = filtered.filter((s) => s.genre === genre);
    }
    if (city) {
      filtered = filtered.filter(
        (s) => s.region?.city?.toLowerCase() === city.toLowerCase()
      );
    }

    const payload = filtered.slice(0, limit).map((story) => {
      const version = story.versions?.[lang] || story.versions?.en;
      return {
        id: story.id,
        genre: story.genre,
        region: story.region,
        headline: version?.headline,
        summary: version?.summary,
        takeaways: version?.takeaways || [],
        fullArticle: version?.fullArticle,
        source: story.source,
        author: story.author,
        velocityScore: story.velocityScore,
        publishedAt: story.publishedAt,
        motionSpec: version?.motionSpec,
        multilingualVersionsAvailable: Object.keys(story.versions || {}),
        syndicationProtocol: "Manus Automation Protocol v1.0",
      };
    });

    return NextResponse.json(
      {
        channel: "Zee Media NewsEngine Syndication Wire",
        format: "manus-json-v1",
        generatedAt: new Date().toISOString(),
        totalItems: payload.length,
        language: lang,
        items: payload,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Syndication generation error" },
      { status: 500 }
    );
  }
}
