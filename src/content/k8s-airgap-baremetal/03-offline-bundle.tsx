import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";

export function Section3() {
  return (
    <Section id="offline-bundle" num={3} title="Build the Offline Staging Bundle">
      <Prose>
        This is <strong>not</strong> one of the 6 cluster nodes — it&apos;s any
        machine (your laptop, a temporary VM) with internet access, RHEL 9 or
        compatible, used only to download everything once. You&apos;ll then{" "}
        <code>scp</code> the results to <code>master1</code>.
      </Prose>

      <Subsection title="Install Docker on Staging Machine">
        <Prose>
          The staging machine needs Docker to pull and save container images.
          Skip if Docker is already installed.
        </Prose>
        <CodeBlock lang="bash" label="Staging machine (with internet)">
{`# Remove old docker (if any)
sudo dnf remove -y docker docker-client docker-client-latest \\
  docker-common docker-latest docker-latest-logrotate \\
  docker-logrotate docker-engine 2>/dev/null

# Add Docker CE repo
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo \\
  https://download.docker.com/linux/centos/docker-ce.repo

# Install Docker
sudo dnf install -y docker-ce docker-ce-cli containerd.io \\
  docker-buildx-plugin docker-compose-plugin

# Enable and start
sudo systemctl enable --now docker`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Download RPMs">
        <CodeBlock lang="bash" label="Staging machine (with internet)">
{`mkdir -p ~/airgap-bundle/{rpms,images,manifests}
cd ~/airgap-bundle

# Add Docker CE repo
dnf install -y dnf-plugins-core
dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Add Kubernetes repo
cat > /etc/yum.repos.d/kubernetes.repo <<'EOF'
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v<K8S_MINOR_VERSION>/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v<K8S_MINOR_VERSION>/rpm/repodata/repomd.xml.key
EOF

# Download all RPMs
dnf download --resolve --destdir=rpms \\
  containerd.io containernetworking-plugins \\
  kubelet kubeadm kubectl cri-tools kubernetes-cni \\
  bash-completion ipvsadm bind-utils tcpdump nmap-ncat \\
  sysstat vim-enhanced wget git unzip chrony dnsmasq createrepo_c

# Download helm binary (not in K8s RPM repo)
HELM_VERSION="v<HELM_VERSION>"
curl -L -o rpms/helm.tar.gz \\
  https://get.helm.sh/helm-\${HELM_VERSION}-linux-amd64.tar.gz
tar -xzf rpms/helm.tar.gz -C rpms/
mv rpms/linux-amd64/helm rpms/
rm -rf rpms/linux-amd64 rpms/helm.tar.gz`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Find Your Versions">
        <Prose>
          Run these on the staging machine (with internet) to discover the correct
          versions for your environment. Fill them into{" "}
          <a href="#variables">Section 0</a>.
        </Prose>
        <CodeBlock lang="bash" label="Staging machine (with internet)">
{`# --- Core K8s images (etcd, coredns, pause) ---
# Option 1: kubeadm source
curl -sL https://raw.githubusercontent.com/kubernetes/kubernetes/v<K8S_VERSION>/cmd/kubeadm/app/constants/constants.go \\
  | grep -E "(CoreDNSVersion|DefaultEtcdVersion|PauseVersion)"

# Option 2: minikube compatibility table
curl -sL https://raw.githubusercontent.com/kubernetes/minikube/master/pkg/minikube/constants/constants_kubeadm_images.go \\
  | grep -A3 "v<K8S_VERSION>"

# --- Third-party components (latest stable) ---
curl -sL https://api.github.com/repos/containerd/containerd/releases/latest | grep tag_name
curl -sL https://api.github.com/repos/kube-vip/kube-vip/releases/latest | grep tag_name
curl -sL https://api.github.com/repos/flannel-io/flannel/releases/latest | grep tag_name
curl -sL https://api.github.com/repos/metallb/metallb/releases/latest | grep tag_name
curl -sL https://api.github.com/repos/kubernetes/ingress-nginx/releases/latest | grep tag_name
curl -sL https://api.github.com/repos/helm/helm/releases/latest | grep tag_name`}
        </CodeBlock>
        <Callout variant="info">
          For <strong>containerd</strong>, use the latest version — it&apos;s
          compatible with all supported K8s releases. For the others, check each
          project&apos;s release notes to confirm K8s compatibility.
        </Callout>
      </Subsection>

      <Subsection title="Download Container Images">
        <CodeBlock lang="bash" label="Staging machine (with internet)">
{`IMAGES=(
  "registry.k8s.io/kube-apiserver:<K8S_VERSION>"
  "registry.k8s.io/kube-controller-manager:<K8S_VERSION>"
  "registry.k8s.io/kube-scheduler:<K8S_VERSION>"
  "registry.k8s.io/kube-proxy:<K8S_VERSION>"
  "registry.k8s.io/pause:<PAUSE_VERSION>"
  "registry.k8s.io/etcd:<ETCD_VERSION>"
  "registry.k8s.io/coredns/coredns:<COREDNS_VERSION>"
  "ghcr.io/kube-vip/kube-vip:<KUBE_VIP_VERSION>"
  "docker.io/flannel/flannel:<FLANNEL_VERSION>"
  "docker.io/flannel/flannel-cni-plugin:<FLANNEL_CNI_VERSION>"
  "quay.io/metallb/controller:<METALLB_VERSION>"
  "quay.io/metallb/speaker:<METALLB_VERSION>"
  "registry.k8s.io/ingress-nginx/controller:<INGRESS_NGINX_VERSION>"
  "registry.k8s.io/ingress-nginx/kube-webhook-certgen:<INGRESS_WEBHOOK_VERSION>"
  "registry:2"
)

for img in "\${IMAGES[@]}"; do
  docker pull "\$img"
  fname=\$(echo "\$img" | tr '/:' '__')
  docker save "\$img" -o "images/\${fname}.tar"
done`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>Pin your versions:</strong> Always confirm the exact current
          tags for kube-vip, flannel, metallb, and ingress-nginx before staging
          — these change. Run{" "}
          <code>
            kubeadm config images list --kubernetes-version &lt;K8S_VERSION&gt;
          </code>{" "}
          to print the exact core image list.
        </Callout>
      </Subsection>

      <Subsection title="Download Manifests">
        <CodeBlock lang="bash" label="Staging machine (with internet)">
{`# Flannel
curl -fsSL https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml \\
  -o manifests/kube-flannel.yml

# MetalLB
curl -fsSL https://raw.githubusercontent.com/metallb/metallb/<METALLB_VERSION>/config/manifests/metallb-native.yaml \\
  -o manifests/metallb-native.yaml

# NGINX Ingress (Helm chart)
cp rpms/helm /usr/local/bin/
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm pull ingress-nginx/ingress-nginx --destination manifests/`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Package and Transfer">
        <CodeBlock lang="bash" label="Staging machine → master1">
{`# Package everything
cd ~
tar czf airgap-bundle.tar.gz airgap-bundle/

# Copy to master1
scp airgap-bundle.tar.gz root@<MASTER_0_IP>:/root/`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
