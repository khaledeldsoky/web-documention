import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import Var from "@/components/docs/Var";

export function Section2() {
  return (
    <Section id="image-discovery" num={2} title="Discover Image Versions">
      <Prose>
        Run these commands <strong>before</strong> touching any cluster nodes — get the
        exact versions you will use. Save all versions to a file for reference.
      </Prose>

      <Subsection title="Kubernetes Core Images">
        <CodeBlock lang="bash" label="any machine with internet">
{`# The target version you want to install
K8S_VERSION="<K8S_VERSION>"

# Get the exact core image list
kubeadm config images list --kubernetes-version $K8S_VERSION`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p>
            Output shows exact tags:<br />
            <code>registry.k8s.io/kube-apiserver:<Var course="k8s-airgap-ha" name="K8S_VERSION" /></code><br />
            <code>registry.k8s.io/pause:<Var course="k8s-airgap-ha" name="PAUSE_VERSION" /></code><br />
            <code>registry.k8s.io/etcd:<Var course="k8s-airgap-ha" name="ETCD_VERSION" /></code><br />
            <code>registry.k8s.io/coredns/coredns:<Var course="k8s-airgap-ha" name="COREDNS_VERSION" /></code>
          </p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="kube-vip">
        <CodeBlock lang="bash" label="any machine with internet">
{`curl -s https://api.github.com/repos/kube-vip/kube-vip/releases/latest \\
  | grep '"tag_name"' | cut -d'"' -f4
# Output example: v0.8.9`}
        </CodeBlock>
        <Prose>
          Image: <code>ghcr.io/kube-vip/kube-vip:<Var course="k8s-airgap-ha" name="KUBEVIP_VERSION" /></code>
        </Prose>
      </Subsection>

      <Subsection title="Flannel">
        <CodeBlock lang="bash" label="any machine with internet">
{`curl -s https://api.github.com/repos/flannel-io/flannel/releases/latest \\
  | grep '"tag_name"' | cut -d'"' -f4
# Output example: v0.26.1`}
        </CodeBlock>
        <Prose>
          Images: <code>docker.io/flannel/flannel:<Var course="k8s-airgap-ha" name="FLANNEL_VERSION" /></code> and{" "}
          <code>docker.io/flannel/flannel-cni-plugin:<Var course="k8s-airgap-ha" name="FLANNEL_CNI_PLUGIN_VERSION" /></code>
        </Prose>
      </Subsection>

      <Subsection title="MetalLB">
        <CodeBlock lang="bash" label="any machine with internet">
{`curl -s https://api.github.com/repos/metallb/metallb/releases/latest \\
  | grep '"tag_name"' | cut -d'"' -f4
# Output example: v0.15.3`}
        </CodeBlock>
        <Prose>
          Images: <code>quay.io/metallb/controller:<Var course="k8s-airgap-ha" name="METALLB_VERSION" /></code> and{" "}
          <code>quay.io/metallb/speaker:<Var course="k8s-airgap-ha" name="METALLB_VERSION" /></code>
        </Prose>
      </Subsection>

      <Subsection title="NGINX Ingress">
        <CodeBlock lang="bash" label="any machine with internet">
{`curl -s https://api.github.com/repos/kubernetes/ingress-nginx/releases/latest \\
  | grep '"tag_name"' | cut -d'"' -f4 | grep -v '^ingress'
# Output example: v1.12.0`}
        </CodeBlock>
        <Prose>
          Images: <code>registry.k8s.io/ingress-nginx/controller:<Var course="k8s-airgap-ha" name="INGRESS_NGINX_VERSION" /></code>{" "}
          and <code>registry.k8s.io/ingress-nginx/kube-webhook-certgen:<Var course="k8s-airgap-ha" name="INGRESS_WEBHOOK_CERTGEN_VERSION" /></code>
        </Prose>
      </Subsection>

      <Subsection title="Docker Registry v2">
        <CodeBlock lang="bash" label="any machine with internet">
{`curl -s https://api.github.com/repos/distribution/distribution/releases/latest \\
  | grep '"tag_name"' | cut -d'"' -f4
# Image name is just: registry:2`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Save All Versions">
        <CodeBlock lang="bash" label="any machine with internet">
{`cat > /tmp/image-versions.txt <<'EOF'
K8S_VERSION=<K8S_VERSION>
KUBEVIP_VERSION=<KUBEVIP_VERSION>
FLANNEL_VERSION=<FLANNEL_VERSION>
FLANNEL_CNI_PLUGIN_VERSION=<FLANNEL_CNI_PLUGIN_VERSION>
METALLB_VERSION=<METALLB_VERSION>
INGRESS_NGINX_VERSION=<INGRESS_NGINX_VERSION>
INGRESS_WEBHOOK_CERTGEN_VERSION=<INGRESS_WEBHOOK_CERTGEN_VERSION>
REGISTRY_VERSION=<REGISTRY_VERSION>
EOF

source /tmp/image-versions.txt`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
