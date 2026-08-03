# Session State

## Project
Bilingual (en/ar) Next.js 16 doc website. Stack: Next.js 16.2, React 19.2, TypeScript, Tailwind v4, next-intl v4, next-themes, shiki. Default locale: ar (Arabic), RTL-first.

## Current State
3 courses registered:
- `openshift-upi-v414` — 12 sections
- `linux-admin` — 23 sections
- `k8s-airgap-ha` — 24 sections

## File Structure
```
src/content/
  index.ts                    — Course registry (3 courses)
  openshift.tsx               — OpenShift composer
  openshift/sections.ts       — 12 section files
  linux.tsx                   — Linux composer
  linux/sections.ts           — 23 section files
  k8s-airgap-ha.tsx           — K8s composer
  k8s-airgap-ha/sections.ts   — 24 section files
src/components/docs/          — 18 doc components
src/lib/varStore.ts           — Variable store (per-course)
messages/{en,ar}.json         — Translations (3 courses)
```

## Quick Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx tsc --noEmit` — typecheck
