import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section3() {
  return (
    <Section id="phase-b-packages" num={3} title="Phase B — Packages and Kernel Tuning">
      <Prose>
        <strong>SSH into each server and run the steps labeled for that node. The nodes already have RHEL 9 and Kubernetes — do not reinstall or modify any Kubernetes component.</strong>
      </Prose>

      {/* ── B1 ── */}
      <Subsection id="b1" title="B1. Install Required Packages">
        <NodeTag label="ALL NODES" variant="all" />
        <Prose>
          These packages provide the iSCSI initiator, multipath device management, LVM, and XFS filesystem
          tools. Run this on all three nodes.
        </Prose>

        <CodeBlock lang="bash" label="all nodes — install storage packages">
{`# iSCSI initiator, multipath, LVM, XFS tools, SCSI utilities
dnf install -y \\
    open-iscsi \\
    device-mapper-multipath \\
    lvm2 \\
    xfsprogs \\
    sg3_utils

# Enable and start the required daemons on boot
systemctl enable --now iscsid
systemctl enable --now multipathd

# Verify both are running
systemctl status iscsid multipathd --no-pager`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p><code>iscsid</code> → active (running)</p>
          <p><code>multipathd</code> → active (running)</p>
        </VerifyBlock>
      </Subsection>

      {/* ── B2 ── */}
      <Subsection id="b2" title="B2. Kernel Tuning">
        <NodeTag label="ALL NODES" variant="all" />
        <Prose>
          These parameters tune the kernel for Kubernetes networking, iSCSI over 10 GbE,
          and database workloads (ClickHouse on spinning HDD). Apply identically on all three nodes.
        </Prose>

        <CodeBlock lang="bash" label="all nodes — /etc/sysctl.d/99-xdr.conf">
{`cat > /etc/sysctl.d/99-xdr.conf <<'EOF'
# ── Kubernetes networking ──────────────────────────────────────
net.ipv4.ip_forward                  = 1
net.bridge.bridge-nf-call-iptables   = 1
net.bridge.bridge-nf-call-ip6tables  = 1
net.ipv4.conf.all.rp_filter          = 2
net.ipv4.conf.default.rp_filter      = 2
net.netfilter.nf_conntrack_max       = 1048576

# ── Database / storage VM settings ────────────────────────────
vm.swappiness                        = 1
vm.dirty_background_ratio            = 5
vm.dirty_ratio                       = 20
vm.vfs_cache_pressure                = 50
vm.overcommit_memory                 = 1

# ── File descriptors ──────────────────────────────────────────
fs.file-max                          = 2097152
fs.inotify.max_user_watches          = 1048576

# ── iSCSI / 10 GbE TCP buffer tuning ─────────────────────────
net.core.rmem_max                    = 33554432
net.core.wmem_max                    = 33554432
net.core.rmem_default                = 262144
net.core.wmem_default                = 262144
net.core.netdev_max_backlog          = 30000
net.ipv4.tcp_rmem                    = 4096 262144 33554432
net.ipv4.tcp_wmem                    = 4096 262144 33554432
net.ipv4.tcp_congestion_control      = bbr
net.ipv4.tcp_mtu_probing             = 1
EOF

# Apply immediately — no reboot needed
sysctl --system`}
        </CodeBlock>

        <CodeBlock lang="bash" label="all nodes — disable swap and Transparent Huge Pages">
{`# Swap must be off for Kubernetes (likely already done during K8s install — verify)
swapoff -a
sed -i '/ swap / s/^/#/' /etc/fstab
swapon --show  # must return nothing

# Transparent Huge Pages off — required by ClickHouse
cat > /etc/systemd/system/disable-thp.service <<'EOF'
[Unit]
Description=Disable Transparent Huge Pages
After=sysinit.target local-fs.target

[Service]
Type=oneshot
ExecStart=/bin/sh -c "echo never > /sys/kernel/mm/transparent_hugepage/enabled && \\
                       echo never > /sys/kernel/mm/transparent_hugepage/defrag"
RemainAfterExit=true

[Install]
WantedBy=multi-user.target
EOF

systemctl enable --now disable-thp.service

# Verify THP is off
cat /sys/kernel/mm/transparent_hugepage/enabled
# Expected output contains: [never]`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
