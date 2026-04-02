# Clickward — Automated Website Optimization

Drop in one script tag. AI finds where visitors drop off, writes better headlines and CTAs, and A/B tests them automatically — so your site converts more while you sleep.

## What it does

- **Tracking**: A lightweight (< 5KB) vanilla JS snippet records page views, clicks, and scroll depth
- **Analytics**: Dashboard shows visitor behavior per page — total events, unique sessions, top pages
- **AI Suggestions**: Enter any page URL; Claude analyzes the content and generates 2 optimized headline + CTA variants with reasoning
- **A/B Tests**: Create a test from any suggestion, track conversion rates for Variant A vs B, see statistical significance with a chi-squared test

## Running locally

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in DATABASE_URL, AUTH_SECRET, ANTHROPIC_API_KEY
   ```

3. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deploying to Vercel

1. Push code to GitHub
2. Connect repo in Vercel dashboard
3. Add environment variables:
   - `DATABASE_URL` — Neon PostgreSQL connection string
   - `AUTH_SECRET` — Random 32+ char secret (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` — Your production URL (e.g. `https://yourapp.vercel.app`)
   - `ANTHROPIC_API_KEY` — Your Anthropic API key
4. Set build command: `prisma migrate deploy && next build`
5. Deploy

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon recommended) |
| `AUTH_SECRET` | Secret for NextAuth session encryption |
| `NEXTAUTH_URL` | Full URL of your app (required in production) |
| `ANTHROPIC_API_KEY` | API key for Claude AI (generates suggestions) |
