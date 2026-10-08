"use client";

import React from "react";
import { Genre } from "@/types";

interface GenreMotionSceneProps {
  genre: Genre;
  className?: string;
}

export function GenreMotionScene({ genre, className = "" }: GenreMotionSceneProps) {
  switch (genre) {
    case "markets":
      return (
        <svg
          viewBox="0 0 600 300"
          className={`w-full h-full opacity-35 overflow-hidden ${className}`}
          preserveAspectRatio="none"
        >
          {/* Subtle grid */}
          <defs>
            <pattern id="market-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
            </pattern>
            <linearGradient id="bull-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#market-grid)" />

          {/* Area fill */}
          <path
            d="M 0 240 Q 120 220 200 160 T 380 140 T 500 80 T 600 60 L 600 300 L 0 300 Z"
            fill="url(#bull-glow)"
          />

          {/* Dynamic rising trendline */}
          <path
            d="M 0 240 Q 120 220 200 160 T 380 140 T 500 80 T 600 60"
            fill="none"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeDasharray="800"
            strokeDashoffset="0"
            className="animate-pulse"
          />

          {/* Candlestick bars */}
          <g opacity="0.6">
            <line x1="80" y1="180" x2="80" y2="250" stroke="#10B981" strokeWidth="1" />
            <rect x="74" y="200" width="12" height="30" fill="#10B981" rx="2" />

            <line x1="180" y1="130" x2="180" y2="210" stroke="#10B981" strokeWidth="1" />
            <rect x="174" y="150" width="12" height="40" fill="#10B981" rx="2" />

            <line x1="300" y1="120" x2="300" y2="190" stroke="#EF4444" strokeWidth="1" />
            <rect x="294" y="140" width="12" height="30" fill="#EF4444" rx="2" />

            <line x1="420" y1="70" x2="420" y2="150" stroke="#10B981" strokeWidth="1" />
            <rect x="414" y="85" width="12" height="45" fill="#10B981" rx="2" />

            <line x1="530" y1="40" x2="530" y2="110" stroke="#10B981" strokeWidth="1" />
            <rect x="524" y="55" width="12" height="35" fill="#10B981" rx="2" />
          </g>
        </svg>
      );

    case "politics":
      return (
        <svg
          viewBox="0 0 600 300"
          className={`w-full h-full opacity-30 overflow-hidden ${className}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="pillar-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {/* Symmetrical constitutional dome arches */}
          <circle cx="300" cy="180" r="140" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />
          <circle cx="300" cy="180" r="100" fill="none" stroke="#F59E0B" strokeWidth="1.5" opacity="0.4" />
          <path d="M 200 180 Q 300 80 400 180" fill="none" stroke="#F59E0B" strokeWidth="3" />
          {/* Columns */}
          {[-120, -80, -40, 0, 40, 80, 120].map((x, idx) => (
            <rect
              key={idx}
              x={300 + x - 8}
              y="180"
              width="16"
              height="100"
              fill="url(#pillar-grad)"
              stroke="#F59E0B"
              strokeWidth="0.8"
              opacity="0.7"
              rx="2"
            />
          ))}
          <line x1="120" y1="280" x2="480" y2="280" stroke="#F59E0B" strokeWidth="4" opacity="0.8" />
        </svg>
      );

    case "sports":
      return (
        <svg
          viewBox="0 0 600 300"
          className={`w-full h-full opacity-35 overflow-hidden ${className}`}
          preserveAspectRatio="none"
        >
          {/* Dynamic stadium arc sweep & speed lines */}
          <path
            d="M -50 250 C 150 220 300 80 650 120"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="4"
            opacity="0.8"
          />
          <path
            d="M -50 280 C 180 250 320 110 650 150"
            fill="none"
            stroke="#60A5FA"
            strokeWidth="2"
            opacity="0.5"
            strokeDasharray="8 6"
          />
          {/* Stadium floodlight beams */}
          <polygon points="60,0 20,300 140,300" fill="#3B82F6" opacity="0.12" />
          <polygon points="540,0 460,300 580,300" fill="#3B82F6" opacity="0.12" />
          {/* Motion particle rings */}
          <circle cx="420" cy="130" r="24" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.7" />
          <circle cx="420" cy="130" r="38" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.4" />
        </svg>
      );

    case "tech":
      return (
        <svg
          viewBox="0 0 600 300"
          className={`w-full h-full opacity-35 overflow-hidden ${className}`}
          preserveAspectRatio="none"
        >
          {/* Circuit nodes & paths */}
          <path
            d="M 50 150 H 180 L 240 90 H 380 L 440 150 H 550"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2"
          />
          <path
            d="M 120 220 H 220 L 280 280 H 460"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <circle cx="180" cy="150" r="4" fill="#06B6D4" className="animate-ping" />
          <circle cx="380" cy="90" r="4" fill="#06B6D4" />
          <circle cx="440" cy="150" r="4" fill="#06B6D4" />
          {/* Hexagonal chip */}
          <polygon
            points="300,120 340,140 340,180 300,200 260,180 260,140"
            fill="#06B6D4"
            fillOpacity="0.15"
            stroke="#06B6D4"
            strokeWidth="1.5"
          />
          <circle cx="300" cy="160" r="6" fill="#06B6D4" />
        </svg>
      );

    case "weather":
      return (
        <svg
          viewBox="0 0 600 300"
          className={`w-full h-full opacity-35 overflow-hidden ${className}`}
          preserveAspectRatio="none"
        >
          {/* Atmospheric pressure wave curves */}
          <path
            d="M 0 100 Q 150 60 300 110 T 600 90"
            fill="none"
            stroke="#0EA5E9"
            strokeWidth="2"
            opacity="0.6"
          />
          <path
            d="M 0 160 Q 150 120 300 170 T 600 150"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2.5"
            opacity="0.8"
          />
          <path
            d="M 0 220 Q 150 180 300 230 T 600 210"
            fill="none"
            stroke="#0EA5E9"
            strokeWidth="1.5"
            opacity="0.5"
          />
          {/* Monsoon storm droplets */}
          {[120, 220, 310, 420, 490].map((x, i) => (
            <line
              key={i}
              x1={x}
              y1={120 + (i % 3) * 20}
              x2={x - 15}
              y2={160 + (i % 3) * 20}
              stroke="#0EA5E9"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
          ))}
        </svg>
      );

    case "health":
      return (
        <svg
          viewBox="0 0 600 300"
          className={`w-full h-full opacity-35 overflow-hidden ${className}`}
          preserveAspectRatio="none"
        >
          {/* ECG Pulse waveform */}
          <path
            d="M 0 150 L 160 150 L 180 130 L 200 170 L 220 70 L 240 230 L 260 130 L 280 150 L 600 150"
            fill="none"
            stroke="#14B8A6"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="220" cy="70" r="5" fill="#14B8A6" className="animate-pulse" />
        </svg>
      );

    case "entertainment":
      return (
        <svg
          viewBox="0 0 600 300"
          className={`w-full h-full opacity-35 overflow-hidden ${className}`}
          preserveAspectRatio="none"
        >
          {/* Spotlight cones */}
          <polygon points="120,0 0,300 260,300" fill="#8B5CF6" opacity="0.18" />
          <polygon points="480,0 340,300 600,300" fill="#EC4899" opacity="0.18" />
          {/* Cinematic star sparkles */}
          <circle cx="280" cy="110" r="16" fill="#8B5CF6" opacity="0.4" />
          <circle cx="360" cy="160" r="28" fill="#EC4899" opacity="0.3" />
        </svg>
      );

    case "crime":
    default:
      return (
        <svg
          viewBox="0 0 600 300"
          className={`w-full h-full opacity-40 overflow-hidden ${className}`}
          preserveAspectRatio="none"
        >
          {/* Warning radar rings */}
          <circle cx="300" cy="150" r="60" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0.6" />
          <circle cx="300" cy="150" r="120" fill="none" stroke="#EF4444" strokeWidth="1" opacity="0.4" />
          <circle cx="300" cy="150" r="180" fill="none" stroke="#EF4444" strokeWidth="0.8" opacity="0.2" />
          {/* Cautionary diagonal hazard stripes */}
          <line x1="200" y1="50" x2="400" y2="250" stroke="#EF4444" strokeWidth="2" opacity="0.5" />
          <circle cx="300" cy="150" r="6" fill="#EF4444" className="animate-ping" />
        </svg>
      );
  }
}
