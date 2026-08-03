import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section14() {
  return (
    <Section id="nginx-ingress" num={14} title="Install NGINX Ingress">
      <Prose>
        The Ingress controller routes HTTP/HTTPS traffic to backend Services. Deployed as
        a DaemonSet with <code>hostNetwork: true</code> to bind directly to port 80/443.
      </Prose>

      <Subsection title="Add Helm Repository">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — add Helm repo" variant="h1">
{`helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Create Values File">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — create nginx ingress values" variant="h1">
{`cat > /tmp/nginx-ingress-values.yaml <<'EOF'
controller:
  kind: DaemonSet
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
  hostPort:
    enabled: true
    ports:
      http: 80
      https: 443
  service:
    type: LoadBalancer
    loadBalancerIP: <INGRESS_IP>
  admissionWebhooks:
    enabled: false
  tolerations:
  - key: "node-role.kubernetes.io/control-plane"
    operator: "Exists"
    effect: "NoSchedule"
EOF`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Install via Helm">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — install NGINX Ingress" variant="h1">
{`helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \\
  --namespace ingress-nginx \\
  --create-namespace \\
  -f /tmp/nginx-ingress-values.yaml`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Verify">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — verify NGINX Ingress" variant="h1">
{`kubectl get svc -n ingress-nginx
kubectl get pods -n ingress-nginx -o wide
curl -I http://<INGRESS_IP>        # should get 404 (NGINX is up, no rules yet)`}
        </CodeBlock>

        <VerifyBlock label="Verify NGINX Ingress is running">
          <p>
            <code>curl -I</code> returns HTTP 404. Service has EXTERNAL-IP as{" "}
            <code><Var course="k8s-airgap-ha" name="INGRESS_IP" /></code>.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
