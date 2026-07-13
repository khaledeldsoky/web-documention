import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section11() {
  return (
    <Section id="init-cluster" num={11} title="Initialize the Cluster">
      <Prose>
        Run <strong>only on master1</strong>. kubeadm needs to pull core images
        from your local registry instead of <code>registry.k8s.io</code>.
      </Prose>

      <Subsection title="Create kubeadm Config">
        <CodeBlock lang="bash" label="master1">
{`cat > /root/kubeadm-config.yaml <<'EOF'
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: <K8S_VERSION>
imageRepository: <MASTER_0_IP>:<REGISTRY_PORT>
controlPlaneEndpoint: "<VIP>:6443"
networking:
  podSubnet: "<POD_CIDR>"
  serviceSubnet: "<SERVICE_CIDR>"
apiServer:
  certSANs:
  - "<VIP>"
  - "k8s-api.<DOMAIN>"
EOF`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Run kubeadm init">
        <CodeBlock lang="bash" label="master1">
{`# Initialize the cluster
kubeadm init --config /root/kubeadm-config.yaml --upload-certs \\
  2>&1 | tee /var/log/kubeadm-init.log

# Extract join commands
grep -A 5 "kubeadm join" /var/log/kubeadm-init.log

# Set up kubectl
mkdir -p /root/.kube
cp /etc/kubernetes/admin.conf /root/.kube/config
chmod 600 /root/.kube/config

# Verify
kubectl get nodes
kubectl get pods -n kube-system`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p>
            <code>kubectl get nodes</code> shows <code>master1</code> with
            status <code>NotReady</code> (normal — CNI not installed yet).
          </p>
          <p>
            <code>kubectl get pods -n kube-system</code> shows core pods
            running.
          </p>
        </VerifyBlock>
      </Subsection>

      <Callout variant="warn">
        <strong>Certificate key</strong> from <code>--upload-certs</code>{" "}
        expires in 2 hours. Re-run{" "}
        <code>kubeadm init phase upload-certs --upload-certs</code> if you
        miss the window.
      </Callout>
    </Section>
  );
}
