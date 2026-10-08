"use client";

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { StoryTranslation, Genre } from "@/types";
import { GENRE_COLORS } from "@/lib/utils";

export interface VideoCompositionProps {
  translation: StoryTranslation;
  genre: Genre;
  source: string;
  cityName?: string;
}

export function RemotionVideoComposition({
  translation,
  genre,
  source,
  cityName,
}: VideoCompositionProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Progress 0..1
  const progress = frame / durationInFrames;

  // Scene timing:
  // 0 - 60 frames (0-2s): Intro + Headline entrance
  // 60 - 240 frames (2-8s): Key Takeaways 1, 2, 3 sequence
  // 240 - 300 frames (8-10s): Outro + Zee Media branding

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const headlineOpacity = interpolate(frame, [0, 20, 260, 290], [0, 1, 1, 0.4]);
  const genreColor = GENRE_COLORS[genre] || GENRE_COLORS.breaking;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#090d16",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Background radial gradient glow */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-20%",
          width: "140%",
          height: "140%",
          background: `radial-gradient(circle at 50% 30%, ${genreColor.accent}33 0%, #090d16 70%)`,
          transform: `scale(${1 + Math.sin(progress * Math.PI) * 0.08})`,
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              padding: "6px 14px",
              backgroundColor: "#DC2626",
              borderRadius: 8,
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              boxShadow: "0 4px 14px rgba(220, 38, 38, 0.5)",
            }}
          >
            ZEE AI BRIEF
          </div>
          <div
            style={{
              padding: "4px 12px",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textTransform: "uppercase",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {genre}
          </div>
        </div>

        <div style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.7)", fontWeight: 500 }}>
          {source} {cityName ? `• ${cityName}` : ""}
        </div>
      </div>

      {/* Scene 1: Headline Hero (Frames 0-140) */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 40,
          right: 40,
          opacity: headlineOpacity,
          transform: `translateY(${(1 - headlineSpring) * 30}px)`,
          zIndex: 5,
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: -0.5,
            color: "#ffffff",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            marginBottom: 16,
          }}
        >
          {translation.headline}
        </h1>

        {frame < 120 && (
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.5,
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: 580,
            }}
          >
            {translation.summary}
          </p>
        )}
      </div>

      {/* Scene 2: Key Takeaways (Frames 100 - 280) */}
      {frame >= 90 && (
        <div
          style={{
            position: "absolute",
            top: 220,
            left: 40,
            right: 40,
            zIndex: 6,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: genreColor.accent,
            }}
          >
            KEY HIGHLIGHTS
          </div>

          {translation.takeaways.slice(0, 3).map((takeaway: string, idx: number) => {
            const startFrame = 100 + idx * 35;
            const itemSpring = spring({
              frame: frame - startFrame,
              fps,
              config: { damping: 15, stiffness: 100 },
            });
            const itemOpacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 10,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(8px)",
                  opacity: itemOpacity,
                  transform: `translateX(${(1 - itemSpring) * 40}px)`,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    backgroundColor: genreColor.accent,
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ fontSize: 15, color: "#f1f5f9", lineHeight: 1.35, fontWeight: 500 }}>
                  {takeaway}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Live Ticker Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 48,
          backgroundColor: "#0f172a",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 20,
          paddingRight: 20,
          zIndex: 20,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundColor: "#DC2626",
            color: "#ffffff",
            padding: "4px 8px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 800,
            marginRight: 12,
            flexShrink: 0,
          }}
        >
          NEWS TICKER
        </div>
        <div
          style={{
            whiteSpace: "nowrap",
            fontSize: 13,
            color: "rgba(255, 255, 255, 0.85)",
            transform: `translateX(${100 - progress * 200}px)`,
          }}
        >
          {translation.headline} • Zee Media Verified Content Engine • Multilingual Auto-Sync
        </div>
      </div>
    </div>
  );
}
