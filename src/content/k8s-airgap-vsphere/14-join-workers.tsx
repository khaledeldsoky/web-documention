import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section14() {
  return (
    <Section id="join-workers" num={14} title="Join Workers">
      <Prose>
        Run the join command on each worker node. Workers do NOT use the{" "}
        <code>--control-plane</code> flag.
      </Prose>

      <Subsection title="Join Each Worker">
        <CodeBlock lang="bash" label="worker1, worker2, worker3 (each)">
{`# Run the worker join command from Section 10's output
# (no --control-plane, no --certificate-key)
kubeadm join <VIP>:6443 \\
  --token <TOKEN> \\
  --discovery-token-ca-cert-hash sha256:<HASH>`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Verify All Nodes">
        <CodeBlock lang="bash" label="master1">
{`kubectl get nodes -o wide`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p>All 6 nodes (3 masters + 3 workers) show <strong>Ready</strong>.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
