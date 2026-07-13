import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section8() {
  return (
    <Section id="containerd" num={8} title="Install containerd">
      <Prose>
        Install from the local repo and configure containerd to trust the local
        registry as insecure (plain HTTP, no TLS). Run on all 6 nodes.
      </Prose>

      <Subsection title="Install and Configure">
        <CodeBlock lang="bash" label="ALL nodes">
{`# Install from local repo
dnf install -y containerd.io containernetworking-plugins

# Copy CNI plugins to the expected path
mkdir -p /opt/cni/bin
cp /usr/libexec/cni/* /opt/cni/bin/

# Generate default config
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml

# Enable systemd cgroup driver
sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Trust the Local Registry">
        <CodeBlock lang="bash" label="ALL nodes">
{`# Create hosts.toml for the local registry
mkdir -p /etc/containerd/certs.d/<MASTER_0_IP>:<REGISTRY_PORT>
cat > /etc/containerd/certs.d/<MASTER_0_IP>:<REGISTRY_PORT>/hosts.toml <<'EOF'
server = "http://<MASTER_0_IP>:<REGISTRY_PORT>"

[host."http://<MASTER_0_IP>:<REGISTRY_PORT>"]
  capabilities = ["pull", "resolve"]
  skip_verify = true
EOF

# Make sure config_path is set so hosts.toml is honored
grep -q 'config_path' /etc/containerd/config.toml || \\
  sed -i '/\\[plugins."io.containerd.grpc.v1.cri".registry\\]/a\\  config_path = "/etc/containerd/certs.d"' /etc/containerd/config.toml

# Start containerd
systemctl enable --now containerd`}
        </CodeBlock>

        <VerifyBlock label="Verify containerd is running">
          <p>
            <code>systemctl status containerd --no-pager</code> shows{" "}
            <strong>active (running)</strong>.
          </p>
        </VerifyBlock>
      </Subsection>

      <Callout variant="warn">
        <strong>Important:</strong> The <code>hosts.toml</code> file must exist
        on every node — it tells containerd to pull images from the local
        registry over plain HTTP without TLS verification.
      </Callout>
    </Section>
  );
}
