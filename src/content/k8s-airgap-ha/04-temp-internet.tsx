import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section4() {
  return (
    <Section id="temp-internet" num={4} title="Temporary Internet (DHCP Uplink)">
      <Prose>
        This gives each node temporary internet to download packages and images.
        Every server has multiple network adapters: the management NIC keeps its
        static cluster IP from <strong>Section 3</strong>, and a{" "}
        <strong>second adapter</strong> is connected to a network with internet
        access. Just plug the UTP cable in — the uplink receives its IP, gateway,
        and DNS automatically via <strong>DHCP</strong>. No configuration needed.
      </Prose>

      <Subsection title="Connect the Uplink and Verify">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="each node — plug in the cable, then verify">
{`nmcli device status           # uplink adapter should show "connected"
ip a                          # uplink has a DHCP-assigned address
ip route                      # default route via the uplink gateway ONLY

ping -c2 8.8.8.8              # test internet
curl -I https://pkgs.k8s.io   # test repos reachable`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>Do not touch the management NIC.</strong> It keeps its static IP
          with no gateway and no DNS — only the uplink provides the default route,
          so the two adapters never conflict. This link is temporary: nodes 2–6
          unplug theirs right after Section 7; master1 keeps its cable until{" "}
          <strong>Section 22</strong>.
        </Callout>

        <Callout variant="info">
          <strong>Only master1 stays online.</strong> Sections 0–7 run on all six
          machines over this uplink (packages get installed everywhere now). From
          Section 9 onward every node except master1 is fully offline — their images
          come from the Nexus registry, not the internet.
        </Callout>

        <VerifyBlock label="Verify internet access">
          <p>
            The uplink adapter shows a DHCP address and the only default route goes
            through it.<br />
            <code>ping -c2 8.8.8.8</code> succeeds on all nodes.<br />
            <code>curl -I https://pkgs.k8s.io</code> returns HTTP 200.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
