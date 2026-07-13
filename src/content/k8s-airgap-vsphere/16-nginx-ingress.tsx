import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import Collapsible from "@/components/docs/Collapsible";

export function Section16() {
  return (
    <Section id="nginx-ingress" num={16} title="Install NGINX Ingress">
      <Prose>
        Install NGINX Ingress Controller from the offline Helm chart on{" "}
        <strong>master1</strong>. Uses hostNetwork mode for direct access.
      </Prose>

      <Subsection title="Extract Helm Chart">
        <CodeBlock lang="bash" label="master1">
{`# Untar the chart from the staging bundle
tar xzf /root/airgap-bundle/manifests/ingress-nginx-*.tgz -C /root/`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Install with Helm">
        <Collapsible title="nginx-ingress-values.yaml">
          <CodeBlock lang="yaml" label="nginx-ingress-values.yaml">
{`controller:
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
  image:
    registry: <MASTER_0_IP>:<REGISTRY_PORT>
    image: ingress-nginx/controller
  tolerations:
  - key: "node-role.kubernetes.io/control-plane"
    operator: "Exists"
    effect: "NoSchedule"`}
          </CodeBlock>
        </Collapsible>

        <CodeBlock lang="bash" label="master1">
{`helm upgrade --install ingress-nginx /root/ingress-nginx \\
  --namespace ingress-nginx \\
  --create-namespace \\
  -f /tmp/nginx-ingress-values.yaml`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Verify">
        <CodeBlock lang="bash" label="master1">
{`kubectl get svc -n ingress-nginx
kubectl get pods -n ingress-nginx -o wide
curl -I http://<INGRESS_IP>`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p>
            <code>curl -I http://&lt;INGRESS_IP&gt;</code> returns{" "}
            <code>HTTP/1.1 404 Not Found</code> (expected — no ingress rules
            yet).
          </p>
          <p>
            The DNS entry <code>*.apps.&lt;DOMAIN&gt;</code> →{" "}
            <code>&lt;INGRESS_IP&gt;</code> is already in dnsmasq from{" "}
            <a href="#master1-infra">Section 4</a>.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
