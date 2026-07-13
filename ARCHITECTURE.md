# Architecture Reference

Quick-reference for AI agents. Read this before editing any files.

## Project Purpose

Bilingual (en/ar) Next.js 16 doc website. Four courses:
- `openshift-upi-v414` — OpenShift 4.14 UPI on vSphere installation guide (12 sections)
- `linux-admin` — Linux system administration (23 sections, 0-22)
- `k8s-airgap-baremetal` — Kubernetes air-gap bare-metal cluster (19 sections, 0-18)
- `k8s-airgap-vsphere` — Kubernetes air-gap vSphere with govc VM creation (20 sections, 0-19)

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
    linux.tsx                 — Linux course module (Cover + sidebarGroups + all Section imports)
    linux/
      sections.ts             — Barrel re-exporting all 23 section files (Section0-Section22)
      00-boot-process.tsx     — Boot process (BIOS vs UEFI)
      01-filesystem.tsx       — Filesystem hierarchy (/proc, /sys, tmpfiles.d)
      02-navigation.tsx       — Navigating the filesystem (cd, ls, find, tree)
      03-links.tsx            — Hard & symbolic links
      04-ssh.tsx              — SSH remote access
      05-users.tsx            — Users & groups
      06-permissions.tsx      — File permissions (chmod, chown, ACL)
      07-packages.tsx         — Package management (DNF, RPM, APT)
      08-selinux.tsx          — SELinux (modes, contexts, booleans)
      09-kernel.tsx           — Kernel & modules (lsmod, sysctl)
      10-logging.tsx          — Logging & log management (journalctl, rsyslog)
      11-firewall-ports.tsx   — Firewall & ports (firewall-cmd, ss)
      12-networking.tsx       — Networking configuration (nmcli, ip)
      13-storage.tsx          — Storage — disks, LVM & filesystems
      14-systemd.tsx          — Systemd deep dive (units, targets, drop-ins)
      15-cron.tsx             — Cron & at (scheduled tasks)
      16-performance.tsx      — Performance diagnostics (top, vmstat, iostat)
      17-processes.tsx        — Process management (ps, kill, nice)
      18-troubleshooting.tsx  — Troubleshooting methodology
      19-rescue-grub.tsx      — Rescue mode & GRUB recovery
      20-commands.tsx         — Essential commands (awk, grep, find, scp)
      21-nginx-apache.tsx     — Nginx vs Apache comparison
      22-http-errors.tsx      — HTTP 400 vs 500 error codes
    k8s-airgap-baremetal.tsx  — Course module (Cover + sidebarGroups 6 groups)
    k8s-airgap-baremetal/
      sections.ts             — Barrel re-exporting all 19 section files
      00-variables.tsx        — VariablesTable with 30+ vars
      01-overview.tsx         — Architecture overview + IP table
      02-static-ip.tsx        — Static IP configuration
      03-offline-bundle.tsx   — Build offline staging bundle (Docker, RPMs, images, helm)
      04-master1-infra.tsx    — Master1 infra setup (registry, dnsmasq)
      05-containerd.tsx       — Containerd installation
      06-kubeadm.tsx          — kubeadm/kubelet/kubectl install
      07-kube-vip.tsx         — kube-vip static pod
      08-init-cluster.tsx     — kubeadm init
      09-join-workers.tsx     — Join worker nodes
      10-calico.tsx           — Calico CNI (or flannel)
      11-metallb.tsx          — MetalLB install + IP pool
      12-nginx-ingress.tsx    — NGINX Ingress Controller (Helm)
      13-local-path.tsx       — local-path-provisioner
      14-verify-cluster.tsx   — Cluster verification
      15-join-masters.tsx     — Join additional masters
      16-verification.tsx     — Final verification tests
      17-storage-class.tsx    — Default StorageClass
      18-troubleshooting.tsx  — Common issues + fixes
    k8s-airgap-vsphere.tsx    — Course module (Cover + sidebarGroups 7 groups)
    k8s-airgap-vsphere/
      sections.ts             — Barrel re-exporting all 20 section files
      00-variables.tsx        — VariablesTable with 38+ vars (govc + versions)
      01-overview.tsx         — Architecture overview
      02-create-vms.tsx       — Create VMs with govc (5 subsections)
      03-verify-network.tsx   — Verify network connectivity
      04-offline-bundle.tsx   — Build offline staging bundle
      05-master1-infra.tsx    — Master1 infra setup
      06-containerd.tsx       — Containerd installation
      07-kubeadm.tsx          — kubeadm/kubelet/kubectl install
      08-kube-vip.tsx         — kube-vip static pod
      09-init-cluster.tsx     — kubeadm init
      10-join-workers.tsx     — Join worker nodes
      11-flannel.tsx          — Flannel CNI
      12-metallb.tsx          — MetalLB install
      13-nginx-ingress.tsx    — NGINX Ingress Controller
      14-local-path.tsx       — local-path-provisioner
      15-verify-cluster.tsx   — Cluster verification
      16-join-masters.tsx     — Join additional masters
      17-verification.tsx     — Final verification tests
      18-storage-class.tsx    — Default StorageClass
      19-troubleshooting.tsx  — Common issues + fixes
    scripts/
      setup-env.sh            — Downloadable env template
  components/
    docs/                     — 17 doc components (see inventory below)
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
| `Var` | `course`, `name` | Inline reactive variable display — shows value or `<NAME>` placeholder. `course` namespaces the variable store. |
| `VariablesTable` | `course`, `columns`, `rows` | Interactive table with editable input fields bound to varStore. `course` namespaces the variable store. |
| `VarReplace` | `course` | Invisible — scans DOM for `[data-var]` elements and reactively updates from varStore. `course` namespaces the variable store. |

### Tables & Lists

| Component | Props | Purpose |
|-----------|-------|---------|
| `InfoTable` | `columns: {header, key}[]`, `rows` | Static HTML table. Cell values support HTML (`<code>`, `<strong>`) via `dangerouslySetInnerHTML` |
| `StepList` | `steps: {title, desc}[]` | Ordered list of titled steps |
| `BenefitGrid` | `cards: {icon, title, body, danger?}[]` | Grid of icon+title+body cards |

### Misc

| Component | Props | Purpose |
|-----------|-------|---------|
| `Collapsible` | `title`, `children`, `defaultOpen?` | `<details>/<summary>` collapsible section |
| `Chip` | `label`, `color: "green" \| "blue" \| "amber" \| "red"` | Small colored inline badge |
| `NodeTag` | `label`, `variant: "all" \| "h1" \| "h2" \| "h3"` | Node hierarchy level tag |

## Variable System

Variables use `<Var name="VARIABLE_NAME" course="COURSE" />` in prose and `<VARIABLE_NAME>` in CodeBlock children.

- **Storage:** `localStorage` key `{course}-vars` (JSON object, namespaced per course)
- **Reactivity:** `VarReplace` component uses `MutationObserver` + store subscription to update all placeholders
- **Editing:** `VariablesTable` renders `<input>` fields bound to varStore
- **CodeBlock behavior:** `<VAR>` patterns are extracted before Shiki highlighting, restored as `<span class="placeholder" data-var="...">` elements
- **Course prop:** All variable components (`Var`, `VariablesTable`, `VarReplace`) accept a `course` prop for namespacing
- **3-case rules:** See `docs/VARIABLE-RULES.md` for the complete specification (Default / Cleared / Custom)

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

Section IDs — OpenShift: `variables`, `prerequisites`, `wsl-setup`, `vsphere`, `nfs-haproxy`, `ocp-vms`, `ignition`, `cluster-install`, `postinstall`, `cleanup`, `troubleshooting`, `tests`.
Section IDs — Linux: `boot-process`, `filesystem`, `navigation`, `links`, `ssh`, `users`, `permissions`, `packages`, `selinux`, `kernel`, `logging`, `firewall-ports`, `networking`, `storage`, `systemd`, `cron`, `performance`, `processes`, `troubleshooting`, `rescue-grub`, `commands`, `nginx-apache`, `http-errors`.

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
- Sidebar section labels use dash format: `"N - Title"` (not dot)
- Code blocks use labeled language tags (`bash`, `yaml`, `ini`, `python`)
- Variable placeholders in code: `<VARIABLE_NAME>` angle-bracket format
- Variable placeholders in prose: `<Var name="VARIABLE_NAME" />` component
- Each section file exports a named function: `export function SectionN()`
- Barrel file `sections.ts` re-exports all sections
- Course composer (`openshift.tsx`, `linux.tsx`) imports sections + Cover + sidebarGroups
- Do NOT add comments to code blocks unless explicitly asked
- Do NOT create new files unless explicitly asked