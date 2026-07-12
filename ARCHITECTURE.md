# Architecture Reference

Quick-reference for AI agents. Read this before editing any files.

## Project Purpose

Bilingual (en/ar) Next.js 16 doc website. Currently one course: `openshift-upi-v414` — an OpenShift 4.14 UPI on vSphere installation guide with 12 sections.

## File Map

```
src/
  content/
    index.ts                  — Course registry (getCourse, getAllCourseSlugs)
    openshift.tsx             — Course composer (~40 lines, imports sections + Cover + sidebarGroups)
    openshift/
      sections.ts             — Barrel re-exporting all 12 section files
      01-variables.tsx        — Variable definitions (VariablesTable)
      02-prerequisites.tsx    — Prerequisites
      03-wsl-setup.tsx        — WSL setup
      04-vsphere.tsx          — vSphere config
      05-haproxy-nfs.tsx      — HAProxy + NFS VM setup
      06-ocp-vms.tsx          — OCP node cloning
      07-ignition.tsx         — Ignition injection (pyVmomi)
      08-cluster-install.tsx  — Cluster bootstrap + install
      09-postinstall.tsx      — Post-install (image registry, operators)
      10-cleanup.tsx          — Cleanup procedures
      11-troubleshooting.tsx  — Troubleshooting guide
      12-tests.tsx            — Verification tests
    scripts/
      setup-env.sh            — Downloadable env template
  components/
    docs/                     — 16 doc components (see inventory below)
    layout/                   — Topbar, Sidebar, MobileDrawer, DocsPageLayout
  app/
    [locale]/                 — App Router pages (landing, courses)
    globals.css               — All styles, CSS vars, RTL rules
  i18n/                       — next-intl routing + request config
messages/
  en.json, ar.json            — Translations
```

## Doc Component Inventory

### Layout & Structure

| Component | Props | Purpose |
|-----------|-------|---------|
| `Section` | `id`, `num`, `title`, `children`, `numColor?` | Numbered page section with header badge |
| `Subsection` | `id?`, `title`, `children` | Nested `<h3>` block inside a Section |
| `Cover` | `breadcrumb`, `title`, `highlight?`, `sub`, `chips?` | Page hero/header with breadcrumb, title, subtitle, chips |
| `Prose` | `children` | Styled `<p class="prose">` for body text |

### Code & Verification

| Component | Props | Purpose |
|-----------|-------|---------|
| `CodeBlock` | `label?`, `children`, `variant?`, `lang?` | Syntax-highlighted code (async, uses Shiki). `<VAR>` placeholders auto-extracted |
| `CopyButton` | `code` | Client-side clipboard copy button |
| `VerifyBlock` | `label?` (default: "verify"), `children` | Labeled verification/expected-output block |

### Alerts & Callouts

| Component | Props | Purpose |
|-----------|-------|---------|
| `Callout` | `variant: "info" \| "warn" \| "danger" \| "success"`, `icon?`, `children` | Alert box with icon. Defaults: info=ℹ️, warn=⚠️, danger=🚫, success=✅ |

### Variables

| Component | Props | Purpose |
|-----------|-------|---------|
| `Var` | `name` | Inline reactive variable display — shows value or `<NAME>` placeholder |
| `VariablesTable` | `columns`, `rows` | Interactive table with editable input fields bound to varStore |
| `VarReplace` | (none) | Invisible — scans DOM for `[data-var]` elements and reactively updates from varStore |

### Tables & Lists

| Component | Props | Purpose |
|-----------|-------|---------|
| `InfoTable` | `columns: {header, key}[]`, `rows` | Static HTML table |
| `StepList` | `steps: {title, desc}[]` | Ordered list of titled steps |
| `BenefitGrid` | `cards: {icon, title, body, danger?}[]` | Grid of icon+title+body cards |

### Misc

| Component | Props | Purpose |
|-----------|-------|---------|
| `Collapsible` | `title`, `children`, `defaultOpen?` | `<details>/<summary>` collapsible section |
| `Chip` | `label`, `color: "green" \| "blue" \| "amber" \| "red"` | Small colored inline badge |
| `NodeTag` | `label`, `variant: "all" \| "h1" \| "h2" \| "h3"` | Node hierarchy level tag |

## Variable System

Variables use `<Var name="VARIABLE_NAME" />` in prose and `<VARIABLE_NAME>` in CodeBlock children.

- **Storage:** `localStorage` key `varStore` (JSON object)
- **Reactivity:** `VarReplace` component uses `MutationObserver` + store subscription to update all placeholders
- **Editing:** `VariablesTable` renders `<input>` fields bound to varStore
- **CodeBlock behavior:** `<VAR>` patterns are extracted before Shiki highlighting, restored as `<span class="placeholder" data-var="...">` elements

### Variable definitions (from Section 1)

| Category | Variable | Example |
|----------|----------|---------|
| vSphere | `VCENTER_IP`, `VCENTER_USER`, `VCENTER_PASSWORD`, `DATACENTER`, `CLUSTER`, `DATASTORE`, `NETWORK`, `VM_FOLDER`, `CENTOS_ISO` | — |
| Network | `GATEWAY`, `SUBNET_MASK`, `DNS1`, `DNS2`, `DNS_ADMIN_IP`, `DOMAIN`, `CLUSTER_NAME`, `BASE_DOMAIN` | — |
| Node IPs | `NFS_HAPROXY_IP`, `API_IP`, `APPS_IP`, `BOOTSTRAP_IP`, `MASTER_0_IP`, `MASTER_1_IP`, `MASTER_2_IP`, `WORKER_0_IP`, `WORKER_1_IP`, `WSL_IP`, `NFS_HAPROXY_USER` | — |
| VM Names | `RHCOS_TEMPLATE`, `NFS_HAPROXY_VM`, `BOOTSTRAP_VM`, `MASTER_PREFIX`, `WORKER_PREFIX` | — |
| Credentials | `SSH_KEY_PATH`, `OCP_ADMIN_PASS`, `PULL_SECRET` | — |
| Paths | `OCP4_DIR`, `NFS_EXPORT`, `SSH_PUBLIC_KEY` | — |

## Content Patterns

### SSH + Remote Commands

SSH into a remote host, then run commands — all in a single `CodeBlock`:

```tsx
<CodeBlock lang="bash" label="nfs-haproxy">
{`# SSH into the nfs-haproxy VM
ssh -i ~/.ssh/openshift <NFS_HAPROXY_USER>@<NFS_HAPROXY_IP>
# Set a static IP address with bash
sudo nmcli con mod ens32 \\
  ipv4.addresses <NFS_HAPROXY_IP>/16 \\
  ipv4.method manual
# Restart the interface
sudo nmcli con down ens32 && sudo nmcli con up ens32`}
</CodeBlock>
```

**Rule:** SSH as the first line, then commands. Never split SSH + commands into separate CodeBlocks for the same host session.

### Verification Blocks

Always follow a CodeBlock with a VerifyBlock showing expected output:

```tsx
<VerifyBlock>
  <p><code>oc get clusteroperator image-registry</code> shows <code>Available=True</code></p>
</VerifyBlock>
```

### Callouts

Use after CodeBlocks for warnings, tips, or context:

```tsx
<Callout variant="warn">
  Open the console URL in a browser to install CentOS 9 manually.
</Callout>
```

Variants: `info`, `warn`, `danger`, `success`.

### Collapsible Configs

Wrap verbose config files (YAML, INI, scripts) in a Collapsible:

```tsx
<Collapsible title="registry-nfs.yaml">
<CodeBlock lang="yaml" label="WSL — registry-nfs.yaml">
{`apiVersion: v1
...`}
</CodeBlock>
</Collapsible>
```

### Cross-References

Link between sections using anchor IDs:

```tsx
Requires HAProxy and NFS from <a href="#nfs-haproxy">Section 5</a> to be running.
```

Section IDs: `variables`, `prerequisites`, `wsl-setup`, `vsphere`, `nfs-haproxy`, `ocp-vms`, `ignition`, `cluster-install`, `postinstall`, `cleanup`, `troubleshooting`, `tests`.

### JSX Comments

Each section/subsection is prefixed with a JSX comment for source navigation:

```tsx
{/* ===== Section 9 ===== */}
{/* --- 9.1: Configure Image Registry --- */}
```

### Blank Lines

Add empty lines between adjacent JSX block elements (`</CodeBlock>`, `</VerifyBlock>`, `</Callout>`, `</Prose>`) for source readability.

## Conventions

- Default locale is `ar` (Arabic), RTL-first design
- Code blocks use labeled language tags (`bash`, `yaml`, `ini`, `python`)
- Variable placeholders in code: `<VARIABLE_NAME>` angle-bracket format
- Variable placeholders in prose: `<Var name="VARIABLE_NAME" />` component
- Each section file exports a named function: `export function SectionN()`
- Barrel file `sections.ts` re-exports all sections
- Course composer `openshift.tsx` imports sections + Cover + sidebarGroups
- Do NOT add comments to code blocks unless explicitly asked
- Do NOT create new files unless explicitly asked
