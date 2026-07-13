import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import InfoTable from "@/components/docs/InfoTable";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section16() {
  return (
    <Section id="verification" num={16} title="Verification Checklist">
      <Prose>
        Run these checks on <strong>master1</strong> to confirm everything is
        working correctly.
      </Prose>

      <Subsection title="Cluster Health">
        <CodeBlock lang="bash" label="master1">
{`# All 6 nodes should be Ready
kubectl get nodes -o wide

# No pods should be in CrashLoopBackOff or Error
kubectl get pods -A`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Infrastructure Services">
        <CodeBlock lang="bash" label="master1">
{`# NTP — each node synced to master1
chronyc sources

# DNS — each node points to master1
cat /etc/resolv.conf

# Local yum repo — reachable from any node
curl -I http://<MASTER_0_IP>/repo/

# Local registry — lists all images
curl http://<MASTER_0_IP>:<REGISTRY_PORT>/v2/_catalog`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Quick Reference">
        <InfoTable
          columns={[
            { header: "Check", key: "check" },
            { header: "Command", key: "cmd" },
            { header: "Expected", key: "expected" },
          ]}
          rows={[
            { check: "All nodes Ready", cmd: "kubectl get nodes -o wide", expected: "6 nodes, status Ready" },
            { check: "No pod errors", cmd: "kubectl get pods -A", expected: "No CrashLoopBackOff" },
            { check: "NTP sync", cmd: "chronyc sources", expected: "Syncing to <MASTER_0_IP>" },
            { check: "DNS resolution", cmd: "ping master1", expected: "Resolves to <MASTER_0_IP>" },
            { check: "Local repo", cmd: "curl http://<MASTER_0_IP>/repo/", expected: "200 OK" },
            { check: "Local registry", cmd: "curl http://<MASTER_0_IP>:<REGISTRY_PORT>/v2/_catalog", expected: "JSON with image list" },
            { check: "MetalLB", cmd: "kubectl get ipaddresspool -n metallb-system", expected: "Pool configured" },
            { check: "NGINX Ingress", cmd: "curl -I http://<INGRESS_IP>", expected: "HTTP 404 (no rules yet)" },
          ]}
        />
      </Subsection>
    </Section>
  );
}
