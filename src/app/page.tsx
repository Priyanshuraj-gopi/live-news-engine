"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLiveStories } from "@/hooks/useLiveStories";
import { rankStoriesForUser } from "@/lib/recommendation/engine";
import { Story } from "@/types";
import { LiveBroadcastPlayer } from "@/components/media/LiveBroadcastPlayer";
import { QuizBanner } from "@/components/games/QuizBanner";

const genres = ["All signals", "Technology", "Markets", "Climate", "Culture"];

function storyCopy(story: Story, language: string) {
  return story.versions?.[language as keyof NonNullable<Story["versions"]>] || story.versions?.en;
}

function StorySkeleton() {
  return (
    <div className="story-skeleton" aria-label="Loading story">
      <div className="skeleton-line skeleton-kicker" />
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-title short" />
      <div className="skeleton-line skeleton-body" />
      <div className="skeleton-line skeleton-body short" />
    </div>
  );
}

function DemoStory({ story, language }: { story: Story; language: string }) {
  const copy = storyCopy(story, language);
  if (!copy) return null;
  return (
    <article className="demo-story">
      <div className="story-image-wrap">
        <img src={story.imageUrl} alt="" className="story-image" loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/story-fallback.svg"; }} />
        <span className="story-source">{story.source.name}</span>
      </div>
      <div className="story-content">
        <div className="eyebrow-row"><span className="eyebrow-dot" /> {story.genre} · {story.region.city}</div>
        <h3>{copy.headline}</h3>
        <p className="story-summary">{copy.summary}</p>
        <ul className="check-list compact-list">
          {copy.takeaways.slice(0, 3).map((takeaway) => <li key={takeaway}>{takeaway}</li>)}
        </ul>
        <div className="story-footer"><span>{story.author.name}</span><Link href={`/story/${story.id}`}>Read full brief <span className="link-arrow" aria-hidden="true">→</span></Link></div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const { language, region } = useAuth();
  const { stories, isSyncing, usingLiveWire } = useLiveStories();
  const [activeGenre, setActiveGenre] = useState("All signals");

  const recommended = useMemo(() => {
    const ranked = rankStoriesForUser(stories, region).rankedStories;
    if (activeGenre === "All signals") return ranked.slice(0, 4);
    const match = activeGenre.toLowerCase().replace(" ", "");
    return ranked.filter((story) => story.genre.includes(match as never)).slice(0, 4);
  }, [stories, region, activeGenre]);

  const leadStory = recommended[0] || stories[0];
  const supportingStories = recommended.slice(1, 4);

  return (
    <div className="site-shell">
      <div className="ambient-orb orb-one" /><div className="ambient-orb orb-two" />
      <div className="breaking-ribbon"><span className="breaking-ribbon-label"><span className="status-pulse" /> Top signal</span><span>Verified reporting, multilingual context, and a live reader conversation in one newsroom surface.</span><Link href="/feed">Open live feed <span aria-hidden="true">→</span></Link></div>
      <section className="hero-section">
        <div className="hero-copy">
          <div className="status-line"><span className="status-pulse" /> NewsEngine live desk <span className="status-divider" /> {region.city || "India"}</div>
          <h1>The signal behind<br /><em>every story that matters.</em></h1>
          <p className="hero-lede">A digital-first newsroom for verified reporting, regional voices and purposeful distribution. Watch the live wire, understand the context, and give every story a more useful second life.</p>
          <div className="hero-actions"><Link className="button button-primary" href="/feed">Explore the live feed <span aria-hidden="true">→</span></Link><Link className="button button-secondary" href="/upload">Submit a story</Link></div>
          <div className="proof-row"><span><strong>7</strong> languages</span><span><strong>60s</strong> wire refresh</span><span><strong>24/7</strong> signal watch</span></div>
        </div>
        <div className="hero-signal-card">
          <div className="signal-card-top"><span className="label">{usingLiveWire ? "Zee News live wire" : "Offline demo fallback"}</span><span className="live-badge">{usingLiveWire ? "LIVE" : "DEMO"}</span></div>
          {leadStory ? <DemoStory story={leadStory} language={language} /> : <StorySkeleton />}
          <div className="signal-meter"><div className="meter-label"><span>Audience fit</span><strong>92%</strong></div><div className="meter-track"><span /></div><div className="meter-note">Based on language, region and reading signals</div></div>
        </div>
      </section>

      <LiveBroadcastPlayer headline={leadStory ? storyCopy(leadStory, language)?.headline : "NewsEngine live desk"} source={leadStory?.source.name} />
      <div className="homepage-game-link"><QuizBanner storyId={leadStory?.id} /></div>

      <nav className="route-rail" aria-label="Explore NewsEngine">
        <span className="route-rail-label">Explore the newsroom</span>
        <Link href="/feed">Live feed <span aria-hidden="true">→</span></Link>
        <Link href="/games">Newsroom Arcade <span aria-hidden="true">→</span></Link>
        <Link href="/debate">Community debate <span aria-hidden="true">→</span></Link>
        <Link href="/upload">Submit a story <span aria-hidden="true">→</span></Link>
        <Link href="/terms">Terms <span aria-hidden="true">→</span></Link>
        <Link href="/privacy">Privacy <span aria-hidden="true">→</span></Link>
      </nav>

      <section className="section-block demo-section" id="demo">
        <div className="section-heading"><div><span className="section-kicker">Production demo</span><h2>What your newsroom can ship today</h2></div><p>Real seeded stories, real routes, and a recommendation engine that adapts to the reader.</p></div>
        <div className="filter-row">{genres.map((genre) => <button key={genre} className={`filter-chip ${activeGenre === genre ? "active" : ""}`} aria-pressed={activeGenre === genre} onClick={() => setActiveGenre(genre)}>{genre}</button>)}<span className={`filter-note ${isSyncing ? "is-syncing" : ""}`} aria-live="polite">{isSyncing ? "Syncing Zee News headlines" : usingLiveWire ? `${stories.length || 0} live headlines` : "Offline demo headlines"}</span></div>
        <div className="story-grid">{leadStory ? <DemoStory story={leadStory} language={language} /> : <StorySkeleton />}{supportingStories.length ? supportingStories.map((story) => <DemoStory key={story.id} story={story} language={language} />) : <><StorySkeleton /><StorySkeleton /></>}</div>
      </section>

      <section className="section-block workflow-section"><div className="section-heading"><div><span className="section-kicker">From wire to everywhere</span><h2>A calmer operating system for news</h2></div><p>Less manual rework. More context for the reader. Every step stays connected.</p></div><div className="workflow-list"><div className="workflow-item"><span className="step-number">01</span><div><h3>Verify once</h3><p>Ingest editorial sources, citizen reports and live signals into one reviewable story record.</p></div></div><div className="workflow-item"><span className="step-number">02</span><div><h3>Adapt intelligently</h3><p>Generate short summaries, key takeaways, audio and video in the reader’s preferred language.</p></div></div><div className="workflow-item"><span className="step-number">03</span><div><h3>Publish with intent</h3><p>Recommend the right channel and monetisation path based on audience interest and story shape.</p></div></div></div></section>

      <section className="section-block tiers-section"><div className="section-heading"><div><span className="section-kicker">Choose your newsroom tier</span><h2>Start focused. Scale with signal.</h2></div><p>Three practical tiers for teams moving from manual publishing to intelligent distribution.</p></div><div className="tier-grid"><div className="tier-card"><span className="tier-name">Brief</span><strong>For small desks</strong><p>Clear summaries and multilingual publishing for a focused local operation.</p><ul className="check-list"><li>AI story briefs</li><li>3 language outputs</li><li>Reader recommendations</li></ul><Link href="/upload" className="tier-link">Start with Brief <span>→</span></Link></div><div className="tier-card featured"><span className="tier-name">Signal</span><strong>For growing networks</strong><p>Format once, distribute everywhere, and understand what your audience will read next.</p><ul className="check-list"><li>7 language outputs</li><li>Audio and video summaries</li><li>Channel recommendations</li></ul><Link href="/feed" className="tier-link">Explore Signal <span>→</span></Link></div><div className="tier-card"><span className="tier-name">Network</span><strong>For enterprise desks</strong><p>A connected editorial layer for regional teams, creators and high-volume news operations.</p><ul className="check-list"><li>Editorial review workflows</li><li>Credibility-aware debate</li><li>Monetisation intelligence</li></ul><Link href="/debate" className="tier-link">See Network flow <span>→</span></Link></div></div></section>

      <section className="closing-band"><div><span className="section-kicker">Built for attention, not addiction</span><h2>Give every story a more useful second life.</h2></div><Link className="button button-primary" href="/feed">Enter NewsEngine <span aria-hidden="true">→</span></Link></section>
    </div>
  );
}
