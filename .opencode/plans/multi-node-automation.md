# Plan: Automate Multi-Node Execution

## Problem
14-15 CodeBlocks per course labeled "ALL nodes" require manual SSH into each of 5-6 VMs.

## Solution
Option A — Bash helper scripts on master1 (zero extra RPM dependencies).

## Implementation Details

### Course files to modify (both courses):

**Section 04** — Add SSH key setup subsection at the end:
```
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
ssh-copy-id root@<MASTER_1_IP>
ssh-copy-id root@<MASTER_2_IP>
ssh-copy-id root@<WORKER_0_IP>
ssh-copy-id root@<WORKER_1_IP>
ssh-copy-id root@<WORKER_2_IP>
```

**Section 05** — Add helper scripts at the start, rewrite all 3 "ALL nodes except master1" blocks + /etc/hosts block to use `run-all`

**Section 06** — Rewrite all 4 "ALL nodes" blocks to use `run-all`

**Section 07** — Rewrite containerd install blocks

**Section 08** — Rewrite kubeadm blocks

**Section 12/13** (join-masters) — Use `run-all` for kube-vip scp

**Section 13/14** (join-workers) — Use `run-all` for join commands

### Idempotency fixes:
- /etc/hosts: `cat >` instead of `cat >>`
- chrony: `grep -q` guard before append
- .bashrc: `grep -q` guard

### ARCHITECTURE.md updates:
- Add `run-all` script convention under Code & Verification section
- Document the SSH key setup as prerequisite for multi-node blocks
