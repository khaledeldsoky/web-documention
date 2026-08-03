import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section19() {
  return (
    <Section id="point-nodes-master1" num={19} title="Point Nodes at master1">
      <Prose>
        Configure all non-master1 nodes to use master1 for DNS and NTP. Add /etc/hosts
        entries on every node for hostname resolution.
      </Prose>

      <Subsection title="Point DNS at master1">
        <NodeTag label="ALL NON-MASTER1 NODES" variant="h2" />
        <CodeBlock lang="bash" label="each non-master1 node — set DNS to master1">
{`IFACE=<NIC>

nmcli con mod $IFACE ipv4.dns "<MASTER_0_IP>" ipv4.dns-search "<DOMAIN>"
nmcli con up $IFACE

cat /etc/resolv.conf`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Point NTP at master1">
        <NodeTag label="ALL NON-MASTER1 NODES" variant="h2" />
        <CodeBlock lang="bash" label="each non-master1 node — set NTP to master1">
{`sed -i '/^pool\\|^server/d' /etc/chrony.conf
echo "server <MASTER_0_IP> iburst" >> /etc/chrony.conf
systemctl enable --now chronyd
chronyc sources`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Add /etc/hosts Entries">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="each node — add /etc/hosts entries">
{`cat >> /etc/hosts <<'EOF'
<MASTER_0_IP>  master1 master1.<DOMAIN>
<MASTER_1_IP>  master2 master2.<DOMAIN>
<MASTER_2_IP>  master3 master3.<DOMAIN>
<WORKER_0_IP>  worker1 worker1.<DOMAIN>
<WORKER_1_IP>  worker2 worker2.<DOMAIN>
<WORKER_2_IP>  worker3 worker3.<DOMAIN>
<VIP>  k8s-api.<DOMAIN>
EOF`}
        </CodeBlock>

        <VerifyBlock label="Verify DNS and NTP resolution">
          <p>
            <code>nslookup master1.<Var course="k8s-airgap-ha" name="DOMAIN" /></code> resolves to <code><Var course="k8s-airgap-ha" name="MASTER_0_IP" /></code>.<br />
            <code>nslookup k8s-api.<Var course="k8s-airgap-ha" name="DOMAIN" /></code> resolves to <code><Var course="k8s-airgap-ha" name="VIP" /></code>.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
