import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section12() {
  return (
    <Section id="join-masters" num={12} title="Join Masters 2 & 3">
      <Prose>
        Copy the kube-vip manifest from master1, then run the join command on
        each additional master.
      </Prose>

      <Subsection title="Copy kube-vip Manifest">
        <CodeBlock lang="bash" label="master1">
{`# Copy kube-vip manifest to master2 and master3
scp /etc/kubernetes/manifests/kube-vip.yaml root@<MASTER_1_IP>:/etc/kubernetes/manifests/kube-vip.yaml
scp /etc/kubernetes/manifests/kube-vip.yaml root@<MASTER_2_IP>:/etc/kubernetes/manifests/kube-vip.yaml`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Join master2">
        <CodeBlock lang="bash" label="master2">
{`# Run the join command from Section 10's output
kubeadm join <VIP>:6443 \\
  --token <TOKEN> \\
  --discovery-token-ca-cert-hash sha256:<HASH> \\
  --control-plane \\
  --certificate-key <CERT_KEY>

# Set up kubectl
mkdir -p /root/.kube
cp /etc/kubernetes/admin.conf /root/.kube/config
chmod 600 /root/.kube/config`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Join master3">
        <CodeBlock lang="bash" label="master3">
{`# Same join command (token and hash are the same)
kubeadm join <VIP>:6443 \\
  --token <TOKEN> \\
  --discovery-token-ca-cert-hash sha256:<HASH> \\
  --control-plane \\
  --certificate-key <CERT_KEY>

mkdir -p /root/.kube
cp /etc/kubernetes/admin.conf /root/.kube/config
chmod 600 /root/.kube/config`}
        </CodeBlock>

        <VerifyBlock label="Verify from master1">
          <p>
            <code>kubectl get nodes -o wide</code> shows all 3 masters as{" "}
            <strong>Ready</strong>.
          </p>
        </VerifyBlock>
      </Subsection>

      <Callout variant="info">
        The <code>&lt;TOKEN&gt;</code>, <code>&lt;HASH&gt;</code>, and{" "}
        <code>&lt;CERT_KEY&gt;</code> are in the output of{" "}
        <code>kubeadm init</code> from <a href="#init-cluster">Section 10</a>.
      </Callout>
    </Section>
  );
}
