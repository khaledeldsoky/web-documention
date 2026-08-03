# skils — Technical Documentation Hub

Bilingual (English/Arabic) technical documentation site built with Next.js 16, Tailwind CSS v4, and the claude-theme design system. Features dark/light mode, RTL layout (Arabic default), collapsible sidebar, and syntax-highlighted code blocks.

## Quick Start

```bash
# Using Docker (recommended)
docker compose up dev

# Or without Docker (requires Node.js 20+)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — hot reload with Turbopack.

## Available Courses

| Slug | Title | Sections |
|------|-------|----------|
| `openshift-upi-v414` | OpenShift 4.14 UPI on vSphere | 12 |
| `linux-admin` | Linux System Administration | 23 |
| `k8s-airgap-ha` | Kubernetes HA Air-Gapped Deployment | 24 |

### Course: OpenShift 4.14 UPI on vSphere

User-provisioned infrastructure guide covering HAProxy, NFS storage, RHCOS templates, ignition injection via pyVmomi, cluster install, post-install, cleanup, and verification tests. All configurable values (IPs, credentials, paths) use a live variable system — edit once, reflected everywhere.

### Course: Linux System Administration

Comprehensive guide from boot process to performance tuning — 23 sections covering filesystem, SSH, users, permissions, packages, SELinux, networking, storage, systemd, and more.

### Course: Kubernetes HA Air-Gapped Deployment

Deploy a 3+3 Kubernetes HA cluster on air-gapped infrastructure — registry, DNS, NTP, containerd, kube-vip, Flannel, MetalLB, NGINX Ingress. All configurable values use a live variable system.

## Adding a Course

1. Create a component in `src/content/<name>.tsx` — export content + `sidebarGroups`
2. Register it in `src/content/index.ts` under the `courses` record
3. Add translation entries in `messages/en.json` and `messages/ar.json` under `courses.<slug>`

## Tech Stack

- **Framework:** Next.js 16.2 + TypeScript + App Router
- **Styling:** Tailwind CSS v4 + CSS custom properties (claude-theme)
- **i18n:** next-intl v4 (locales: `en`, `ar`; default: `ar`)
- **Theming:** next-themes (dark/light, persisted to `localStorage`)
- **Syntax highlighting:** shiki (github-dark / github-light)
- **Fonts:** JetBrains Mono (code), Noto Naskh/Sans Arabic (Arabic)
- **Runtime:** Docker + Node.js 20

## Project Structure

```
src/
  app/[locale]/          — App Router pages (landing, courses)
  components/
    docs/                — Cover, Section, CodeBlock, Callout, VerifyBlock,
                           InfoTable, VariablesTable, Var, StepList, Chip
    layout/              — Topbar, Sidebar, MobileDrawer, DocsPageLayout
  content/               — Course content components + registry
    index.ts             — Course registry (getCourse, getAllCourseSlugs)
    openshift.tsx        — OpenShift 4.14 UPI course composer (~40 lines)
    openshift/           — 12 per-section files + barrel sections.ts
  app/globals.css        — All styles, CSS vars, RTL rules
  i18n/                  — next-intl routing + request config
messages/                — Translation JSON files (en, ar)
ARCHITECTURE.md          — AI agent reference (components, patterns, variables)
```

## Scripts

| Task | Docker | npm |
|------|--------|-----|
| Dev server | `docker compose up dev` | `npm run dev` |
| Production build | `docker compose build prod` | `npm run build` |
| Production server | `docker compose up -d prod` | `npm start` |
| Production build and server | `docker compose up -d prod --build` | `npm start` |
| Lint | `docker compose exec dev npm run lint` | `npm run lint` |

## Variable System

Course content uses `<Var name="VARIABLE_NAME" />` placeholders that render as amber-highlighted, editable fields. Values are stored in `localStorage` (key: `varStore`) and reactive — change once, all occurrences update instantly. The VariablesTable at the start of each course lists every variable with its category, placeholder, and example value.

## Conventions

- Default locale is `ar` (Arabic), RTL-first design
- Code blocks use labeled language tags (`bash`, `yaml`, `ini`); labels render as bold teal to indicate execution context
- Air-gap courses automate multi-node commands via `run-all` helper scripts (passwordless SSH from master1)
- SSH + remote command sequences are contained in a single `CodeBlock` (SSH as first line)
- Each section/subsection is prefixed with a JSX comment for navigation in source
- Blank lines separate adjacent JSX block elements for readability

## Environment Variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `NODE_ENV` | `production` | no | Runtime mode |
| `PORT` | `3000` | no | Server port |
| `HOSTNAME` | `0.0.0.0` | no | Server bind address |
| `NEXT_TELEMETRY_DISABLED` | `1` | no | Disable Next.js telemetry |

> Set these in `docker-compose.yml` under `environment`, or create a `.env` file in the project root.
