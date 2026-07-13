import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section2() {
  return (
    <Section id="static-ip" num={2} title="Static IP Configuration">
      <Prose>
        Run on each of the 6 nodes individually. Check your interface name with{" "}
        <code>ip a</code> first — commonly <code>ens192</code>,{" "}
        <code>eth0</code>, or <code>eno1</code>.
      </Prose>

      <Subsection title="Set Static IP — per node">
        <CodeBlock lang="bash" label="ALL nodes">
{`# Find your connection name
nmcli con show

# Set static IP, no gateway, no DNS yet (DNS added in Section 5)
nmcli con mod ens192 ipv4.method manual
nmcli con mod ens192 ipv4.addresses <MASTER_0_IP>/<SUBNET_MASK>   # change per node
nmcli con mod ens192 ipv4.gateway ""                                # no gateway
nmcli con mod ens192 ipv4.dns ""                                    # set in Section 5
nmcli con mod ens192 connection.autoconnect yes

nmcli con up ens192

# Set hostname (unique per node)
hostnamectl set-hostname master1    # master2, master3, worker1, worker2, worker3

# Verify
ip a
hostnamectl`}
        </CodeBlock>

        <VerifyBlock label="Expected result per node">
          <p>
            <code>ip a</code> shows the correct IP on the interface.
          </p>
          <p>
            <code>hostnamectl</code> shows the correct hostname.
          </p>
        </VerifyBlock>
      </Subsection>

      <Callout variant="warn">
        <strong>Repeat on all 6 nodes</strong> with their own IP/hostname from{" "}
        <a href="#overview">Section 1</a>.
      </Callout>
    </Section>
  );
}
