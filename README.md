# Live News Engine

A Zee-inspired, digital-first newsroom interface for live headlines, multilingual story briefs, community reporting, debate, and broadcast-ready news presentation.

## What it includes

- Live Zee News and external RSS aggregation
- Automatic headline refresh every 60 seconds in the browser
- Scheduled RSS sync endpoint for deployment platforms
- Configurable live television broadcast player
- Firestore real-time story updates when Firebase is configured
- Citizen story submission with immediate local feed updates
- Editorial feed with personalized and latest views
- Community debate surface
- Responsive Zee-inspired red, white, and editorial-blue visual system
- Local image fallback for resilient story cards
- Terms of Service and Privacy Policy routes

## Local launch

```powershell
npm install
npm run build
npm run start
```

Then open `http://localhost:3000`.

On Windows, you can also double-click `start-newsengine.cmd`.

## Environment configuration

Copy `.env.example` to `.env.local` and provide Firebase credentials for persistent production stories. Optional variables configure the live player, RSS sources, and scheduled sync protection.

```env
NEXT_PUBLIC_LIVE_STREAM_EMBED_URL=
NEXT_PUBLIC_LIVE_STREAM_URL=
NEXT_PUBLIC_OFFICIAL_LIVE_URL=https://zeenews.india.com/live-tv
CRON_SECRET=
NEWS_RSS_URLS=
```

Custom RSS format:

```text
Name|https://example.com/rss.xml|general
```

Multiple sources are comma-separated.

## Automated RSS sync

The deployment scheduler calls:

```text
GET /api/news/cron
```

`vercel.json` schedules this endpoint every five minutes. Set `CRON_SECRET` in production so scheduled requests are authenticated.

## Verification

```powershell
npm run typecheck
npm run test:smoke
npm run test:interactions
npm run build
```

## Design direction

The interface is informed by Zee News’s current editorial hierarchy and Zee Media’s published Z identity direction: strong broadcast framing, compact category navigation, clear live states, dense story hierarchy, and purposeful multilingual journalism. It uses original NewsEngine branding and content rather than copying Zee News artwork or trademarks.

## License and content

This repository contains the NewsEngine application source. External RSS headlines and broadcast content remain subject to their respective publishers’ terms, rights, and attribution requirements.
