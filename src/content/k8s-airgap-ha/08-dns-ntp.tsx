import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section8() {
  return (
    <Section id="dns-ntp" num={8} title="Local DNS &amp; NTP">
      <Prose>
        Set up <strong>dnsmasq</strong> (DNS) and <strong>chrony</strong> (NTP) on
        master1 <em>before</em> the cluster is initialized. Every other node will point
        its DNS and NTP at master1 — no <code>/etc/hosts</code> entries needed.
      </Prose>

      <Subsection title="Configure dnsmasq">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <Prose>
          The <code>apps.<Var course="k8s-airgap-ha" name="DOMAIN" /></code> record is a
          suffix match, so it answers{" "}
          <code>nexus/docker/ghcr/k8s.apps.<Var course="k8s-airgap-ha" name="DOMAIN" /></code>{" "}
          automatically — no extra entries needed for Nexus.
        </Prose>
        <CodeBlock lang="bash" label="master1 — configure dnsmasq" variant="h1">
{`cat > /etc/dnsmasq.conf <<'EOF'
cat /etc/dnsmasq.conf 
no-resolv 
no-hosts 

listen-address=10.100.20.3,127.0.0.1 

server=8.8.8.8

bind-interfaces 

domain=local 
expand-hosts 

# cluster
address=/master-1/MASTER_0_IP>
address=/master-2/<MASTER_1_IP>
address=/master-3/<MASTER_2_IP>
address=/worker-1/<WORKER_0_IP>
address=/worker-2/<WORKER_1_IP>
address=/worker-3/<WORKER_2_IP>
address=/master-1.<DOMAIN>/10.100.20.3
address=/master-2.<DOMAIN>/<MASTER_1_IP>
address=/master-3.<DOMAIN>/<MASTER_2_IP>
address=/worker-1.<DOMAIN>/<WORKER_0_IP>
address=/worker-2.<DOMAIN>/<WORKER_1_IP>
address=/worker-3.<DOMAIN>/<WORKER_2_IP>

# kube-vip
address=/k8s-api/<VIP>
address=/k8s-api.<DOMAIN>/<VIP>

# metalLB
address=/apps/<INGRESS_IP>
address=/apps.<DOMAIN>/<INGRESS_IP>
EOF

systemctl enable --now dnsmasq`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Configure chrony (NTP server)">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — configure chrony as NTP server" variant="h1">
{`cat >> /etc/chrony.conf <<'EOF'
local stratum 10
allow <MGMT_CIDR>
EOF

systemctl enable --now chronyd`}
        </CodeBlock>

        <VerifyBlock label="Verify DNS and NTP on master1">
          <p>
            DNS: <code>ss -tulnp | grep :53</code> shows dnsmasq listening.<br />
            NTP: <code>chronyc tracking</code> shows stratum 10.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
