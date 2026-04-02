# CLAUDE.md — Clickward Developer Context

## What this project is

Clickward is a SaaS prototype for automated website conversion rate optimization. Users install a single JavaScript snippet on their site; the platform records visitor behavior (clicks, scroll depth, page views), uses Claude AI to analyze page content and suggest improved headlines/CTAs, and lets users create A/B tests from those suggestions. The MVP proves the core value chain end-to-end: tracking → analytics → AI suggestions → A/B test management.

## Architecture

Key directories:
- `app/` — Next.js App Router pages and API routes
- `app/(auth)/` — Login and signup pages (no dashboard layout)
- `app/api/` — Server-side API routes
- `app/dashboard/` — Protected app area with sidebar layout
- `components/` — Shared React client components
- `lib/` — Server utilities (auth, prisma, utils)
- `prisma/` — Schema definition

## Key files

- `lib/auth.ts` — NextAuth config: JWT strategy, session callback adds user.id, Credentials provider
- `lib/prisma.ts` — Singleton Prisma client using @prisma/adapter-neon
- `lib/utils.ts` — calculateSignificance() chi-squared test for A/B results
- `middleware.ts` — Redirects unauthenticated users from /dashboard/* to /login
- `app/api/track/[token]/route.ts` — Serves the vanilla JS tracking snippet
- `app/api/events/route.ts` — Ingests pageview, click, scroll events; CORS-enabled
- `app/api/suggestions/route.ts` — Fetches page HTML, calls Claude Haiku, stores 2 variants
- `app/api/tests/[id]/route.ts` — PATCH start or complete; complete generates simulated data
- `prisma/schema.prisma` — Data model: User, Site, Event, AiSuggestion, AbTest

## Data flow

User adds a site: AddSiteForm → POST /api/sites → prisma.site.create() → redirect to site detail

Tracking: browser loads /api/track/[token] JS → POSTs to /api/events { token, pageUrl, eventType, sessionId }

AI suggestions: GenerateSuggestionsForm → POST /api/suggestions → fetch page HTML → call Claude → store 2 variants

A/B test: SuggestionCard → POST /api/tests (draft) → Start Test PATCH (running) → Complete Test PATCH (simulates data, completed)

## Stack decisions

- Next.js 14 App Router: full-stack in one repo; server components query DB directly
- NextAuth v5 beta: best auth for App Router; JWT avoids DB session table
- Prisma 7 + Neon: type-safe queries; Neon serverless adapter required for Vercel
- Claude Haiku: fast/cheap for structured copywriting
- Inline CSS with CSS variables: avoids Tailwind purge issues in complex dynamic styles

## Environment variables

- DATABASE_URL: Neon PostgreSQL connection string used by Prisma via Neon adapter
- AUTH_SECRET: Signs/encrypts NextAuth JWTs, min 32 chars
- NEXTAUTH_URL: Full app URL for NextAuth callbacks, required in production
- ANTHROPIC_API_KEY: Authenticates Claude API calls for suggestion generation

## How to run locally

```bash
npm install
cp .env.example .env.local
npx prisma migrate dev
npm run dev
```

## Known quirks

- Prisma 7 generates client to app/generated/prisma/ (not the default location)
- prisma.config.ts sets the datasource URL; schema.prisma has no url field (Prisma 7 change)
- NextAuth v5: use auth() on server, signIn()/signOut() from next-auth/react on client
- session.user.id requires the session callback in lib/auth.ts to copy token.id
- Tracking script includes CORS headers so it works on external domains

## What is NOT implemented

- Real traffic splitting: A/B variants not served to real visitors
- Heatmap visualization: click data stored but not rendered visually
- Auto-promotion of winners: no automatic rollout
- GDPR consent banner: tracking script has no consent check
- Time filters on analytics: shows all-time data only
- Real statistical accumulation: A/B results simulated on Complete action
