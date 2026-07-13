import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section8() {
  return (
    <Section id="kubeadm" num={8} title="Install kubeadm, kubelet, kubectl">
      <Prose>
        Install from the local repo on all 6 nodes. These are the core
        Kubernetes binaries.
      </Prose>

      <Subsection title="Install">
        <CodeBlock lang="bash" label="ALL nodes">
{`# Install kubeadm, kubelet, kubectl from local repo
dnf install -y kubelet kubeadm kubectl

# Enable kubelet
systemctl enable --now kubelet

# Install useful utilities
dnf install -y bash-completion ipvsadm bind-utils tcpdump \\
  nmap-ncat sysstat vim-enhanced wget git unzip

# Install helm from offline bundle
cp /root/airgap-bundle/rpms/helm /usr/local/bin/

# Enable kubectl autocomplete
kubectl completion bash > /etc/bash_completion.d/kubectl
echo 'alias k=kubectl' >> /root/.bashrc`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Verify Versions">
        <CodeBlock lang="bash" label="ALL nodes">
{`kubeadm version
kubelet --version
kubectl version --client`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p>
            All three commands show version <code>&lt;K8S_VERSION&gt;</code>.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
