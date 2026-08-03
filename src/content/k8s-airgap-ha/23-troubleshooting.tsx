import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";

export function Section23() {
  return (
    <Section id="troubleshooting" num={23} title="Troubleshooting">
      <Prose>
        Common issues and fixes for air-gapped deployments.
      </Prose>

      <Subsection title="nerdctl pull fails — image not found">
        <CodeBlock lang="bash" label="check registry container">
{`# Confirm the registry container is running
nerdctl ps | grep registry`}
        </CodeBlock>
      </Subsection>

      <Subsection title="ImagePullBackOff after disabling internet">
        <CodeBlock lang="bash" label="check mirror configuration">
{`# Image not in mirror, or mirror redirect not configured
# Check certs.d on the failing node
cat /etc/containerd/certs.d/registry.k8s.io/hosts.toml
cat /etc/containerd/certs.d/ghcr.io/hosts.toml
cat /etc/containerd/certs.d/docker.io/hosts.toml
cat /etc/containerd/certs.d/quay.io/hosts.toml`}
        </CodeBlock>
      </Subsection>

      <Subsection title="DNS resolves during test but fails after disabling internet">
        <CodeBlock lang="bash" label="check dnsmasq and chrony on master1">
{`# dnsmasq or chrony not running on master1
systemctl status dnsmasq
systemctl status chronyd`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Cluster won't start after air-gap">
        <CodeBlock lang="bash" label="verify containerd mirror on all nodes">
{`# Verify all 6 nodes have containerd mirror configured
cat /etc/containerd/certs.d/registry.k8s.io/hosts.toml`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
