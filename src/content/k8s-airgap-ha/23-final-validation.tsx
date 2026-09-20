import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section23() {
  return (
    <Section id="final-validation" num={23} title="Final Air-Gap Validation">
      <Prose>
        Validate everything works without internet: DNS, NTP, image pull via mirror,
        and cluster health.
      </Prose>

      <Subsection title="Test DNS (no internet)">
        <NodeTag label="ALL NON-MASTER1 NODES" variant="h2" />
        <CodeBlock lang="bash" label="each non-master1 node — test DNS without internet" variant="h2">
{`nslookup master1.<DOMAIN>          # should resolve immediately
nslookup k8s-api.<DOMAIN>          # should resolve to VIP`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Test NTP (no internet)">
        <NodeTag label="ALL NON-MASTER1 NODES" variant="h2" />
        <CodeBlock lang="bash" label="each non-master1 node — test NTP without internet" variant="h2">
{`chronyc tracking                  # "System clock synchronized: yes"
timedatectl status                # confirm sync`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Test Image Pull via Mirror (no internet)">
        <NodeTag label="ALL NON-MASTER1 NODES" variant="h2" />
        <CodeBlock lang="bash" label="each non-master1 node — pull image via mirror without internet" variant="h2">
{`nerdctl rmi registry.k8s.io/coredns/coredns:<COREDNS_VERSION>   # clear cache
nerdctl pull registry.k8s.io/coredns/coredns:<COREDNS_VERSION>  # should succeed via mirror`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Cluster Health">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — final cluster health" variant="h1">
{`kubectl get nodes -o wide              # all 6 Ready
kubectl get pods -A                    # all Running
kubectl -n nexus get pods              # Nexus Running
curl -I http://<INGRESS_IP>             # NGINX responds`}
        </CodeBlock>

        <VerifyBlock label="Final validation complete">
          <p>
            DNS resolves. NTP syncs. Image pull via mirror works. All 6 nodes Ready.
            All pods Running. NGINX responds.
          </p>
        </VerifyBlock>

        <Callout variant="success">
          <strong>Your air-gapped Kubernetes HA cluster is ready.</strong> All services
          operational without external internet access.
        </Callout>
      </Subsection>
    </Section>
  );
}
