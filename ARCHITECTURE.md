# Architecture Reference

Quick-reference for AI agents. Read this before editing any files.

## Component Inventory

### Layout & Structure
| Component | Props | Purpose |
|-----------|-------|---------|
| `Section` | `id`, `num`, `title`, `children` | Numbered page section |
| `Subsection` | `id?`, `title`, `children` | Nested `<h3>` inside Section |
| `Cover` | `breadcrumb`, `title`, `highlight?`, `sub`, `chips?` | Page hero/header |
| `Prose` | `children` | Styled `<p>` for body text |

### Code & Verification
| Component | Props | Purpose |
|-----------|-------|---------|
| `CodeBlock` | `label?`, `children`, `variant?`, `lang?` | Syntax-highlighted code (Shiki). `<VAR>` placeholders auto-extracted |
| `CopyButton` | `code` | Clipboard copy button |
| `VerifyBlock` | `label?`, `children` | Verification/expected-output block |

### Alerts
| Component | Props | Purpose |
|-----------|-------|---------|
| `Callout` | `variant: "info" \| "warn" \| "danger" \| "success"`, `children` | Alert box |

### Variables
| Component | Props | Purpose |
|-----------|-------|---------|
| `Var` | `course`, `name` | Inline reactive variable display |
| `VariablesTable` | `course`, `columns`, `rows` | Editable variable input table |
| `VarReplace` | `course` | Scans DOM for `[data-var]` spans, updates from store |

### Tables & Lists
| Component | Props | Purpose |
|-----------|-------|---------|
| `InfoTable` | `columns: {header, key}[]`, `rows` | HTML table via `dangerouslySetInnerHTML` |
| `StepList` | `steps: {title, desc}[]` | Ordered step list |
| `BenefitGrid` | `cards: {icon, title, body}[]` | Icon+title+body grid |

### Misc
| Component | Props | Purpose |
|-----------|-------|---------|
| `Collapsible` | `title`, `children` | `<details>/<summary>` collapsible |
| `NodeTag` | `label`, `variant: "all" \| "h1" \| "h2" \| "h3"` | Node hierarchy tag |
| `Chip` | `label`, `color` | Inline badge |

## Variable System

- **Storage:** `localStorage` key `{course}-vars` (JSON, namespaced per course)
- **CodeBlock:** `<VAR>` → `<span class="placeholder" data-var="VAR">` (before Shiki)
- **Prose:** `<Var course="..." name="..." />` reads from store, shows green when filled
- **Reactivity:** `VarReplace` uses MutationObserver + store subscription
- **Click-to-edit:** `[data-var]` spans swap to styled `<input>` on click
- **VerifyBlock rule:** Never use `{'<VAR>'}` — always use `<Var>`
- **InfoTable rule:** Use `<span data-var="NAME">&lt;NAME&gt;</span>` in string values
- **3-case rules:** See `docs/VARIABLE-RULES.md`

## Content Patterns

### CodeBlock + VerifyBlock
```tsx
<CodeBlock lang="bash" label="master1">
{`command --flag <VARIABLE>`}
</CodeBlock>
<VerifyBlock label="expected output">
  <p><code>command --flag value</code> shows <code>result</code></p>
</VerifyBlock>
```

### Variable in prose
```tsx
<Var course="k8s-airgap-ha" name="MASTER_0_IP" />
```

### Cross-reference
```tsx
Requires <a href="#section-id">Section N</a>
```

## Conventions

- Default locale: `ar` (Arabic), RTL-first
- Sidebar labels: `"N - Title"` format
- Code blocks: labeled with language (`bash`, `yaml`)
- Section files: `export function SectionN()`
- Barrel: `sections.ts` re-exports all sections
- Composer: imports sections + Cover + sidebarGroups
- JSX comments: `{/* ===== Section N ===== */}`
- Blank lines between adjacent JSX block elements
- No comments in code blocks unless asked
- No new files unless asked
