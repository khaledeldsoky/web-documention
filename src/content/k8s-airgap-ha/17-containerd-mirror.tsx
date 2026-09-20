import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section18() {
  return (
    <Section id="containerd-mirror" num={18} title="Configure Containerd Mirror">
      <Prose>
        Configure every node&apos;s containerd to check the local registry mirror first.
        This uses the <code>certs.d</code> directory structure with{" "}
        <code>hosts.toml</code> per upstream registry.
      </Prose>

      <Subsection title="Configure Mirror for Each Upstream Registry">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="each node — configure containerd certs.d">
{`# registry.k8s.io mirror
mkdir -p /etc/containerd/certs.d/registry.k8s.io
cat > /etc/containerd/certs.d/registry.k8s.io/hosts.toml <<'EOF'
server = "https://registry.k8s.io"

[host."http://<MASTER_0_IP>:<REGISTRY_PORT>"]
  capabilities = ["pull", "resolve"]
  skip_verify = true
EOF

# ghcr.io, docker.io, quay.io mirrors
for HOST in ghcr.io docker.io quay.io; do
  mkdir -p /etc/containerd/certs.d/$HOST
  cat > /etc/containerd/certs.d/$HOST/hosts.toml <<EOF
server = "https://$HOST"

[host."http://<MASTER_0_IP>:<REGISTRY_PORT>"]
  capabilities = ["pull", "resolve"]
  skip_verify = true
EOF
done`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Enable certs.d Path in containerd">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="each node — enable config_path in containerd">
{`grep -q 'config_path' /etc/containerd/config.toml || \\
  sed -i '/\\[plugins."io.containerd.grpc.v1.cri".registry\\]/a\\  config_path = "/etc/containerd/certs.d"' /etc/containerd/config.toml

systemctl restart containerd`}
        </CodeBlock>

        <VerifyBlock label="Verify mirror configuration">
          <p>
            <code>cat /etc/containerd/certs.d/registry.k8s.io/hosts.toml</code> shows the
            local registry as host.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
