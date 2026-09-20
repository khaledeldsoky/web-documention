import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section20() {
  return (
    <Section id="test-services" num={20} title="Test DNS/NTP/Registry Mirror">
      <Prose>
        While internet is still up, test that DNS, NTP, and the image mirror all work
        correctly. This validates your air-gap infrastructure before removing internet.
      </Prose>

      <Subsection title="Test DNS">
        <NodeTag label="ALL NON-MASTER1 NODES" variant="h2" />
        <CodeBlock lang="bash" label="each non-master1 node — test DNS resolution" variant="h2">
{`nslookup master1.<DOMAIN>          # should resolve to <MASTER_0_IP>
nslookup k8s-api.<DOMAIN>          # should resolve to <VIP>
dig +short registry.<DOMAIN> @<MASTER_0_IP>

# On master1, confirm dnsmasq is serving
systemctl status dnsmasq --no-pager
ss -tulnp | grep :53`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Test NTP">
        <NodeTag label="ALL NON-MASTER1 NODES" variant="h2" />
        <CodeBlock lang="bash" label="each non-master1 node — test NTP sync" variant="h2">
{`# On master1
chronyc tracking            # should show stratum 10

# On any other node
chronyc sources -v          # should show <MASTER_0_IP> with "^*"
chronyc tracking            # Reference ID should be master1's IP
timedatectl status          # "System clock synchronized: yes"`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Test Image Mirror">
        <NodeTag label="ALL NON-MASTER1 NODES" variant="h2" />
        <CodeBlock lang="bash" label="each non-master1 node — test image pull via mirror" variant="h2">
{`# Force remove local cache and re-pull via mirror
nerdctl rmi registry.k8s.io/pause:\${PAUSE_VERSION}
nerdctl pull registry.k8s.io/pause:\${PAUSE_VERSION}    # should succeed via mirror`}
        </CodeBlock>

        <VerifyBlock label="Verify all services work">
          <p>
            DNS resolves all cluster hostnames. NTP syncs to master1. Image pull via
            mirror succeeds.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
