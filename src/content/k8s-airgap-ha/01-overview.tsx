import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import Var from "@/components/docs/Var";

export function Section1() {
  return (
    <Section id="overview" num={1} title="Overview &amp; IP Plan">
      <Prose>
        This guide builds a production-grade, fully air-gapped Kubernetes cluster on
        RHEL 9 using <strong>nerdctl</strong> (not Docker) to manage containers. All
        image versions are discovered from official sources first, then exact versions
        are used throughout. The cluster is installed with internet (via laptop ICS),
        tested, then air-gap services are retrofitted and internet is removed.
      </Prose>

      <Subsection id="topology" title="Cluster Topology">
        <Prose>
          <strong>3 control-plane nodes + 3 worker nodes</strong> (6 physical machines).
          master1 doubles as the infra node: it runs DNS (dnsmasq), NTP (chrony), a
          local yum repo (httpd), and a local container registry (Docker Registry v2 +
          nerdctl).
        </Prose>

        <Callout variant="info">
          <strong>Key principle:</strong> Use nerdctl (not Docker) to pull/tag/push
          images — it talks directly to containerd, no separate daemon. Install with
          internet, test everything, then retrofit air-gap and disable internet.
        </Callout>
      </Subsection>

      <Subsection id="ip-plan" title="IP Address Plan">
        <table className="info-table">
          <thead>
            <tr>
              <th>Host</th>
              <th>Role</th>
              <th>IP</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>master1</td>
              <td>Control plane + infra</td>
              <td><Var course="k8s-airgap-ha" name="MASTER_0_IP" /></td>
              <td>bootstrap node</td>
            </tr>
            <tr>
              <td>master2</td>
              <td>Control plane</td>
              <td><Var course="k8s-airgap-ha" name="MASTER_1_IP" /></td>
              <td></td>
            </tr>
            <tr>
              <td>master3</td>
              <td>Control plane</td>
              <td><Var course="k8s-airgap-ha" name="MASTER_2_IP" /></td>
              <td></td>
            </tr>
            <tr>
              <td>worker1</td>
              <td>Worker</td>
              <td><Var course="k8s-airgap-ha" name="WORKER_0_IP" /></td>
              <td></td>
            </tr>
            <tr>
              <td>worker2</td>
              <td>Worker</td>
              <td><Var course="k8s-airgap-ha" name="WORKER_1_IP" /></td>
              <td></td>
            </tr>
            <tr>
              <td>worker3</td>
              <td>Worker</td>
              <td><Var course="k8s-airgap-ha" name="WORKER_2_IP" /></td>
              <td></td>
            </tr>
            <tr>
              <td>kube-vip VIP</td>
              <td>API server endpoint</td>
              <td><Var course="k8s-airgap-ha" name="VIP" /></td>
              <td>floats between masters</td>
            </tr>
            <tr>
              <td>MetalLB pool</td>
              <td>LoadBalancer IPs</td>
              <td><Var course="k8s-airgap-ha" name="METALLB_POOL_START" /> – <Var course="k8s-airgap-ha" name="METALLB_POOL_END" /></td>
              <td></td>
            </tr>
            <tr>
              <td>NGINX Ingress</td>
              <td>Ingress LB IP</td>
              <td><Var course="k8s-airgap-ha" name="INGRESS_IP" /></td>
              <td></td>
            </tr>
            <tr>
              <td>Pod network</td>
              <td>Flannel CIDR</td>
              <td><Var course="k8s-airgap-ha" name="POD_CIDR" /></td>
              <td>internal only</td>
            </tr>
            <tr>
              <td>Service CIDR</td>
              <td>ClusterIP range</td>
              <td><code>10.96.0.0/12</code></td>
              <td>kubeadm default</td>
            </tr>
          </tbody>
        </table>
      </Subsection>

      <Subsection id="prereqs" title="Hardware &amp; OS Requirements">
        <InfoTable
          columns={[
            { header: "Resource", key: "resource" },
            { header: "Control Plane", key: "cp" },
            { header: "Worker", key: "wk" },
          ]}
          rows={[
            { resource: "CPU", cp: "4 vCPU minimum", wk: "4 vCPU minimum" },
            { resource: "RAM", cp: "8 GB minimum", wk: "8 GB minimum" },
            { resource: "Disk (OS)", cp: "50 GB", wk: "50 GB" },
            { resource: "OS", cp: "RHEL 9 — fully patched", wk: "RHEL 9 — fully patched" },
            { resource: "Network", cp: "Full L2 between all nodes", wk: "Full L2 between all nodes" },
            { resource: "Swap", cp: "Must be disabled", wk: "Must be disabled" },
          ]}
        />
      </Subsection>
    </Section>
  );
}
