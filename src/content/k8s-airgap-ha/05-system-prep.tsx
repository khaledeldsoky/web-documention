import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section5() {
  return (
    <Section id="system-prep" num={5} title="System Preparation">
      <Prose>
        Prepare all 6 nodes for Kubernetes while internet is still up.
      </Prose>

      <Subsection title="Disable Swap">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="all nodes">
{`swapoff -a
sed -i 's|^\\([^#].*\\s\\+swap\\s\\+.*\\)$|# \\1|' /etc/fstab

# Verify swap is off (output should be blank)
swapon --show`}
        </CodeBlock>

        <VerifyBlock label="Verify swap is disabled">
          <p><code>swapon --show</code> returns empty output.</p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Load Kernel Modules">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="all nodes">
{`cat > /etc/modules-load.d/k8s.conf <<'EOF'
overlay
br_netfilter
EOF

modprobe overlay
modprobe br_netfilter`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Kernel Network Parameters">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="all nodes">
{`cat > /etc/sysctl.d/k8s.conf <<'EOF'
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-iptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.conf.all.rp_filter = 2
net.ipv4.conf.default.rp_filter = 2
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
EOF

sysctl --system`}
        </CodeBlock>

        <VerifyBlock label="Verify kernel parameters">
          <p>
            <code>sysctl net.ipv4.ip_forward</code> returns <code>1</code>.
          </p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="SELinux to Permissive">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="all nodes">
{`setenforce 0
sed -i 's/^SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Disable Firewalld">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="all nodes">
{`systemctl disable --now firewalld`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
