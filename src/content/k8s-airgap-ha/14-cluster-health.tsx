import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section14() {
  return (
    <Section id="cluster-health" num={14} title="Cluster Health Check">
      <Prose>
        Verify the bootstrap node is fully healthy while internet is available. This is
        your single-node baseline before air-gap hardening — the cluster grows to 6
        nodes in Sections 18–19, once everything works on master1.
      </Prose>

      <Subsection title="Full Health Check">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — cluster health check" variant="h1">
{`kubectl get nodes -o wide                           # master1 Ready
kubectl get pods -A                                 # no CrashLoopBackOff
curl -I http://<INGRESS_IP>                         # NGINX responds
kubectl get ipaddresspool,l2advertisement -n metallb-system   # MetalLB pool exists`}
        </CodeBlock>

        <VerifyBlock label="Verify cluster is fully healthy">
          <p>
            master1 Ready. All pods (control plane, flannel, kube-vip, MetalLB,
            ingress-nginx) Running. NGINX responds with 404. MetalLB pool exists.
          </p>
        </VerifyBlock>

        <Callout variant="danger">
          <strong>Do not proceed until all checks pass.</strong> Everything the other
          nodes depend on (Nexus, DNS, NTP, mirrors) runs on master1 — fix issues now
          while internet is available.
        </Callout>
      </Subsection>
    </Section>
  );
}
