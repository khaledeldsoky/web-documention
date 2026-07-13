import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section12() {
  return (
    <Section id="flannel" num={12} title="Install Flannel">
      <Prose>
        Install the CNI plugin on <strong>master1</strong>. Rewrite image
        references to point at the local registry before applying.
      </Prose>

      <Subsection title="Apply Flannel Manifest">
        <CodeBlock lang="bash" label="master1">
{`# Copy the manifest from the staging bundle
cp /root/airgap-bundle/manifests/kube-flannel.yml /root/kube-flannel.yml

# Rewrite image references to point at local registry
sed -i 's|docker.io/flannel/flannel:|<MASTER_0_IP>:<REGISTRY_PORT>/flannel/flannel:|g; \\
  s|docker.io/flannel/flannel-cni-plugin:|<MASTER_0_IP>:<REGISTRY_PORT>/flannel/flannel-cni-plugin:|g' \\
  /root/kube-flannel.yml

# Apply
kubectl apply -f /root/kube-flannel.yml`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Verify">
        <CodeBlock lang="bash" label="master1">
{`# Wait for flannel pods to be ready
kubectl get pods -n kube-flannel -w

# Check nodes — should now show Ready
kubectl get nodes`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p>
            All 6 nodes show status <strong>Ready</strong>.
          </p>
          <p>
            All <code>kube-flannel</code> pods show{" "}
            <strong>Running</strong>.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
