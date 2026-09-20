import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section2() {
  return (
    <Section id="image-discovery" num={2} title="Discover Image Versions">
      <Prose>
        Each block auto-detects a version and prints it. A comment{" "}
        <code># Pick the version VAR=&lt;VAR&gt;</code> shows each captured value so you
        can note it down. At the end, one command saves everything to{" "}
        <code>/tmp/image-versions.txt</code> — your lookup reference for the{" "}
        <code>&lt;VAR&gt;</code> placeholders used throughout the guide.
      </Prose>

      <Callout variant="info">
        <strong>Prerequisite:</strong> this machine needs internet access{" "}
        <em>and</em> <code>kubeadm</code> installed (master1 or an admin box). Run the
        blocks in order — later blocks depend on variables set earlier.
      </Callout>

      <Subsection title="Kubernetes Core Images">
        <CodeBlock lang="bash" label="any machine with internet + kubeadm">
{`read -rp "Target Kubernetes version (e.g. v1.35.0): " K8S_VERSION

kubeadm config images list --kubernetes-version \${K8S_VERSION} > /tmp/k8s-images.txt
cat /tmp/k8s-images.txt

PAUSE_VERSION=\$(grep 'pause:' /tmp/k8s-images.txt | cut -d: -f2)
ETCD_VERSION=\$(grep 'etcd:' /tmp/k8s-images.txt | cut -d: -f2)
COREDNS_VERSION=\$(grep 'coredns/coredns:' /tmp/k8s-images.txt | cut -d: -f2)

echo "K8S_VERSION: \$K8S_VERSION"
echo "PAUSE_VERSION: \$PAUSE_VERSION"
echo "ETCD_VERSION: \$ETCD_VERSION"
echo "COREDNS_VERSION: \$COREDNS_VERSION"

# Pick the version PAUSE_VERSION=<PAUSE_VERSION>
# Pick the version ETCD_VERSION=<ETCD_VERSION>
# Pick the version COREDNS_VERSION=<COREDNS_VERSION>`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p>
            The full core image list prints, followed by four lines:<br />
            <code>K8S_VERSION: v1.35.0</code><br />
            <code>PAUSE_VERSION: 3.10</code><br />
            <code>ETCD_VERSION: 3.5.16-0</code><br />
            <code>COREDNS_VERSION: v1.11.3</code>
          </p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="kube-vip">
        <CodeBlock lang="bash" label="any machine with internet + kubeadm">
{`KUBEVIP_VERSION=\$(curl -s https://api.github.com/repos/kube-vip/kube-vip/releases/latest \\
  | grep '"tag_name"' | cut -d'"' -f4)
echo "KUBEVIP_VERSION: \$KUBEVIP_VERSION"
# Pick the version KUBEVIP_VERSION=<KUBEVIP_VERSION>`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p><code>KUBEVIP_VERSION: v0.8.9</code></p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Flannel">
        <CodeBlock lang="bash" label="any machine with internet + kubeadm">
{`FLANNEL_VERSION=\$(curl -s https://api.github.com/repos/flannel-io/flannel/releases/latest \\
  | grep '"tag_name"' | cut -d'"' -f4)
echo "FLANNEL_VERSION: \$FLANNEL_VERSION"

# CNI plugin version is derived from flannel's own manifest at that tag
FLANNEL_CNI_PLUGIN_VERSION=\$(curl -s \\
  https://raw.githubusercontent.com/flannel-io/flannel/\${FLANNEL_VERSION}/Documentation/kube-flannel.yml \\
  | grep 'flannel-cni-plugin:' | head -1 | awk '{print \$2}' \\
  | cut -d: -f2 | cut -d@ -f1)
echo "FLANNEL_CNI_PLUGIN_VERSION: \$FLANNEL_CNI_PLUGIN_VERSION"

# Pick the version FLANNEL_VERSION=<FLANNEL_VERSION>
# Pick the version FLANNEL_CNI_PLUGIN_VERSION=<FLANNEL_CNI_PLUGIN_VERSION>`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p>
            <code>FLANNEL_VERSION: v0.26.1</code><br />
            <code>FLANNEL_CNI_PLUGIN_VERSION: v1.5.1-flannel2</code>
          </p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="MetalLB">
        <CodeBlock lang="bash" label="any machine with internet + kubeadm">
{`# MetalLB releases mix chart tags with version tags — pick the newest "v" tag
METALLB_VERSION=\$(curl -s https://api.github.com/repos/metallb/metallb/releases \\
  | grep '"tag_name"' | cut -d'"' -f4 | grep -m1 '^v[0-9]')
echo "METALLB_VERSION: \$METALLB_VERSION"
# Pick the version METALLB_VERSION=<METALLB_VERSION>`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p><code>METALLB_VERSION: v0.15.3</code></p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="NGINX Ingress">
        <CodeBlock lang="bash" label="any machine with internet + kubeadm">
{`INGRESS_NGINX_VERSION=\$(curl -s https://api.github.com/repos/kubernetes/ingress-nginx/releases/latest \\
  | grep '"tag_name"' | cut -d'"' -f4 | sed 's/^controller-//')
echo "INGRESS_NGINX_VERSION: \$INGRESS_NGINX_VERSION"

# certgen version is derived from that controller release's manifest
INGRESS_WEBHOOK_CERTGEN_VERSION=\$(curl -s \\
  https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-\${INGRESS_NGINX_VERSION}/deploy/static/provider/baremetal/deploy.yaml \\
  | grep 'kube-webhook-certgen:' | head -1 | awk '{print \$2}' \\
  | cut -d: -f2 | cut -d@ -f1)
echo "INGRESS_WEBHOOK_CERTGEN_VERSION: \$INGRESS_WEBHOOK_CERTGEN_VERSION"

# Pick the version INGRESS_NGINX_VERSION=<INGRESS_NGINX_VERSION>
# Pick the version INGRESS_WEBHOOK_CERTGEN_VERSION=<INGRESS_WEBHOOK_CERTGEN_VERSION>`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p>
            <code>INGRESS_NGINX_VERSION: v1.15.1</code><br />
            <code>INGRESS_WEBHOOK_CERTGEN_VERSION: v1.6.9</code>
          </p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Sonatype Nexus 3">
        <CodeBlock lang="bash" label="any machine with internet + kubeadm">
{`NEXUS_VERSION=\$(curl -s "https://hub.docker.com/v2/repositories/sonatype/nexus3/tags?page_size=100" \\
  | tr ',' '\\n' | grep -o '"name":"[0-9]*\\.[0-9]*\\.[0-9]*"' \\
  | cut -d'"' -f4 | sort -rV | head -1)
echo "NEXUS_VERSION: \$NEXUS_VERSION"
# Pick the version NEXUS_VERSION=<NEXUS_VERSION>`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p><code>NEXUS_VERSION: 3.95.2</code> (newest stable tag — alpine/ubi variants excluded)</p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Save All Versions">
        <CodeBlock lang="bash" label="any machine with internet + kubeadm">
{`cat > /tmp/image-versions.txt <<EOF
K8S_VERSION=\${K8S_VERSION}
PAUSE_VERSION=\${PAUSE_VERSION}
ETCD_VERSION=\${ETCD_VERSION}
COREDNS_VERSION=\${COREDNS_VERSION}
KUBEVIP_VERSION=\${KUBEVIP_VERSION}
FLANNEL_VERSION=\${FLANNEL_VERSION}
FLANNEL_CNI_PLUGIN_VERSION=\${FLANNEL_CNI_PLUGIN_VERSION}
METALLB_VERSION=\${METALLB_VERSION}
INGRESS_NGINX_VERSION=\${INGRESS_NGINX_VERSION}
INGRESS_WEBHOOK_CERTGEN_VERSION=\${INGRESS_WEBHOOK_CERTGEN_VERSION}
NEXUS_VERSION=\${NEXUS_VERSION}
EOF

source /tmp/image-versions.txt
cat /tmp/image-versions.txt`}
        </CodeBlock>

        <VerifyBlock label="All versions saved">
          <p>
            <code>cat /tmp/image-versions.txt</code> shows all eleven variables with
            real values. This file is your reference — whenever a command shows{" "}
            <code>&lt;VAR&gt;</code>, look up the value here.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
