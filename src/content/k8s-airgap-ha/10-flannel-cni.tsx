import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section10() {
  return (
    <Section id="flannel-cni" num={10} title="Install Flannel CNI">
      <Prose>
        Flannel creates a flat overlay network using VXLAN tunnels between nodes. All
        pod traffic is encapsulated and routed through these tunnels.
      </Prose>

      <Subsection title="Download Flannel Manifest">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — download flannel manifest" variant="h1">
{`curl -fsSL https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml \\
  -o /root/kube-flannel.yml`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Apply Flannel">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — apply flannel" variant="h1">
{`kubectl apply -f /root/kube-flannel.yml`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Wait for Flannel to be Ready">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — wait for flannel pods" variant="h1">
{`kubectl get pods -n kube-flannel -w`}
        </CodeBlock>

        <VerifyBlock label="Verify flannel is running">
          <p>
            All flannel pods show <strong>Running</strong>.<br />
            <code>kubectl get nodes</code> now shows master1 in <strong>Ready</strong>{" "}
            state.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
