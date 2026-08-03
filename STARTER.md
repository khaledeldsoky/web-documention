# Build a Documentation Website

## Task

Build a bilingual (English / Arabic) technical documentation website with dark/light mode, eye-comfortable design, and RTL support.

## Tech Stack

- **Framework:** Next.js 16.2 + TypeScript + App Router
- **Styling:** Tailwind CSS v4 + CSS custom properties
- **i18n:** next-intl v4 (locales: `en`, `ar`)
- **Theming:** next-themes (dark/light, persisted to localStorage)
- **Code highlighting:** shiki
- **Fonts:** JetBrains Mono (code), Noto Naskh Arabic (Arabic prose), Noto Sans Arabic (Arabic UI), Inter (Latin)

## Skills to Load

Load these skills for detailed conventions:

1. **`/root/Docs/skills/docs-theme/SKILL.md`** — Design system: colors, typography, spacing, dark/light mode, RTL layout rules
2. **`/root/Docs/skills/docs-components/SKILL.md`** — Component patterns: Cover, Section, CodeBlock, Callout, Sidebar, tables
3. **`/root/Docs/skills/docs-i18n/SKILL.md`** — i18n setup: next-intl routing, translation files, RTL layout, Arabic typography
4. **`/root/Docs/skills/docs-nextjs/SKILL.md`** — Next.js 16 conventions: async params, proxy.ts, cacheComponents, Tailwind v4

## Workflow

1. **Design** — Use `docs-theme` to establish color palettes, typography scale, and spacing system
2. **Layout** — Use `docs-i18n` to set up locale routing, root layout with `dir`, and translation files
3. **Components** — Use `docs-components` to build the UI library (Cover → sections → code blocks → callouts → sidebar)
4. **Pages** — Wire up landing page and course pages with the App Router
5. **Polish** — Add dark/light toggle, language switcher, responsive breakpoints, accessibility
6. **Deploy** — Build with `next build`, deploy to Vercel or Docker

## Key Requirements

- Eye-comfortable typography (generous line-height, muted body text, sufficient contrast)
- Dark mode and light mode via CSS custom properties + `next-themes`
- Full RTL support for Arabic (mirrored layout, correct font stack, bidi-safe code blocks)
- Clean, readable code blocks with syntax highlighting
- CodeBlock labels use bold teal (color: var(--accent2), font-weight: 700) to show where commands execute
- Responsive sidebar navigation
- Fast load times (static generation where possible)
