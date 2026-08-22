import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section9() {
  return (
    <Section id="init-cluster" num={9} title="Initialize Cluster">
      <Prose>
        <code>kubeadm init</code> creates the etcd database, generates all TLS
        certificates, writes the API server configuration, and prints the join commands
        for other nodes.
      </Prose>

      <Subsection title="Create kubeadm Config">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — create kubeadm config" variant="h1">
{`
cat > /root/kubeadm-config.yaml <<EOF
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: <IP_INIT_MASTER>
  bindPort: 6443
nodeRegistration:
  criSocket: unix:///var/run/containerd/containerd.sock
  name: <IQN_INIT_MASTER>
  kubeletExtraArgs:
    node-ip: "<IP_INIT_MASTER>"
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: <K8S_VERSION>
controlPlaneEndpoint: <VIP>:6443
networking:
  podSubnet: "<POD_CIDR>"
apiServer:
  certSANs:
  - <MASTER_0_IP>
  - <MASTER_1_IP>
  - <MASTER_2_IP>
  - <VIP>
  - 127.0.0.1
  - localhost
  - "k8s-api.<DOMAIN>"
etcd:
  local:
    serverCertSANs:
    - <MASTER_0_IP>
    - <MASTER_1_IP>
    - <MASTER_2_IP>
    - <VIP>
    - 127.0.0.1
    - localhost
    - <IQN_MASTER_0>
    - <IQN_MASTER_1>
    - <IQN_MASTER_2>
    peerCertSANs:
    - <MASTER_0_IP>
    - <MASTER_1_IP>
    - <MASTER_2_IP>
    - <VIP>
    - 127.0.0.1
    - localhost
    - <IQN_MASTER_0>
    - <IQN_MASTER_1>
    - <IQN_MASTER_2>
EOF`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Run kubeadm init">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — initialize the cluster" variant="h1">
{`kubeadm init \\
  --config /root/kubeadm-config.yaml \\
  --upload-certs \\
  2>&1 | tee /var/log/kubeadm-init.log`}
        </CodeBlock>

        <Callout variant="danger">
          <strong>SAVE THE OUTPUT.</strong> The output contains two join commands: one
          for control-plane nodes (with <code>--control-plane</code> and{" "}
          <code>--certificate-key</code>) and one for workers.
        </Callout>
      </Subsection>

      <Subsection title="Save Join Commands">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — extract join commands" variant="h1">
{`grep -A 5 "kubeadm join" /var/log/kubeadm-init.log`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Configure kubectl">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — configure kubectl" variant="h1">
{`mkdir -p /root/.kube
cp /etc/kubernetes/admin.conf /root/.kube/config
chmod 600 /root/.kube/config

kubectl get nodes           # master1 will show NotReady (normal, waiting for CNI)
kubectl get pods -n kube-system`}
        </CodeBlock>

        <VerifyBlock label="Verify cluster init">
          <p>
            <code>kubectl get nodes</code> shows master1 in <strong>NotReady</strong>{" "}
            state (normal — no CNI yet).<br />
            <code>kubectl get pods -n kube-system</code> shows API server, controller
            manager, scheduler, etcd Running.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
