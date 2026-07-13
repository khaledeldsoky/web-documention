import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section4() {
  return (
    <Section id="master1-infra" num={4} title="Set Up master1 as Infra Node">
      <Prose>
        master1 runs DNS, NTP, local yum repo, and local container registry for
        the entire air-gapped cluster.
      </Prose>

      <Subsection title="Unpack the Bundle">
        <CodeBlock lang="bash" label="master1">
{`cd /root
tar xzf airgap-bundle.tar.gz
cd airgap-bundle

# Install bootstrap tools from bundled RPMs
rpm -ivh --nodeps rpms/chrony*.rpm rpms/dnsmasq*.rpm rpms/createrepo_c*.rpm 2>/dev/null || \\
  dnf install -y --disablerepo="*" rpms/*.rpm`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Local Yum Repo">
        <CodeBlock lang="bash" label="master1">
{`# Create repo directory and copy RPMs
mkdir -p /srv/repo
cp rpms/*.rpm /srv/repo/
createrepo_c /srv/repo

# Install and start httpd to serve the repo
dnf install -y httpd
systemctl enable --now httpd
ln -s /srv/repo /var/www/html/repo

# Create the repo file (all nodes will use this)
cat > /root/airgap-bundle/local-airgap.repo <<'EOF'
[airgap-local]
name=Airgap Local Repo
baseurl=http://<MASTER_0_IP>/repo
enabled=1
gpgcheck=0
EOF`}
        </CodeBlock>

        <VerifyBlock label="Verify repo is accessible">
          <p>
            <code>curl http://&lt;MASTER_0_IP&gt;/repo/repodata/repomd.xml</code>{" "}
            returns XML content.
          </p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Local Container Registry">
        <CodeBlock lang="bash" label="master1">
{`# Load the registry:2 image
docker load -i images/registry_2.tar

# Start the local registry
docker run -d --name registry --restart=always -p <REGISTRY_PORT>:<REGISTRY_PORT> \\
  -v /srv/registry-data:/var/lib/registry \\
  registry:2

# Load and push every staged image into the local registry
for tarfile in images/*.tar; do
  [ "$tarfile" = "images/registry_2.tar" ] && continue
  docker load -i "$tarfile"
done

docker images --format '{{.Repository}}:{{.Tag}}' | while read img; do
  newimg="<MASTER_0_IP>:<REGISTRY_PORT>/\${img#*/}"
  docker tag "$img" "$newimg"
  docker push "$newimg"
done`}
        </CodeBlock>

        <Callout variant="info">
          <strong>containerd</strong> (used by kubelet, not docker) needs to
          trust this registry as <strong>insecure/plain HTTP</strong> since
          there&apos;s no TLS cert for it. That&apos;s configured in{" "}
          <a href="#containerd">Section 7</a> on every node.
        </Callout>
      </Subsection>

      <Subsection title="Local DNS (dnsmasq)">
        <CodeBlock lang="bash" label="master1">
{`cat > /etc/dnsmasq.conf <<'EOF'
no-resolv
no-hosts
listen-address=<MASTER_0_IP>
bind-interfaces

# Static records for the whole air-gapped cluster
address=/master1.<DOMAIN>/<MASTER_0_IP>
address=/master2.<DOMAIN>/<MASTER_1_IP>
address=/master3.<DOMAIN>/<MASTER_2_IP>
address=/worker1.<DOMAIN>/<WORKER_0_IP>
address=/worker2.<DOMAIN>/<WORKER_1_IP>
address=/worker3.<DOMAIN>/<WORKER_2_IP>
address=/k8s-api.<DOMAIN>/<VIP>
address=/registry.<DOMAIN>/<MASTER_0_IP>
address=/*.apps.<DOMAIN>/<INGRESS_IP>
EOF

systemctl enable --now dnsmasq`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Local NTP (chrony server)">
        <CodeBlock lang="bash" label="master1">
{`cat >> /etc/chrony.conf <<'EOF'
# Act as a time server for the whole air-gapped subnet
local stratum 10
allow 10.10.10.0/24
EOF

systemctl enable --now chronyd`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
