import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import Collapsible from "@/components/docs/Collapsible";

export function Section15() {
  return (
    <Section id="metallb" num={15} title="Install MetalLB">
      <Prose>
        MetalLB provides LoadBalancer IPs for services in bare-metal clusters.
        Install from the offline manifest on <strong>master1</strong>.
      </Prose>

      <Subsection title="Apply MetalLB Manifest">
        <CodeBlock lang="bash" label="master1">
{`# Copy manifest from staging bundle
cp /root/airgap-bundle/manifests/metallb-native.yaml /root/metallb-native.yaml

# Rewrite image references to local registry
sed -i 's|quay.io/metallb/controller:|<MASTER_0_IP>:<REGISTRY_PORT>/metallb/controller:|g; \\
  s|quay.io/metallb/speaker:|<MASTER_0_IP>:<REGISTRY_PORT>/metallb/speaker:|g' \\
  /root/metallb-native.yaml

# Apply
kubectl apply -f /root/metallb-native.yaml
kubectl wait --for=condition=Ready pods --all -n metallb-system --timeout=120s`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Enable strictARP">
        <CodeBlock lang="bash" label="master1">
{`# Enable strictARP for MetalLB to work
kubectl get configmap kube-proxy -n kube-system -o yaml \\
  | sed 's/strictARP: false/strictARP: true/' \\
  | kubectl apply -f - -n kube-system

# Restart kube-proxy
kubectl rollout restart daemonset kube-proxy -n kube-system
kubectl rollout status daemonset kube-proxy -n kube-system`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Configure IPAddressPool and L2Advertisement">
        <Collapsible title="metallb-pool.yaml">
          <CodeBlock lang="yaml" label="metallb-pool.yaml">
{`apiVersion: metallb.io/v1beta1
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
  - default-pool`}
          </CodeBlock>
        </Collapsible>

        <CodeBlock lang="bash" label="master1">
{`kubectl apply -f /tmp/metallb-pool.yaml
kubectl get ipaddresspool,l2advertisement -n metallb-system`}
        </CodeBlock>

        <VerifyBlock label="Verify MetalLB">
          <p>
            <code>kubectl get pods -n metallb-system</code> shows all pods{" "}
            <strong>Running</strong>.
          </p>
          <p>
            <code>kubectl get ipaddresspool -n metallb-system</code> shows{" "}
            <code>default-pool</code> with the correct range.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
