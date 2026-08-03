import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section3() {
  return (
    <Section id="static-ip" num={3} title="Static IP Configuration">
      <Prose>
        Configure static IPs on all 6 nodes. Run individually on each physical machine.
        No DHCP — every node gets a permanent static address on the management network.
      </Prose>

      <Subsection title="Configure Static IP on Each Node">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="each node — run individually">
{`ip a                                # confirm interface name on THIS machine
nmcli con show

IFACE=<NIC>                         # e.g., eno1, enp2s0, eth0, ens192

nmcli con mod $IFACE ipv4.method manual ipv4.addresses <MASTER_0_IP>/<SUBNET_MASK> ipv4.gateway "" ipv4.dns "" connection.autoconnect yes

nmcli con up $IFACE

hostnamectl set-hostname master1        # master2, master3, worker1, worker2, worker3

ip a
hostnamectl`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>Replace the IP and hostname</strong> for each node. The hostname
          must match the role.
        </Callout>

        <VerifyBlock label="Verify on each node">
          <p>
            <code>ip a</code> shows the correct static IP.<br />
            <code>hostnamectl</code> shows the correct hostname.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
