import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import InfoTable from "@/components/docs/InfoTable";
import Callout from "@/components/docs/Callout";

export function Section1() {
  return (
    <Section id="overview" num={1} title="Overview & Assumptions">
      <Prose>
        Topology: 3 masters + 3 workers (6 VMs total) on <strong>vSphere</strong>.{" "}
        <code>master1</code> doubles as the <strong>infra node</strong>: local DNS,
        local NTP, local yum repo, local container registry.
      </Prose>
      <Prose>
        VMs are cloned from a RHEL template using <strong>govc</strong>. Static IPs
        are injected via kernel args at clone time.
      </Prose>

      <Subsection title="Air-Gap vs Normal Install">
        <InfoTable
          columns={[
            { header: "Normal guide does this", key: "normal" },
            { header: "Air-gap version does this instead", key: "airgap" },
          ]}
          rows={[
            {
              normal: "<code>dnf install</code> from public repos",
              airgap: '<code>dnf install</code> from a <strong>local repo</strong> hosted on master1',
            },
            {
              normal: "curl to download.docker.com, pkgs.k8s.io",
              airgap: "Packages pre-downloaded on a <strong>staging machine</strong> (with internet), then copied to local repo",
            },
            {
              normal: "<code>kubectl apply -f https://...</code>",
              airgap: "Images pulled from a <strong>local registry</strong> on master1; manifests edited to point at it",
            },
            {
              normal: "Public NTP (pool.ntp.org)",
              airgap: "master1 runs <strong>chronyd</strong> as a local time server; all nodes sync to it",
            },
            {
              normal: "Public/company DNS",
              airgap: "master1 runs <strong>dnsmasq</strong> for internal name resolution; all nodes point at it",
            },
          ]}
        />
      </Subsection>

      <Subsection title="IP Plan">
        <InfoTable
          columns={[
            { header: "Host", key: "host" },
            { header: "Role", key: "role" },
            { header: "IP", key: "ip" },
            { header: "Notes", key: "notes" },
          ]}
          rows={[
            { host: "master1", role: "Control plane + infra", ip: "<MASTER_0_IP>", notes: "DNS/NTP/repo/registry" },
            { host: "master2", role: "Control plane", ip: "<MASTER_1_IP>", notes: "" },
            { host: "master3", role: "Control plane", ip: "<MASTER_2_IP>", notes: "" },
            { host: "worker1", role: "Worker", ip: "<WORKER_0_IP>", notes: "" },
            { host: "worker2", role: "Worker", ip: "<WORKER_1_IP>", notes: "" },
            { host: "worker3", role: "Worker", ip: "<WORKER_2_IP>", notes: "" },
            { host: "kube-vip VIP", role: "API server endpoint", ip: "<VIP>", notes: "floats between masters" },
            { host: "MetalLB pool", role: "LoadBalancer IPs", ip: "<METALLB_POOL_START> – <METALLB_POOL_END>", notes: "" },
            { host: "NGINX Ingress", role: "Ingress LB IP", ip: "<INGRESS_IP>", notes: "" },
            { host: "Pod network", role: "Flannel", ip: "<POD_CIDR>", notes: "internal only" },
            { host: "Service CIDR", role: "kubeadm default", ip: "<SERVICE_CIDR>", notes: "internal only" },
          ]}
        />

        <Callout variant="info">
          <strong>No gateway</strong> is configured on any node — since
          there&apos;s no upstream network to route to, leave the gateway field
          blank. If any node ever does need outbound access later, add a gateway
          then.
        </Callout>
      </Subsection>
    </Section>
  );
}
