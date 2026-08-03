import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section17() {
  return (
    <Section id="master1-infra" num={17} title="master1 Infra Node">
      <Prose>
        Set up master1 as the infrastructure node: local container registry, local yum
        repo, DNS (dnsmasq), and NTP (chrony). All other nodes will point at master1
        for these services.
      </Prose>

      <Subsection title="17.1 Local Container Registry">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — run registry via nerdctl" variant="h1">
{`source /tmp/image-versions.txt

mkdir -p /srv/registry-data

nerdctl run -d --name registry --restart=always -p 5000:5000 \\
  -v /srv/registry-data:/var/lib/registry \\
  registry:\${REGISTRY_VERSION}`}
        </CodeBlock>
      </Subsection>

      <Subsection title="17.2 Push All Images to Local Registry">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — re-tag and push all images" variant="h1">
{`nerdctl images --format '{{.Repository}}:{{.Tag}}' | while read img; do
  if [ ! -z "$img" ] && [ "$img" != "<none>:<none>" ]; then
    newimg="<MASTER_0_IP>:<REGISTRY_PORT>/\${img##*/}"
    echo "Tagging $img -> $newimg"
    nerdctl tag "$img" "$newimg"
    echo "Pushing $newimg to registry..."
    nerdctl push --insecure-registry "$newimg"
  fi
done

# Verify registry has images
curl http://<MASTER_0_IP>:<REGISTRY_PORT>/v2/_catalog`}
        </CodeBlock>
      </Subsection>

      <Subsection title="17.3 Local Yum Repo">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — set up local yum repo via httpd" variant="h1">
{`mkdir -p /srv/repo

# Copy cached RPMs
find /var/cache/dnf -name '*.rpm' -exec cp {} /srv/repo/ \\;

createrepo_c /srv/repo

systemctl enable --now httpd
ln -s /srv/repo /var/www/html/repo

# Verify
curl http://<MASTER_0_IP>/repo/repodata/repomd.xml`}
        </CodeBlock>
      </Subsection>

      <Subsection title="17.4 Local DNS (dnsmasq)">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — configure dnsmasq" variant="h1">
{`cat > /etc/dnsmasq.conf <<'EOF'
no-resolv
no-hosts
listen-address=<MASTER_0_IP>
bind-interfaces

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

      <Subsection title="17.5 Local NTP (chrony server)">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — configure chrony as NTP server" variant="h1">
{`cat >> /etc/chrony.conf <<'EOF'
local stratum 10
allow <MGMT_CIDR>
EOF

systemctl enable --now chronyd`}
        </CodeBlock>

        <VerifyBlock label="Verify master1 infra services">
          <p>
            Registry: <code>curl http://<Var course="k8s-airgap-ha" name="MASTER_0_IP" />:<Var course="k8s-airgap-ha" name="REGISTRY_PORT" />/v2/_catalog</code> returns
            JSON.<br />
            DNS: <code>ss -tulnp | grep :53</code> shows dnsmasq listening.<br />
            NTP: <code>chronyc tracking</code> shows stratum 10.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
