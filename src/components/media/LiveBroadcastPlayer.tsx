"use client";

import { useState } from "react";
import Link from "next/link";
import { Radio, ExternalLink, Volume2 } from "lucide-react";

interface LiveBroadcastPlayerProps {
  headline?: string;
  source?: string;
  updatedAt?: string;
}

const embedUrl = process.env.NEXT_PUBLIC_LIVE_STREAM_EMBED_URL || "https://zeenews.india.com/live-tv/embed";
const videoUrl = process.env.NEXT_PUBLIC_LIVE_STREAM_URL || "";
const officialLiveUrl = process.env.NEXT_PUBLIC_OFFICIAL_LIVE_URL || "https://zeenews.india.com/live-tv";

export function LiveBroadcastPlayer({ headline = "NewsEngine live desk", source = "Editorial control room", updatedAt }: LiveBroadcastPlayerProps) {
  const [streamError, setStreamError] = useState(false);
  const hasConfiguredStream = Boolean((embedUrl || videoUrl) && !streamError);

  return <section className="live-broadcast-section" aria-labelledby="live-broadcast-title">
    <div className="live-broadcast-heading">
      <div><span className="section-kicker">Live television desk</span><h2 id="live-broadcast-title">Watch the signal as it moves.</h2></div>
      <div className="live-broadcast-meta"><span className="live-badge"><span className="status-pulse" /> ON AIR</span><span>{updatedAt ? `Updated ${updatedAt}` : "Live editorial stream"}</span></div>
    </div>
    <div className="live-broadcast-layout">
      <div className="live-screen">
        {hasConfiguredStream && embedUrl ? <iframe src={embedUrl} title="Live NewsEngine broadcast" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen onError={() => setStreamError(true)} /> : hasConfiguredStream && videoUrl ? <video src={videoUrl} controls autoPlay muted playsInline onError={() => setStreamError(true)} /> : <div className="live-screen-fallback"><span className="live-screen-grid" /><div className="live-screen-copy"><span className="live-screen-kicker"><Radio size={15} /> NewsEngine / LIVE</span><strong>{headline}</strong><span>Configure a live stream URL to activate the broadcast player.</span><Link href={officialLiveUrl} target="_blank" rel="noreferrer" className="button button-primary">Open official live TV <ExternalLink size={14} /></Link></div></div>}
        <div className="live-screen-bar"><span><span className="status-pulse" /> LIVE</span><span>{source}</span><span className="live-screen-volume"><Volume2 size={13} /> Sound on</span></div>
      </div>
      <aside className="live-broadcast-sidebar"><div className="sidebar-label">Live desk notes</div><h3>{headline}</h3><p>Broadcast framing for the latest verified signal, with room for an external live stream, newsroom context, and the next stories in the wire.</p><ul className="check-list"><li>Red on-air status treatment</li><li>External stream ready</li><li>Live wire refresh every 60 seconds</li></ul><Link href="/feed" className="tier-link">Open the full feed <span>→</span></Link></aside>
    </div>
  </section>;
}
