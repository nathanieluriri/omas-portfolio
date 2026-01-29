# Oma Portfolio

A Next.js portfolio site with a full admin panel for managing content, theme, and SEO. Content is fetched from an external API and rendered on the public site with ISR + on-demand revalidation.

## Features
- Public portfolio pages powered by API-driven content
- Admin dashboard for content, theme, SEO, and settings
- AI Suggestions flow for drafting updates from a resume
- Theme presets + advanced custom colors with light/dark previews
- On-demand revalidation endpoint for instant updates

## Tech Stack
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript

## Getting Started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create a `.env.local` file in the project root:

```bash
# API used by the admin client and login flow
NEXT_PUBLIC_API_BASE_URL="https://your-api.example.com"

# Portfolio owner (used by the public site fetch)
NEXT_PUBLIC_USER_ID="your-user-id"

# Server-side API base URL for ISR fetches
API_BASE_URL="https://your-api.example.com"

# Optional: secure the revalidate endpoint
REVALIDATE_SECRET="your-random-secret"
```

Notes:
- `NEXT_PUBLIC_API_BASE_URL` defaults to `https://oma-api.uriri.com.ng` if not provided.
- `NEXT_PUBLIC_USER_ID` defaults to a placeholder user in `lib/config.ts` for local use.
- `API_BASE_URL` is required for server-side data fetches in `lib/server/portfolio.ts`.

## Admin Routes
- `/admin/login` – Google sign-in
- `/admin/dashboard` – system status + quick links
- `/admin/content` – edit hero, experience, projects, skills, contacts, footer, navigation
- `/admin/theme` – theme presets, previews, and advanced customization
- `/admin/ai-suggestions` – resume-based suggestions flow
- `/admin/seo` – SEO settings
- `/admin/settings` – account/portfolio settings

## Revalidation

Trigger ISR refresh via:

```
POST /api/revalidate
Headers:
  x-revalidate-token: <REVALIDATE_SECRET>
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
