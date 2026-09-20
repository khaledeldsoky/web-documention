import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section22() {
  return (
    <Section id="remove-internet" num={22} title="Remove Internet Access">
      <Prose>
        Unplug <strong>master1&apos;s</strong> temporary DHCP uplink. The other five
        nodes disconnected theirs right after Section 7 and have been fully offline
        ever since. Once DNS, NTP, and the image mirror are tested and working,
        master1 goes offline too. The management NIC keeps its static IP and its DNS
        pointing at master1 — nothing else changes.
      </Prose>

      <Subsection title="Unplug the Uplink on master1">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — unplug the cable, then verify" variant="h1">
{`# Physically unplug the uplink cable — or disconnect it in software:
nmcli device disconnect <UPLINK_NIC>

ip a             # uplink adapter has no address anymore
ip route         # NO default route — only the cluster subnet`}
        </CodeBlock>

        <Callout variant="danger">
          <strong>Pull the actual cable</strong>, not just the software disconnect —
          this is the cluster&apos;s last remaining internet path.
        </Callout>
      </Subsection>

      <Subsection title="Verify Internet is Gone">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — confirm no internet" variant="h1">
{`# Should FAIL (this is expected)
curl -I https://www.google.com

# Check only internal routes remain
ip route show`}
        </CodeBlock>

        <Callout variant="info">
          Node DNS still points at master1 (set in <strong>Section 18</strong>) —
          internal name resolution keeps working without internet.
        </Callout>

        <VerifyBlock label="Verify internet is removed">
          <p><code>curl -I https://www.google.com</code> fails. <code>ip route</code> shows no default route.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
