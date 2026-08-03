import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section21() {
  return (
    <Section id="remove-internet" num={21} title="Remove Internet Access">
      <Prose>
        Strip the temporary ICS IPs from all 6 nodes. Once DNS, NTP, and image mirror
        are tested and working, disable the temporary internet.
      </Prose>

      <Subsection title="Strip ICS IPs from All Nodes">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="each node — remove ICS IP">
{`IFACE=<NIC>

nmcli con mod $IFACE -ipv4.addresses <NODE_ICS_IP>/24 ipv4.gateway "" -ipv4.dns <LAPTOP_ICS_IP>
nmcli con up $IFACE

ip a show $IFACE
ip route          # should NOT show a default route`}
        </CodeBlock>

        <Callout variant="danger">
          <strong>Do this on all 6 nodes.</strong> Skipping even one leaves internet
          access on that node.
        </Callout>
      </Subsection>

      <Subsection title="Verify Internet is Gone">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="each node — confirm no internet">
{`# Should FAIL (this is expected)
curl -I https://www.google.com

# Check only internal routes remain
ip route show`}
        </CodeBlock>

        <VerifyBlock label="Verify internet is removed">
          <p><code>curl -I https://www.google.com</code> fails. <code>ip route</code> shows no default route.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
