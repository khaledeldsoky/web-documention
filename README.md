# Skills — Technical Documentation Hub

Bilingual (English/Arabic) technical documentation site built with Next.js 16, Tailwind CSS v4, and the claude-theme design system. Features dark/light mode, RTL support, collapsible sidebar navigation, and interactive code blocks.

## Quick Start

```bash
docker compose up dev
```

Open [http://localhost:3001](http://localhost:3001) — hot reload enabled.

## Production

```bash
docker compose up prod --build -d
```

Open [http://localhost:3000](http://localhost:3000).

## Available Courses

| Slug | Title | Language |
|------|-------|----------|
| `openshift-upi-v414` | OpenShift 4.14 UPI on vSphere | en |

## Adding a Course

1. Create a component in `src/content/<name>.tsx` exporting the content and sidebar config
2. Register it in `src/content/index.ts` under the `courses` record
3. Add translation entries in `messages/en.json` and `messages/ar.json` under `courses.<slug>`

## Tech Stack

- **Framework:** Next.js 16.2 + TypeScript + App Router
- **Styling:** Tailwind CSS v4 + CSS custom properties (claude-theme)
- **i18n:** next-intl v4 (locales: `en`, `ar`; default: `ar`)
- **Theming:** next-themes (dark/light, persisted to `localStorage`)
- **Fonts:** JetBrains Mono (code), Noto Naskh/Sans Arabic (Arabic)
- **Runtime:** Node.js 20

## Project Structure

```
src/
  app/[locale]/          — App Router pages (landing, courses)
  components/
    docs/                — Cover, Section, CodeBlock, Callout, etc.
    layout/              — Topbar, Sidebar, MobileDrawer, DocsPageLayout
  content/               — Course content components + registry
    index.ts             — Course registry (getCourse, getAllCourseSlugs)
    openshift.tsx        — OpenShift 4.14 UPI course
  i18n/                  — next-intl routing + request config
messages/                — Translation JSON files (en, ar)
```

## Docker

| Service | Port | Description |
|---------|------|-------------|
| `dev` | 3001 | Hot-reload dev server with Turbopack |
| `prod` | 3000 | Production server (standalone output) |

Images are built from `node:20-alpine`. The production image uses Next.js's `output: "standalone"` for a minimal runtime footprint (~150 MB).

## Environment Variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `NODE_ENV` | `production` | no | Runtime mode |
| `PORT` | `3000` | no | Server port |
| `HOSTNAME` | `0.0.0.0` | no | Server bind address |
| `NEXT_TELEMETRY_DISABLED` | `1` | no | Disable Next.js telemetry |
# web-documention
