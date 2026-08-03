import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import Var from "@/components/docs/Var";
import NodeTag from "@/components/docs/NodeTag";

export function Section7() {
  return (
    <Section id="kubernetes-tools" num={7} title="Install Kubernetes Tools">
      <Prose>
        Install kubelet, kubeadm, and kubectl on all nodes from the official Kubernetes
        package repository.
      </Prose>

      <Subsection title="Add Kubernetes Repository">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="all nodes">
{`cat > /etc/yum.repos.d/kubernetes.repo <<'EOF'
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/<K8S_VERSION>/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/<K8S_VERSION>/rpm/repodata/repomd.xml.key
EOF`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Install kubelet, kubeadm, kubectl">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="all nodes">
{`dnf install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Install Utilities">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="all nodes">
{`dnf install -y \\
  bash-completion ipvsadm helm bind-utils tcpdump nmap-ncat \\
  htop sysstat vim-enhanced wget git unzip chrony dnsmasq createrepo_c httpd`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Bash Completion">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="all nodes">
{`kubectl completion bash > /etc/bash_completion.d/kubectl
echo 'alias k=kubectl' >> /root/.bashrc
source /root/.bashrc`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Verify Versions">
        <NodeTag label="ALL NODES" variant="all" />
        <CodeBlock lang="bash" label="all nodes">
{`kubeadm version
kubelet --version
kubectl version --client`}
        </CodeBlock>

        <VerifyBlock label="Verify installation">
          <p>All three commands show version matching <code><Var course="k8s-airgap-ha" name="K8S_VERSION" /></code>.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
