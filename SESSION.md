# Session State — 2026-07-09

## Project
Bilingual (en/ar) Next.js 16 doc website for technical guides.
- Stack: Next.js 16.2, React 19.2, TypeScript, Tailwind v4, next-intl v4, next-themes, shiki
- Default locale: ar (Arabic), RTL-first design

## What's working
- i18n routing (en/ar), locale-aware layout, theme toggle
- Landing page with course cards + search filter
- One course registered: `openshift-upi-v414` (content in `src/content/openshift.tsx`, 1049 lines)
- All doc components built (Cover, Section, CodeBlock, Callout, etc.)
- Variable system (varStore — localStorage-backed, reactive)
- Syntax highlighting via shiki (github-dark/github-light themes)
- Sidebar with IntersectionObserver active-tracking, collapsible groups

## Fixes applied from ocp4-install/Update-openshift-docs.ipynb
1. Firewall section: `systemctl enable --now` moved before `firewall-cmd` rules (firewalld must be running)
2. SELinux: `http_port_t` → `haproxy_port_t` for ports 6443/22623 (in both install + cleanup sections)
3. 10.1 Cleanup: `rm -rf dir/` → `rm -rf dir/*` (keep dirs, remove contents only)
4. 10.2 Cleanup: added SSH prompt note + `http_port_t` → `haproxy_port_t`
5. Afterburn IPs: already correct (`::none:nameserver=` format)
6. install-config.yaml controlPlane: already correct (object, not list)
7. sshKey format: `sshKey: |` YAML literal block → `sshKey: '...'` single-quoted inline string
8. Danger callout: rewrote from "Replace <X> from..." command-style to plain instructions
9. 10.1 Cleanup: added `find $OCP4_DIR/config -mindepth 1 -delete`
10. Afterburn kernel args: added `nameserver=<DNS2>` (2nd DNS)
11. 10.2 Cleanup: SSH as separate code block using variable placeholders
12. Python pyVmomi script: added for injecting ignition into all 6 VMs
13. Nginx/URL approach REMOVED: deleted Configure nginx, SCP Ignition, and Inject Ignition via URL subsections. Removed all related references in SELinux, firewall (port 8080), cleanup, troubleshooting, log table, and tests.
14. Section 10.2 merged: SSH + remote commands in a single CodeBlock (was 2 separate blocks)
15. Remove Bootstrap (8.6) split: separate WSL destroy block + SSH sed/restart block (was inline SSH)
16. Section/Subsection comments: added JSX comments as `{/* ===== Section N ===== */}` and `{/* --- N.M: Title --- */}` throughout
17. Explanatory JSX notes: added notes for HAProxy, SELinux, Afterburn, pyVmomi, Cleanup sections
18. Blank lines: added empty lines between adjacent JSX block elements (after `</CodeBlock>`, `</VerifyBlock>`, `</Callout>`, `</Prose>`) file-wide
19. Test #23 fixed: `"Ignition served" → "200 OK"` changed to `"pyVmomi injection" → "data + encoding keys set"`

## File size
- `openshift.tsx`: ~1130 lines (was 1033) — growth from comments + blank lines


## Future courses to add (from messages JSON)
- github-actions
- linux-admin
- bash-basics

## Quick commands
- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run lint` — run ESLint

## Key files
- `src/content/openshift.tsx` — main course content
- `src/content/index.ts` — course registry
- `src/app/globals.css` — all styles, CSS vars, RTL rules
- `src/app/[locale]/layout.tsx` — locale-aware root layout
- `src/components/docs/` — 15 doc components
- `src/components/layout/` — 4 layout components
- `messages/en.json` / `messages/ar.json` — translations
