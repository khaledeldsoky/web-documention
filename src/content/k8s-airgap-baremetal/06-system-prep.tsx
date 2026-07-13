import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";

export function Section6() {
  return (
    <Section id="system-prep" num={6} title="System Prep — All Nodes">
      <Prose>
        Identical to a normal install — none of this needs internet. Run on all
        6 nodes.
      </Prose>

      <Subsection title="Disable Swap">
        <CodeBlock lang="bash" label="ALL nodes">
{`swapoff -a
sed -i 's|\\([^#].*\\s+swap\\s.*\\)$|# \\1|' /etc/fstab`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Kernel Modules">
        <CodeBlock lang="bash" label="ALL nodes">
{`cat > /etc/modules-load.d/k8s.conf <<'EOF'
overlay
br_netfilter
EOF

modprobe overlay
modprobe br_netfilter`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Sysctl Settings">
        <CodeBlock lang="bash" label="ALL nodes">
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
      </Subsection>

      <Subsection title="SELinux and Firewall">
        <CodeBlock lang="bash" label="ALL nodes">
{`setenforce 0
sed -i 's/^SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config

systemctl disable --now firewalld`}
        </CodeBlock>

        <Callout variant="info">
          SELinux is set to <strong>permissive</strong> (not disabled) so it
          logs denials without blocking. In production, set to{" "}
          <code>enforcing</code> once policies are correct.
        </Callout>
      </Subsection>
    </Section>
  );
}
