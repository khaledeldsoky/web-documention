# Session State — 2026-07-13

## Project
Bilingual (en/ar) Next.js 16 doc website for technical guides.
- Stack: Next.js 16.2, React 19.2, TypeScript, Tailwind v4, next-intl v4, next-themes, shiki
- Default locale: ar (Arabic), RTL-first design

## What's working
- i18n routing (en/ar), locale-aware layout, theme toggle
- Landing page with course cards + search filter
- Four courses registered: `openshift-upi-v414` (12 sections), `linux-admin` (23 sections), `k8s-airgap-baremetal` (19 sections), `k8s-airgap-vsphere` (20 sections)
- All doc components built (Cover, Section, CodeBlock, Callout, etc.)
- Variable system (varStore — namespaced per course, localStorage-backed, reactive, 3-case rules)
- Syntax highlighting via shiki (github-dark/github-light themes)
- Sidebar with IntersectionObserver active-tracking, collapsible groups

## Session 2026-07-13 — k8s Air-Gap Courses + Image Fixes + Variable System

### k8s-airgap-baremetal course (19 sections, COMPLETE)
44. Created `k8s-airgap-baremetal` course — 19 sections (0-18) in `src/content/k8s-airgap-baremetal/`
45. Section 0: VariablesTable with 30+ vars (Node IPs, Network, Versions, Infra)
46. Section 3: Offline bundle with "Find Your Versions" subsection
47. Registered in index.ts, messages/en.json, messages/ar.json, landing page

### k8s-airgap-vsphere course (20 sections, COMPLETE)
48. Created `k8s-airgap-vsphere` course — 20 sections (0-19), fork of baremetal
49. Section 2 (NEW): Create VMs with govc (5 subsections: Install govc, Upload ISO, Create template VM, Clone VMs, Verify network)
50. Sections 4-19: Renumbered from baremetal 3-18
51. Registered in index.ts, messages/en.json, messages/ar.json, landing page

### Variable system per-course namespacing
52. `varStore.ts` rewritten with `course` parameter — `getStore(course)`, `setVar(course, name, value)`, localStorage key `{course}-vars`
53. `VariablesTable`, `Var`, `VarReplace` all accept `course` prop
54. `CoursePageClient` passes `slug` as `course`
55. All existing `<Var>` usages updated with `course` prop

### Variable 3-case rules
56. Documented in `docs/VARIABLE-RULES.md`
57. VariablesTable uses `vars[varName] || val` + `vars[varName] !== ""` color logic
58. VarReplace uses `value === ""` check (keeps `<VAR>` for undefined, clears for empty)

### Image tag fixes + Helm binary
59. Removed `htop` from all dnf commands (not available in repo)
60. Moved helm from RPM to binary download (tarball from GitHub)
61. Added "Install Docker on Staging Machine" subsection to offline bundle
62. Added helm version discovery to "Find Your Versions"
63. Converted hard-coded `flannel-cni-plugin:v1.5.1` → `<FLANNEL_CNI_VERSION>` variable
64. Converted hard-coded `kube-webhook-certgen:v1.5.1` → `<INGRESS_WEBHOOK_VERSION>` variable
65. Fixed METALLB_VERSION double-v bug in GitHub URL (`v<METALLB_VERSION>` → `<METALLB_VERSION>`)
66. Updated example versions: COREDNS `1.13.2`, FLANNEL `v0.28.7`, INGRESS_NGINX `v1.15.1`
67. Added `HELM_VERSION`, `FLANNEL_CNI_VERSION`, `INGRESS_WEBHOOK_VERSION` to VariablesTables

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

## Session 2026-07-11 — Phases 1-4 complete

### Phase A — Section 8 restructure
20. CSR approval moved from WSL to SSH into bootstrap (now 8.4). Workers powered on before CSR approval (now 8.3). Callout added about re-running CSR approval when adding workers.

### Phase B — Section descriptions
21. 12 `<Prose>` paragraphs added at the start of each section explaining purpose and context.

### Phase C — Inline `#` comments
22. Added beginner-friendly bash comments above commands in all ~35 code blocks across sections 3-11.

### Phase D — Collapsible configs, cross-references, diagnosis, test distribution, file split
23. Created `<Collapsible>` component (`src/components/docs/Collapsible.tsx`) and `.collapsible` CSS for collapsing verbose configs.
24. Wrapped HAProxy ini block (Section 5.3) and pyVmomi script (Section 7.3) in Collapsible.
25. Fixed pyVmomi script: lang changed to `python`, `\$OCP4_DIR` → `<OCP4_DIR>`.
26. Added cross-reference anchor links between sections 5↔6, 6↔5, 7↔6, 8↔6+7, 9↔5, 10↔10.2.
27. Added diagnosis guidance `<Callout>` after each of the 6 troubleshooting subsections (11.1–11.6).
28. Distributed VerifyBlocks for bootstrap power-on, master power-on, worker power-on, console access, cleanup final verification.
29. Deleted Section 12 (Verification Tests) — 4 InfoTables (35 tests) removed; replaced with a brief distribution note.
30. **Phase 4 — File split**: Monolithic `openshift.tsx` (1204 lines) split into 12 per-section files under `src/content/openshift/` + barrel file `sections.ts`. Main file now a ~40-line composer.

## Session 2026-07-12 — OCP 4.14 image registry NFS fix + ARCHITECTURE.md

31. Fixed broken image registry NFS config in Section 9 (post-install). The `oc patch` with `spec.storage.nfs` is invalid in OCP 4.14+. Replaced with correct PV/PVC workflow:
    - Added `<Collapsible>` with inline `registry-nfs.yaml` (PV + PVC)
    - Added `storageClassName: ""` to both PV and PVC (prevents Pending from default StorageClass mismatch)
    - Patch command now uses `storage.pvc.claim` instead of `storage.nfs`
    - Added `Collapsible` import to 09-postinstall.tsx
32. Created `ARCHITECTURE.md` — concise reference for AI agents: component inventory (16 components with props), content authoring patterns, variable system docs, file map, conventions.
33. Standardized file-creation pattern across all sections — every config/script file now follows the same symmetric flow:
    - Bash CodeBlock with `vim` command (create/edit the file)
    - `Collapsible` with file content
    - Bash CodeBlock with apply/use commands
    - `VerifyBlock` with expected result
    - Applied to: install-config.yaml (7.1), pyVmomi script (7.3), registry-nfs.yaml (9.1)
    - Also updated pyVmomi Collapsible title and CodeBlock label to show file path instead of generic "requires pyVmomi"

## Session 2026-07-12 — Linux Admin Course (23 sections, COMPLETE)

34. Created `linux-admin` course — 23 sections (0-22) in `src/content/linux/` sourced from `/root/Documentation/en/courses/linux-admin/index.html`.
    - Reorganized from original 24 HTML sections: merged Firewall+Network Ports → Section 11, merged XFS/Ext4+Storage → Section 13
    - Added new Section 2 (Navigating the Filesystem) for beginners
    - Moved Nginx vs Apache + HTTP Errors to end of course (Sections 21-22)
35. Section 1 enhancements: added /proc and /sys live code examples, /etc/tmpfiles.d subsection, cross-linked to other sections
36. Section 0 cross-reference fix: HTML references "Section 22 — Rescue Mode & GRUB" → corrected to #rescue-grub (Section 19)
37. Registered `linux-admin` in `src/content/index.ts`, `messages/en.json` (already had entries), landing page (already listed)
38. Created course module `src/content/linux.tsx` with Cover + sidebarGroups (7 groups) + all Section imports
39. Created barrel `src/content/linux/sections.ts` (Section0-Section22)
40. All 23 sections fully ported with component pattern: Section, Subsection, Prose, CodeBlock, InfoTable, Callout, VerifyBlock, BenefitGrid, StepList
41. Sections use identical conventions as OpenShift course: empty lines before comments, comment color #6bc950, nested CodeBlock border removal pending

## Session 2026-07-12 — InfoTable fix + sidebar labels

42. Fixed `InfoTable` component — cell values now render HTML via `dangerouslySetInnerHTML`. Previously `<code>` and `<strong>` tags in row values showed as raw text.
43. Sidebar section labels changed from `"N. Title"` to `"N - Title"` in both courses (linux-admin: 23 labels, openshift: 12 labels).

### Section inventory (0-22)
0. Boot Process — StepList, CodeBlock, InfoTable, VerifyBlock, Callout
1. Linux Filesystem Hierarchy — 7 subsections (enhanced with /proc, /sys, tmpfiles.d)
2. Navigating the Filesystem — 7 subsections (new beginner content)
3. Links — InfoTable, CodeBlock ×2, Callout
4. SSH — Remote Access — CodeBlock ×3, VerifyBlock, Callout ×2
5. Users & Groups — InfoTable ×2, CodeBlock ×4, Callout ×2
6. Permissions — InfoTable ×3, CodeBlock ×4, Callout ×4
7. Package Management — InfoTable ×2, CodeBlock ×4, Callout ×2
8. SELinux — InfoTable, CodeBlock ×4, BenefitGrid, Callout ×2
9. Kernel & Modules — InfoTable ×2, CodeBlock ×4, Callout ×2
10. Logging & Log Management — InfoTable, CodeBlock ×4, Callout ×2
11. Firewall & Ports (merged) — InfoTable ×2, CodeBlock ×4, VerifyBlock, Callout ×3
12. Networking Configuration — InfoTable, CodeBlock ×4, Callout ×2
13. Storage — Disks, LVM & Filesystems (merged) — BenefitGrid, InfoTable ×3, CodeBlock ×8, VerifyBlock ×2, Callout ×5
14. Systemd Deep Dive — InfoTable ×3, CodeBlock ×5, Callout ×2
15. Cron & At — InfoTable, CodeBlock ×2, VerifyBlock, Callout ×2
16. Performance Diagnostics — InfoTable, CodeBlock ×5, Callout ×2
17. Process Management — InfoTable ×3, CodeBlock ×3, VerifyBlock, Callout ×2
18. Troubleshooting — StepList, CodeBlock ×3, InfoTable, Callout
19. Rescue Mode & GRUB — CodeBlock ×3, VerifyBlock, Callout ×2
20. Essential Commands — CodeBlock ×8
21. Nginx vs Apache — BenefitGrid, InfoTable, CodeBlock, Callout
22. HTTP 400 vs 500 — BenefitGrid ×2, InfoTable, VerifyBlock

## File structure
- `src/content/openshift.tsx` — composer (~40 lines, imports sections + Cover + sidebarGroups)
- `src/content/openshift/` — 12 section files (`01-variables.tsx` through `12-tests.tsx`) + barrel `sections.ts`
- `src/content/linux.tsx` — linux course module (Cover + sidebarGroups + all Section imports)
- `src/content/linux/` — 23 section files (`00-boot-process.tsx` through `22-http-errors.tsx`) + barrel `sections.ts`
- `src/content/k8s-airgap-baremetal.tsx` — course module (Cover + sidebarGroups 6 groups)
- `src/content/k8s-airgap-baremetal/` — 19 section files (0-18) + barrel `sections.ts`
- `src/content/k8s-airgap-vsphere.tsx` — course module (Cover + sidebarGroups 7 groups)
- `src/content/k8s-airgap-vsphere/` — 20 section files (0-19) + barrel `sections.ts`
- `src/components/docs/Collapsible.tsx` — collapsible config block component
- `src/content/scripts/setup-env.sh` — downloadable env template
- `docs/VARIABLE-RULES.md` — variable 3-case system documentation
- `ARCHITECTURE.md` — AI agent reference: components, patterns, variables, file map

## Quick commands
- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run lint` — run ESLint
- `npx tsc --noEmit --skipLibCheck` — typecheck (pre-existing `next-intl` errors only)

## Key files
- `src/content/openshift.tsx` — course composer
- `src/content/openshift/sections.ts` — barrel re-exporting all 12 sections
- `src/content/linux.tsx` — linux course module
- `src/content/linux/sections.ts` — barrel re-exporting all 23 sections
- `src/content/k8s-airgap-baremetal.tsx` — baremetal k8s course module
- `src/content/k8s-airgap-baremetal/sections.ts` — barrel re-exporting all 19 sections
- `src/content/k8s-airgap-vsphere.tsx` — vSphere k8s course module
- `src/content/k8s-airgap-vsphere/sections.ts` — barrel re-exporting all 20 sections
- `src/content/index.ts` — course registry (4 courses)
- `src/lib/varStore.ts` — variable store (namespaced per course)
- `src/app/globals.css` — all styles, CSS vars, RTL rules
- `src/app/[locale]/layout.tsx` — locale-aware root layout
- `src/components/docs/` — 17 doc components (Var, VariablesTable, VarReplace accept `course` prop)
- `src/components/layout/` — 4 layout components
- `messages/en.json` / `messages/ar.json` — translations (4 courses)
