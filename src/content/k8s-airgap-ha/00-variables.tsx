import Section from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import VariablesTable from "@/components/docs/VariablesTable";

export function Section0() {
  return (
    <Section id="variables" num={0} title="Variables">
      <Prose>
        Fill in your environment values. Each amber-highlighted variable is reused
        throughout the guide. Change these before you start — every command references
        them.
      </Prose>
      <VariablesTable
        course="k8s-airgap-ha"
        columns={[
          { header: "Category", key: "cat" },
          { header: "Variable", key: "var" },
          { header: "Value", key: "val" },
          { header: "Example", key: "cmd" },
        ]}
        rows={[
          { cat: "Node IPs", var: "MASTER_0_IP", val: "<MASTER_0_IP>", cmd: "10.10.10.11 (master1 + infra)" },
          { cat: "Node IPs", var: "MASTER_1_IP", val: "<MASTER_1_IP>", cmd: "10.10.10.12" },
          { cat: "Node IPs", var: "MASTER_2_IP", val: "<MASTER_2_IP>", cmd: "10.10.10.13" },
          { cat: "Node IPs", var: "WORKER_0_IP", val: "<WORKER_0_IP>", cmd: "10.10.10.21" },
          { cat: "Node IPs", var: "WORKER_1_IP", val: "<WORKER_1_IP>", cmd: "10.10.10.22" },
          { cat: "Node IPs", var: "WORKER_2_IP", val: "<WORKER_2_IP>", cmd: "10.10.10.23" },
          { cat: "Node IPs", var: "NIC", val: "<NIC>", cmd: "ens192, eth0, or eno1 (run ip a)" },
          { cat: "Network", var: "VIP", val: "<VIP>", cmd: "10.10.10.10 (kube-vip API endpoint)" },
          { cat: "Network", var: "METALLB_POOL_START", val: "<METALLB_POOL_START>", cmd: "10.10.10.90" },
          { cat: "Network", var: "METALLB_POOL_END", val: "<METALLB_POOL_END>", cmd: "10.10.10.95" },
          { cat: "Network", var: "INGRESS_IP", val: "<INGRESS_IP>", cmd: "10.10.10.90 (NGINX Ingress LB)" },
          { cat: "Network", var: "SUBNET_MASK", val: "<SUBNET_MASK>", cmd: "24" },
          { cat: "Network", var: "MGMT_CIDR", val: "<MGMT_CIDR>", cmd: "10.10.10.0/24" },
          { cat: "Network", var: "DOMAIN", val: "<DOMAIN>", cmd: "cluster.local" },
          { cat: "Network", var: "POD_CIDR", val: "<POD_CIDR>", cmd: "10.244.0.0/16 (Flannel)" },
          { cat: "ICS / Laptop", var: "LAPTOP_ICS_IP", val: "<LAPTOP_ICS_IP>", cmd: "192.168.137.1 (Windows ICS)" },
          { cat: "ICS / Laptop", var: "NODE_ICS_IP", val: "<NODE_ICS_IP>", cmd: "192.168.137.11 (.11-.16 per node)" },
          { cat: "Versions", var: "K8S_VERSION", val: "<K8S_VERSION>", cmd: "v1.35.0" },
          { cat: "Versions", var: "KUBEVIP_VERSION", val: "<KUBEVIP_VERSION>", cmd: "v0.8.9" },
          { cat: "Versions", var: "FLANNEL_VERSION", val: "<FLANNEL_VERSION>", cmd: "v0.26.1" },
          { cat: "Versions", var: "FLANNEL_CNI_PLUGIN_VERSION", val: "<FLANNEL_CNI_PLUGIN_VERSION>", cmd: "v1.5.1" },
          { cat: "Versions", var: "METALLB_VERSION", val: "<METALLB_VERSION>", cmd: "v0.15.3" },
          { cat: "Versions", var: "INGRESS_NGINX_VERSION", val: "<INGRESS_NGINX_VERSION>", cmd: "v1.12.0" },
          { cat: "Versions", var: "INGRESS_WEBHOOK_CERTGEN_VERSION", val: "<INGRESS_WEBHOOK_CERTGEN_VERSION>", cmd: "v1.5.1" },
          { cat: "Versions", var: "REGISTRY_VERSION", val: "<REGISTRY_VERSION>", cmd: "2" },
          { cat: "Versions", var: "PAUSE_VERSION", val: "<PAUSE_VERSION>", cmd: "3.10" },
          { cat: "Versions", var: "ETCD_VERSION", val: "<ETCD_VERSION>", cmd: "3.5.16-0" },
          { cat: "Versions", var: "COREDNS_VERSION", val: "<COREDNS_VERSION>", cmd: "v1.11.3" },
          { cat: "K8s Runtime", var: "TOKEN", val: "<TOKEN>", cmd: "kubeadm token (from init output)" },
          { cat: "K8s Runtime", var: "HASH", val: "<HASH>", cmd: "sha256:... (discovery-token-ca-cert-hash)" },
          { cat: "K8s Runtime", var: "CERT_KEY", val: "<CERT_KEY>", cmd: "certificate key for control-plane join" },
          { cat: "Infra", var: "REGISTRY_PORT", val: "<REGISTRY_PORT>", cmd: "5000" },
        ]}
      />
    </Section>
  );
}
