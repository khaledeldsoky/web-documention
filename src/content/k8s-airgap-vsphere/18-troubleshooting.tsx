import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import InfoTable from "@/components/docs/InfoTable";
import Callout from "@/components/docs/Callout";

export function Section18() {
  return (
    <Section id="troubleshooting" num={18} title="Troubleshooting">
      <Prose>
        Common issues specific to air-gapped deployments. For general K8s
        troubleshooting, see the standard guide.
      </Prose>

      <Subsection title="Common Issues">
        <InfoTable
          columns={[
            { header: "Symptom", key: "symptom" },
            { header: "Likely Cause", key: "cause" },
            { header: "Fix", key: "fix" },
          ]}
          rows={[
            {
              symptom: "<code>ImagePullBackOff</code> on any pod",
              cause: "Image not pushed to local registry, tag mismatch, or containerd not trusting it",
              fix: "<code>crictl pull &lt;MASTER_0_IP&gt;:&lt;REGISTRY_PORT&gt;/&lt;image&gt;</code> to see the real error; check hosts.toml",
            },
            {
              symptom: "<code>dnf install</code> hangs or fails",
              cause: "Node&apos;s local-airgap.repo missing or wrong IP; httpd not running on master1",
              fix: "<code>curl http://&lt;MASTER_0_IP&gt;/repo/repodata/repomd.xml</code> from the affected node",
            },
            {
              symptom: "TLS certificate errors / x509",
              cause: "Clock skew — chrony not syncing",
              fix: "<code>chronyc sources</code>, <code>chronyc tracking</code>; confirm master1 chronyd is running",
            },
            {
              symptom: "Nodes can&apos;t resolve hostnames",
              cause: "dnsmasq down on master1, or resolv.conf not pointing to it",
              fix: "<code>systemctl status dnsmasq</code> on master1; <code>cat /etc/resolv.conf</code> on the node",
            },
            {
              symptom: "<code>kubeadm init</code> fails pulling images",
              cause: "imageRepository doesn&apos;t match what you pushed, or missing image",
              fix: "<code>kubeadm config images list --config kubeadm-config.yaml</code> then check registry catalog",
            },
          ]}
        />
      </Subsection>

      <Subsection title="Debug Commands">
        <CodeBlock lang="bash" label="master1">
{`# Check pod status and events
kubectl describe pod <POD_NAME> -n <NAMESPACE>

# Check node conditions
kubectl describe node <NODE_NAME> | grep -A 5 Conditions

# Check containerd on a specific node
crictl ps -a
crictl images

# Check registry catalog
curl http://<MASTER_0_IP>:<REGISTRY_PORT>/v2/_catalog

# Check local repo
curl http://<MASTER_0_IP>/repo/repodata/repomd.xml

# Check dnsmasq
systemctl status dnsmasq
journalctl -u dnsmasq -n 20

# Check chrony
chronyc sources
chronyc tracking`}
        </CodeBlock>

        <Callout variant="info">
          All other troubleshooting scenarios (Flannel VXLAN, MetalLB pending
          IP, etcd quorum, Ingress 502s) are unchanged from the
          connected-network guide.
        </Callout>
      </Subsection>
    </Section>
  );
}
