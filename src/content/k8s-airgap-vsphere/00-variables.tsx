import Section from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import VariablesTable from "@/components/docs/VariablesTable";

export function Section0() {
  return (
    <Section id="variables" num={0} title="Variables">
      <Prose>Fill in your environment values. Each amber-highlighted variable is reused everywhere in the guide.</Prose>
      <VariablesTable
        course="k8s-airgap-vsphere"
        columns={[{ header: "Category", key: "cat" }, { header: "Variable", key: "var" }, { header: "Value", key: "val" }, { header: "Example", key: "cmd" }]}
        rows={[
          { cat: "govC Env", var: "VCENTER_IP", val: "<VCENTER_IP>", cmd: "10.10.10.2" },
          { cat: "govC Env", var: "VCENTER_USER", val: "<VCENTER_USER>", cmd: "administrator@vsphere.local" },
          { cat: "govC Env", var: "VCENTER_PASS", val: "<VCENTER_PASS>", cmd: "********" },
          { cat: "govC Env", var: "DATACENTER", val: "<DATACENTER>", cmd: "LabDC" },
          { cat: "govC Env", var: "CLUSTER", val: "<CLUSTER>", cmd: "LabCluster" },
          { cat: "govC Env", var: "DATASTORE", val: "<DATASTORE>", cmd: "datastore1" },
          { cat: "govC Env", var: "NETWORK", val: "<NETWORK>", cmd: "VM Network" },
          { cat: "govC Env", var: "RHEL_ISO", val: "<RHEL_ISO>", cmd: "rhcsa9.iso" },
          { cat: "govC Env", var: "RHEL_TEMPLATE", val: "<RHEL_TEMPLATE>", cmd: "rhel-template" },
          { cat: "govC Env", var: "PATH_TO_RHEL_ISO", val: "<PATH_TO_RHEL_ISO>", cmd: "/home/user/rhcsa9.iso" },
          { cat: "govC Env", var: "RHEL_ISO_PATH_DATASTORE", val: "<RHEL_ISO_PATH_DATASTORE>", cmd: "[hdd] ISO/rhcsa9.iso" },
          { cat: "govC Env", var: "DISK_SIZE", val: "<DISK_SIZE>", cmd: "100" },
          { cat: "govC Env", var: "TEMPLATE_CPU", val: "<TEMPLATE_CPU>", cmd: "4" },
          { cat: "govC Env", var: "TEMPLATE_RAM", val: "<TEMPLATE_RAM>", cmd: "8192" },
          { cat: "govC Env", var: "VM_FOLDER", val: "<VM_FOLDER>", cmd: "/Datacenter/vm/Kubernetes" },
          { cat: "Node IPs", var: "MASTER_0_IP", val: "<MASTER_0_IP>", cmd: "10.10.10.11 (master1 + infra)" },
          { cat: "Node IPs", var: "MASTER_1_IP", val: "<MASTER_1_IP>", cmd: "10.10.10.12" },
          { cat: "Node IPs", var: "MASTER_2_IP", val: "<MASTER_2_IP>", cmd: "10.10.10.13" },
          { cat: "Node IPs", var: "WORKER_0_IP", val: "<WORKER_0_IP>", cmd: "10.10.10.21" },
          { cat: "Node IPs", var: "WORKER_1_IP", val: "<WORKER_1_IP>", cmd: "10.10.10.22" },
          { cat: "Node IPs", var: "WORKER_2_IP", val: "<WORKER_2_IP>", cmd: "10.10.10.23" },
          { cat: "Node IPs", var: "GATEWAY", val: "<GATEWAY>", cmd: "10.10.10.1" },
          { cat: "Node IPs", var: "DNS_SERVERS", val: "<DNS_SERVERS>", cmd: "10.10.10.1" },
          { cat: "Network", var: "VIP", val: "<VIP>", cmd: "10.10.10.10 (kube-vip API endpoint)" },
          { cat: "Network", var: "METALLB_POOL_START", val: "<METALLB_POOL_START>", cmd: "10.10.10.90" },
          { cat: "Network", var: "METALLB_POOL_END", val: "<METALLB_POOL_END>", cmd: "10.10.10.95" },
          { cat: "Network", var: "INGRESS_IP", val: "<INGRESS_IP>", cmd: "10.10.10.90 (NGINX Ingress LB)" },
          { cat: "Network", var: "SUBNET_MASK", val: "<SUBNET_MASK>", cmd: "255.255.255.0" },
          { cat: "Network", var: "DOMAIN", val: "<DOMAIN>", cmd: "cluster.local" },
          { cat: "Network", var: "POD_CIDR", val: "<POD_CIDR>", cmd: "10.244.0.0/16 (Flannel)" },
          { cat: "Network", var: "SERVICE_CIDR", val: "<SERVICE_CIDR>", cmd: "10.96.0.0/12 (kubeadm default)" },
          { cat: "Versions", var: "K8S_VERSION", val: "<K8S_VERSION>", cmd: "v1.35.0" },
          { cat: "Versions", var: "K8S_MINOR_VERSION", val: "<K8S_MINOR_VERSION>", cmd: "1.35" },
          { cat: "Versions", var: "ETCD_VERSION", val: "<ETCD_VERSION>", cmd: "3.6.6-0 (match your K8S_VERSION)" },
          { cat: "Versions", var: "COREDNS_VERSION", val: "<COREDNS_VERSION>", cmd: "1.13.2 (match your K8S_VERSION)" },
          { cat: "Versions", var: "PAUSE_VERSION", val: "<PAUSE_VERSION>", cmd: "3.10.1 (match your K8S_VERSION)" },
          { cat: "Versions", var: "CONTAINERD_VERSION", val: "<CONTAINERD_VERSION>", cmd: "containerd.io (latest from Docker repo)" },
          { cat: "Versions", var: "KUBE_VIP_VERSION", val: "<KUBE_VIP_VERSION>", cmd: "v0.8.9" },
          { cat: "Versions", var: "FLANNEL_VERSION", val: "<FLANNEL_VERSION>", cmd: "v0.28.7" },
          { cat: "Versions", var: "FLANNEL_CNI_VERSION", val: "<FLANNEL_CNI_VERSION>", cmd: "v1.6.0-flannel1" },
          { cat: "Versions", var: "METALLB_VERSION", val: "<METALLB_VERSION>", cmd: "v0.15.3" },
          { cat: "Versions", var: "INGRESS_NGINX_VERSION", val: "<INGRESS_NGINX_VERSION>", cmd: "v1.15.1" },
          { cat: "Versions", var: "INGRESS_WEBHOOK_VERSION", val: "<INGRESS_WEBHOOK_VERSION>", cmd: "v1.5.1" },
          { cat: "Versions", var: "HELM_VERSION", val: "<HELM_VERSION>", cmd: "v3.17.3" },
          { cat: "Infra", var: "REGISTRY_PORT", val: "<REGISTRY_PORT>", cmd: "5000" },
        ]}
      />
    </Section>
  );
}
