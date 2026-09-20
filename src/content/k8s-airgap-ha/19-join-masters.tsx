import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section11() {
  return (
    <Section id="join-masters" num={11} title="Join Masters 2 &amp; 3">
      <Prose>
        Before running the join command, you must place the kube-vip manifest on each
        master. Then run the control-plane join command from kubeadm init output.
      </Prose>

      <Subsection title="Copy kube-vip Manifest">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — copy manifest to masters 2 & 3" variant="h1">
{`scp /etc/kubernetes/manifests/kube-vip.yaml root@<MASTER_1_IP>:/etc/kubernetes/manifests/
scp /etc/kubernetes/manifests/kube-vip.yaml root@<MASTER_2_IP>:/etc/kubernetes/manifests/`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Join master2">
        <NodeTag label="MASTER 2 ONLY" variant="h2" />
        <CodeBlock lang="bash" label="master2 — run the control-plane join command" variant="h2">
{`kubeadm join <VIP>:6443 \\
  --token <TOKEN> \\
  --discovery-token-ca-cert-hash sha256:<HASH> \\
  --control-plane \\
  --certificate-key <CERT_KEY>

mkdir -p /root/.kube
cp /etc/kubernetes/admin.conf /root/.kube/config
chmod 600 /root/.kube/config`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Join master3">
        <NodeTag label="MASTER 3 ONLY" variant="h3" />
        <CodeBlock lang="bash" label="master3 — run the same join command" variant="h3">
{`# Repeat the same steps on master3
kubeadm join <VIP>:6443 \\
  --token <TOKEN> \\
  --discovery-token-ca-cert-hash sha256:<HASH> \\
  --control-plane \\
  --certificate-key <CERT_KEY>

mkdir -p /root/.kube
cp /etc/kubernetes/admin.conf /root/.kube/config
chmod 600 /root/.kube/config`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Verify All Masters">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — verify all 3 masters are Ready" variant="h1">
{`kubectl get nodes -o wide`}
        </CodeBlock>

        <VerifyBlock label="Verify all masters joined">
          <p><code>kubectl get nodes -o wide</code> shows all 3 masters in <strong>Ready</strong> state.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
