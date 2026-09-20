import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section15() {
  return (
    <Section id="cluster-health" num={15} title="Cluster Health Check">
      <Prose>
        Verify the entire cluster is healthy while internet is still available. This is
        your baseline before air-gap hardening.
      </Prose>

      <Subsection title="Full Health Check">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — cluster health check" variant="h1">
{`kubectl get nodes -o wide                           # all 6 Ready
kubectl get pods -A                                 # no CrashLoopBackOff
curl -I http://<INGRESS_IP>                         # NGINX responds
kubectl get ipaddresspool,l2advertisement -n metallb-system   # MetalLB pool exists`}
        </CodeBlock>

        <VerifyBlock label="Verify cluster is fully healthy">
          <p>
            All 6 nodes Ready. No CrashLoopBackOff. NGINX responds with 404. MetalLB
            pool exists.
          </p>
        </VerifyBlock>

        <Callout variant="danger">
          <strong>Do not proceed until all checks pass.</strong> Fix issues now while
          internet is available.
        </Callout>
      </Subsection>
    </Section>
  );
}
