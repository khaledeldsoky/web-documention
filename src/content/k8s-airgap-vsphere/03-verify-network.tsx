import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section3() {
  return (
    <Section id="verify-network" num={3} title="Verify Network & Hostnames">
      <Prose>
        Static IPs were injected via kernel args during VM creation. Verify
        each node has the correct IP, hostname, and can reach its peers.
      </Prose>

      <Subsection title="Verify IP and hostname on each node">
        <CodeBlock lang="bash" label="Each node">
{`# Confirm IP address
ip a show ens192

# Confirm hostname
hostnamectl

# Test connectivity to all other nodes
ping -c1 <MASTER_0_IP>
ping -c1 <MASTER_1_IP>
ping -c1 <MASTER_2_IP>
ping -c1 <WORKER_0_IP>
ping -c1 <WORKER_1_IP>
ping -c1 <WORKER_2_IP>`}
        </CodeBlock>

        <VerifyBlock label="Expected result">
          <p>
            <code>ip a</code> shows the correct IP on the interface.
          </p>
          <p>
            All <code>ping</code> commands succeed — all 6 nodes are reachable
            from each other.
          </p>
        </VerifyBlock>
      </Subsection>

      <Callout variant="warn">
        <strong>If nodes can&apos;t ping each other</strong>, check the
        vSphere port group. All 6 VMs must be on the <strong>same
        network/port group</strong>.
      </Callout>
    </Section>
  );
}
