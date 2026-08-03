# Plan: Replace Staging Machine with Capture-After-Install (baremetal)

## Goal
Replace the staging machine / offline bundle workflow with a "capture after install" approach. Install everything via internet (laptop ICS gateway), then backfill local repo + registry before disabling the gateway.

## New Section Flow (baremetal 0-19)

```
0.  Variables (NIC, ICS vars already added)
1.  Overview (laptop-as-gateway already added)
2.  Static IPs with ICS gateway (dual-IP already added)
3.  master1 infra — DNS, NTP, SSH, Docker install (NO bundle/repo/registry)
4.  Point nodes at master1 — DNS, NTP, /etc/hosts, helper scripts (NO local repo)
5.  System prep — swap, modules, sysctl, SELinux
6.  containerd — from internet, basic config (no registry trust yet)
7.  kubeadm + helm — from internet
8.  kube-vip
9.  Init cluster — imageRegistry = registry.k8s.io (internet)
10. Flannel — from internet
11. Join masters — from internet
12. Join workers — from internet
13. MetalLB — from internet
14. NGINX Ingress — from internet
15. Verification
16. Troubleshooting
17. Backup
18. Capture packages & images — backfill local repo + registry
19. Disable laptop gateway
```

## Files to modify (9 files)

### 1. `03-master1-infra.tsx` — REWRITE (was Section 4)
- Remove: "Unpack the Bundle", "Local Yum Repo", "Local Container Registry" subsections
- Keep: DNS (with forwarder), NTP, SSH
- Add: "Install Docker" subsection (needed for registry in Section 18)
- Update section number: 4 → 3

### 2. `04-point-nodes.tsx` — REWRITE (was Section 5)
- Remove: "Local Yum Repo" subsection (no local repo yet)
- Keep: Helper scripts, DNS, NTP, /etc/hosts
- Update section number: 5 → 4

### 3. `06-containerd.tsx` — REWRITE (was Section 7)
- Remove: "Trust the Local Registry" subsection
- Change: dnf install from internet
- Update section number: 7 → 6

### 4. `07-kubeadm.tsx` — REWRITE (was Section 8)
- Remove: local repo references, bundled helm
- Change: Install from internet, helm via curl
- Update section number: 8 → 7

### 5. `09-init-cluster.tsx` — UPDATE (was Section 10)
- Change: imageRegistry = registry.k8s.io (internet)
- Update section number: 10 → 9

### 6. NEW `18-capture-packages.tsx` — NEW SECTION
- Install base packages (createrepo_c, httpd)
- Capture installed RPMs → local repo
- Start local registry (docker)
- Capture container images → local registry
- Configure containerd to trust local registry (hosts.toml on all nodes)

### 7. `19-disable-gateway.tsx` — UPDATE
- Update internal links

### 8. `sections.ts` — UPDATE
- Renumber all exports + add Section18

### 9. `k8s-airgap-baremetal.tsx` — UPDATE
- Update sidebar: remove "Build Offline Bundle", add "Capture Packages & Images"

## Verification
- npx tsc --noEmit --skipLibCheck — no new errors
