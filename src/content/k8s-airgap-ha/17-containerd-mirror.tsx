import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section17() {
  return (
    <Section id="containerd-mirror" num={17} title="Configure Containerd Mirror">
      <Prose>
        Configure master1&apos;s containerd to check the local Nexus registry first.
        This uses the <code>certs.d</code> directory structure with{" "}
        <code>hosts.toml</code> per upstream registry. The mirror hostnames resolve via
        the <code>apps.</code><code>*</code> DNS/hosts entries, and the repository path
        after the registry host is preserved automatically. The remaining nodes get the{" "}
        <strong>identical configuration</strong> in Section 18 — before they join.
      </Prose>

      <Subsection title="Configure Mirror for Each Upstream Registry">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — configure containerd certs.d" variant="h1">
{`# registry.k8s.io -> k8s.apps.<DOMAIN>
mkdir -p /etc/containerd/certs.d/registry.k8s.io
cat > /etc/containerd/certs.d/registry.k8s.io/hosts.toml <<'EOF'
server = "https://registry.k8s.io"

[host."http://k8s.apps.<DOMAIN>"]
  capabilities = ["pull", "resolve"]
  skip_verify = true
EOF

# ghcr.io, docker.io, quay.io mirrors
# (quay.io images live in the docker-hosted Nexus repo)
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
done`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Enable certs.d Path in containerd">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — enable config_path in containerd" variant="h1">
{`grep -q 'config_path' /etc/containerd/config.toml || \\
  sed -i '/\\[plugins."io.containerd.grpc.v1.cri".registry\\]/a\\  config_path = "/etc/containerd/certs.d"' /etc/containerd/config.toml

systemctl restart containerd`}
        </CodeBlock>

        <VerifyBlock label="Verify mirror pull on master1">
          <p>
            <code>cat /etc/containerd/certs.d/registry.k8s.io/hosts.toml</code> shows{" "}
            <code>k8s.apps.<Var course="k8s-airgap-ha" name="DOMAIN" /></code> as the
            mirror host. A test pull (<code>nerdctl rmi</code> then{" "}
            <code>nerdctl pull</code> any pushed image) succeeds via Nexus.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
