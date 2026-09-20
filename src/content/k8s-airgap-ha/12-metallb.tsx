import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section12() {
  return (
    <Section id="metallb" num={12} title="Install MetalLB">
      <Prose>
        MetalLB gives <code>Service</code> type <code>LoadBalancer</code> a real external
        IP on bare-metal. It uses ARP (Layer 2 mode) to announce IP ownership.
      </Prose>

      <Subsection title="Deploy MetalLB">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — deploy MetalLB" variant="h1">
{`curl -fsSL https://raw.githubusercontent.com/metallb/metallb/<METALLB_VERSION>/config/manifests/metallb-native.yaml \\
  -o /root/metallb-native.yaml

kubectl apply -f /root/metallb-native.yaml

kubectl wait --for=condition=Ready pods --all -n metallb-system --timeout=120s`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Enable strictARP on kube-proxy">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — enable strictARP" variant="h1">
{`kubectl get configmap kube-proxy -n kube-system -o yaml \\
  | sed 's/strictARP: false/strictARP: true/' \\
  | kubectl apply -f -

kubectl rollout restart daemonset kube-proxy -n kube-system
kubectl rollout status daemonset kube-proxy -n kube-system`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Configure IP Address Pool">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — configure MetalLB IP pool" variant="h1">
{`cat > /tmp/metallb-pool.yaml <<'EOF'
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: default-pool
  namespace: metallb-system
spec:
  addresses:
  - <METALLB_POOL_START>-<METALLB_POOL_END>
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: l2adv
  namespace: metallb-system
spec:
  ipAddressPools:
  - default-pool
EOF

kubectl apply -f /tmp/metallb-pool.yaml
kubectl get ipaddresspool,l2advertisement -n metallb-system`}
        </CodeBlock>

        <VerifyBlock label="Verify MetalLB is ready">
          <p><code>kubectl get ipaddresspool,l2advertisement -n metallb-system</code> shows pool created.</p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Schedule the Controller on master1">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <Prose>
          The upstream manifest gives the speaker DaemonSet control-plane tolerations but
          <strong> not the controller Deployment</strong>. Right now master1 is the only
          schedulable node — without this patch the controller stays Pending, no
          LoadBalancer IPs get assigned, and NGINX Ingress never gets its EXTERNAL-IP.
        </Prose>
        <CodeBlock lang="bash" label="master1 — tolerate control-plane on the controller" variant="h1">
{`kubectl -n metallb-system patch deployment controller --type merge -p '
spec:
  template:
    spec:
      tolerations:
      - key: node-role.kubernetes.io/control-plane
        operator: Exists
        effect: NoSchedule
      - key: node-role.kubernetes.io/master
        operator: Exists
        effect: NoSchedule
'

# If your MetalLB version names it differently:
kubectl -n metallb-system get deployments`}
        </CodeBlock>

        <VerifyBlock label="Verify all MetalLB pods Running">
          <p><code>kubectl -n metallb-system get pods</code> shows both controller and speaker pods Running on master1.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
