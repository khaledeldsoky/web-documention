import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section18() {
  return (
    <Section id="prepare-nodes" num={18} title="Prepare Remaining Nodes">
      <Prose>
        The other five nodes have been offline since Section 7 — they will get
        everything from master1. Before joining, each one needs: DNS and NTP pointing
        at master1, and the same containerd mirror configuration as master1. DNS
        resolves all hostnames — no <code>/etc/hosts</code> entries needed. When they
        join in Sections 19–20, their kubelets pull every image through the Nexus
        mirror.
      </Prose>

      <Callout variant="warn">
        <strong>Order matters.</strong> This section must be completed on a node{" "}
        <em>before</em> it runs <code>kubeadm join</code> — the first image pulls
        happen seconds after join.
      </Callout>

      <Subsection title="Point DNS at master1">
        <NodeTag label="EACH REMAINING NODE" variant="h2" />
        <CodeBlock lang="bash" label="each remaining node — set DNS to master1" variant="h2">
{`IFACE=<NIC>

nmcli con mod $IFACE ipv4.dns "<MASTER_0_IP>" ipv4.dns-search "<DOMAIN>"
nmcli con up $IFACE

cat /etc/resolv.conf`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Point NTP at master1">
        <NodeTag label="EACH REMAINING NODE" variant="h2" />
        <CodeBlock lang="bash" label="each remaining node — set NTP to master1" variant="h2">
{`sed -i '/^pool\\|^server/d' /etc/chrony.conf
echo "server <MASTER_0_IP> iburst" >> /etc/chrony.conf
systemctl enable --now chronyd
chronyc sources`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Configure Containerd Mirrors">
        <NodeTag label="EACH REMAINING NODE" variant="h2" />
        <CodeBlock lang="bash" label="each remaining node — configure containerd certs.d (same as Section 17)" variant="h2">
{`# registry.k8s.io -> k8s.apps.<DOMAIN>
mkdir -p /etc/containerd/certs.d/registry.k8s.io
cat > /etc/containerd/certs.d/registry.k8s.io/hosts.toml <<'EOF'
server = "https://registry.k8s.io"

[host."http://k8s.apps.<DOMAIN>"]
  capabilities = ["pull", "resolve"]
  skip_verify = true
EOF

# ghcr.io, docker.io, quay.io mirrors
for MAP in ghcr.io:ghcr.apps.<DOMAIN> docker.io:docker.apps.<DOMAIN> quay.io:docker.apps.<DOMAIN>; do
  UPSTREAM=\${MAP%%:*}
  MIRROR=\${MAP##*:}
  mkdir -p /etc/containerd/certs.d/\$UPSTREAM
  cat > /etc/containerd/certs.d/\$UPSTREAM/hosts.toml <<EOF
server = "https://\$UPSTREAM"

[host."http://\$MIRROR"]
  capabilities = ["pull", "resolve"]
  skip_verify = true
EOF
done

grep -q 'config_path' /etc/containerd/config.toml || \\
  sed -i '/\\[plugins."io.containerd.grpc.v1.cri".registry\\]/a\\  config_path = "/etc/containerd/certs.d"' /etc/containerd/config.toml

systemctl restart containerd`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Test Mirror Pull Before Joining">
        <NodeTag label="EACH REMAINING NODE" variant="h2" />
        <Prose>
          Prove the pipe works now — after a failed join you would be chasing several
          causes at once. Pull an image that only exists on Nexus:
        </Prose>
        <CodeBlock lang="bash" label="each remaining node — pull via mirror before join" variant="h2">
{`nerdctl rmi registry.k8s.io/pause:<PAUSE_VERSION>
nerdctl pull registry.k8s.io/pause:<PAUSE_VERSION>    # must come from Nexus`}
        </CodeBlock>
      </Subsection>

      <VerifyBlock label="Verify all nodes are ready to join">
        <p>
          <code>nslookup master1.<Var course="k8s-airgap-ha" name="DOMAIN" /></code>{" "}
          resolves to <code><Var course="k8s-airgap-ha" name="MASTER_0_IP" /></code>.<br />
          <code>nslookup k8s-api.<Var course="k8s-airgap-ha" name="DOMAIN" /></code>{" "}
          resolves to <code><Var course="k8s-airgap-ha" name="VIP" /></code>.<br />
          <code>chronyc sources</code> shows master1 with <code>^*</code>.<br />
          The pause test pull succeeds on every remaining node.
        </p>
      </VerifyBlock>
    </Section>
  );
}
