import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section6() {
  return (
    <Section id="containerd" num={6} title="Install containerd">
      <Prose>
        Containerd is the CRI that Kubernetes uses. We install it from the Docker CE
        repository, along with nerdctl — the containerd CLI that replaces Docker for
        pull/tag/push operations.
      </Prose>

      <Subsection title="Add Docker CE Repository">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="all nodes">
{`curl -fsSL https://download.docker.com/linux/centos/docker-ce.repo \\
  -o /etc/yum.repos.d/docker-ce.repo`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Install containerd and CNI Plugins">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="all nodes">
{`dnf install -y containerd.io containernetworking-plugins

# RHEL packages CNI plugins to /usr/libexec/cni/
# Kubernetes looks for them in /opt/cni/bin/
mkdir -p /opt/cni/bin
cp /usr/libexec/cni/* /opt/cni/bin/`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Configure containerd">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="all nodes">
{`mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml

# Enable SystemdCgroup — CRITICAL
sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml

grep 'SystemdCgroup' /etc/containerd/config.toml`}
        </CodeBlock>

        <Callout variant="danger">
          <strong>SystemdCgroup must be true.</strong> If false, kubelet will fail to
          start containers.
        </Callout>
      </Subsection>

      <Subsection title="Install nerdctl">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="all nodes">
{`NERDCTL_VERSION=$(curl -s https://api.github.com/repos/containerd/nerdctl/releases/latest \\
  | grep '"tag_name"' | cut -d'"' -f4)

cd /tmp
wget https://github.com/containerd/nerdctl/releases/download/\${NERDCTL_VERSION}/nerdctl-\${NERDCTL_VERSION}-linux-amd64.tar.gz
tar xzf nerdctl-\${NERDCTL_VERSION}-linux-amd64.tar.gz -C /usr/local/bin/

nerdctl version`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Start containerd">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="all nodes">
{`systemctl enable --now containerd
systemctl status containerd --no-pager`}
        </CodeBlock>

        <VerifyBlock label="Verify containerd is running">
          <p><code>systemctl status containerd</code> shows <strong>active (running)</strong>.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
