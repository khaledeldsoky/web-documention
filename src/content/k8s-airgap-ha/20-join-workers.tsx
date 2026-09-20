import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section12() {
  return (
    <Section id="join-workers" num={12} title="Join Workers">
      <Prose>
        Join all worker nodes using the worker join command from{" "}
        <code>kubeadm init</code> output. No <code>--control-plane</code> flag.
      </Prose>

      <Subsection title="Join Each Worker">
        <NodeTag label="ALL WORKERS" variant="all" />
        <CodeBlock lang="bash" label="each worker — run the worker join command">
{`kubeadm join <VIP>:6443 \\
  --token <TOKEN> \\
  --discovery-token-ca-cert-hash sha256:<HASH>`}
        </CodeBlock>

        <Callout variant="info">
          <strong>If tokens are expired</strong> (24h), regenerate from master1:{" "}
          <code>kubeadm token create --print-join-command</code>
        </Callout>
      </Subsection>

      <Subsection title="Verify All Nodes">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — verify all 6 nodes are Ready" variant="h1">
{`kubectl get nodes -o wide`}
        </CodeBlock>

        <VerifyBlock label="Verify all nodes joined">
          <p>All 6 nodes (3 masters + 3 workers) in <strong>Ready</strong> state.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
