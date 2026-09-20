import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section4() {
  return (
    <Section id="ics-temp-internet" num={4} title="Temporary Internet via ICS">
      <Prose>
        This gives each node temporary internet to download packages and images.
        Your laptop&apos;s Wi-Fi shares out its Ethernet port; Windows ICS defaults to{" "}
        <code><Var course="k8s-airgap-ha" name="LAPTOP_ICS_IP" />/24</code>. Each node gets a second IP on the ICS subnet
        while keeping its cluster IP.
      </Prose>

      <Subsection title="Add Temporary ICS IP">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="each node — unique last octet per node">
{`IFACE=<NIC>

# Add SECOND IP (keep the cluster IP — do not remove it)
nmcli con mod $IFACE +ipv4.addresses <NODE_ICS_IP>/24 ipv4.gateway <LAPTOP_ICS_IP> +ipv4.dns <LAPTOP_ICS_IP>

nmcli con up $IFACE

# Verify both IPs exist
ip a show $IFACE
ip route                       # should show default via <LAPTOP_ICS_IP>
ping -c2 8.8.8.8              # test internet
curl -I https://pkgs.k8s.io   # test repos reachable`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>Change the last octet per node.</strong> Use .11 for master1,
          .12 for master2, .13 for master3, .21 for worker1, .22 for worker2,
          .23 for worker3.
        </Callout>

        <VerifyBlock label="Verify internet access">
          <p>
            <code>ping -c2 8.8.8.8</code> succeeds on all nodes.<br />
            <code>curl -I https://pkgs.k8s.io</code> returns HTTP 200.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
