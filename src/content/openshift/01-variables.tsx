import Section from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import VariablesTable from "@/components/docs/VariablesTable";
import Var from "@/components/docs/Var";

export function Section1() {
  return (
    <Section id="variables" num={1} title="Variables">
      <Prose>Fill in your environment values. Each amber-highlighted variable is reused everywhere in the guide.</Prose>
      <Prose>All changeable values are shown in amber. Replace with your environment.</Prose>
      <VariablesTable
        course="openshift-upi-v414"
        columns={[{ header: "Category", key: "cat" }, { header: "Variable", key: "var" }, { header: "Value", key: "val" }, { header: "Example (Command)", key: "cmd" }]}
        rows={[
          { cat: "vSphere", var: "VCENTER_IP", val: "<VCENTER_IP>", cmd: "192.168.1.10" },
          { cat: "vSphere", var: "VCENTER_USER", val: "<VCENTER_USER>", cmd: "administrator@vsphere.local" },
          { cat: "vSphere", var: "VCENTER_PASSWORD", val: "<VCENTER_PASSWORD>", cmd: "P@ssw0rd!" },
          { cat: "vSphere", var: "DATACENTER", val: "<DATACENTER>", cmd: "Datacenter (govc datacenter.info | grep -i \"name:\" | awk '{print $2}')" },
          { cat: "vSphere", var: "CLUSTER", val: "<CLUSTER>", cmd: "Cluster (govc cluster.info | grep -i \"name:\" | awk '{print $2}')" },
          { cat: "vSphere", var: "DATASTORE", val: "<DATASTORE>", cmd: "datastore1 (govc datastore.info | grep -i \"name:\" | awk '{print $2}')" },
          { cat: "vSphere", var: "NETWORK", val: "<NETWORK>", cmd: "VM Network (govc network.info | grep -i \"name:\" | awk '{print $2}')" },
          { cat: "vSphere", var: "VM_FOLDER", val: "<VM_FOLDER>", cmd: "/Datacenter/vm/ocp" },
          { cat: "vSphere", var: "CENTOS_ISO", val: "<CENTOS_ISO>", cmd: "[datastore1] ISOs/CentOS-7-x86_64-Minimal-2009.iso" },
          { cat: "Network", var: "GATEWAY", val: "<GATEWAY>", cmd: "192.168.1.1 (ip route | grep default | awk '{print $3}')" },
          { cat: "Network", var: "SUBNET_MASK", val: "<SUBNET_MASK>", cmd: "255.255.255.0 (ip -4 addr show | grep inet | head -1 | awk '{print $2}' | cut -d/ -f2)" },
          { cat: "Network", var: "DNS1", val: "<DNS1>", cmd: "192.168.1.10 (nmcli dev show | grep DNS)" },
          { cat: "Network", var: "DNS2", val: "<DNS2>", cmd: "8.8.8.8" },
          { cat: "Network", var: "DNS_ADMIN_IP", val: "<DNS_ADMIN_IP>", cmd: "192.168.1.10" },
          { cat: "Network", var: "DOMAIN", val: "<DOMAIN>", cmd: "example.com" },
          { cat: "Network", var: "CLUSTER_NAME", val: "<CLUSTER_NAME>", cmd: "ocp4" },
          { cat: "Network", var: "BASE_DOMAIN", val: "<BASE_DOMAIN>", cmd: "example.com" },
          { cat: "Node IPs", var: "NFS_HAPROXY_IP", val: "<NFS_HAPROXY_IP>", cmd: "192.168.1.20" },
          { cat: "Node IPs", var: "API_IP", val: "<API_IP>", cmd: "192.168.1.100" },
          { cat: "Node IPs", var: "APPS_IP", val: "<APPS_IP>", cmd: "192.168.1.101" },
          { cat: "Node IPs", var: "BOOTSTRAP_IP", val: "<BOOTSTRAP_IP>", cmd: "192.168.1.110" },
          { cat: "Node IPs", var: "MASTER_0_IP", val: "<MASTER_0_IP>", cmd: "192.168.1.111" },
          { cat: "Node IPs", var: "MASTER_1_IP", val: "<MASTER_1_IP>", cmd: "192.168.1.112" },
          { cat: "Node IPs", var: "MASTER_2_IP", val: "<MASTER_2_IP>", cmd: "192.168.1.113" },
          { cat: "Node IPs", var: "WORKER_0_IP", val: "<WORKER_0_IP>", cmd: "192.168.1.114" },
          { cat: "Node IPs", var: "WORKER_1_IP", val: "<WORKER_1_IP>", cmd: "192.168.1.115" },
          { cat: "Node IPs", var: "WSL_IP", val: "<WSL_IP>", cmd: "192.168.1.130" },
          { cat: "Node IPs", var: "NFS_HAPROXY_USER", val: "<NFS_HAPROXY_USER>", cmd: "root" },
          { cat: "VM Names", var: "RHCOS_TEMPLATE", val: "<RHCOS_TEMPLATE>", cmd: "rhcos-4.14.0 (govc find / -type m | grep rhcos | head -1)" },
          { cat: "VM Names", var: "NFS_HAPROXY_VM", val: "<NFS_HAPROXY_VM>", cmd: "nfs-haproxy" },
          { cat: "VM Names", var: "BOOTSTRAP_VM", val: "<BOOTSTRAP_VM>", cmd: "ocp4-bootstrap" },
          { cat: "VM Names", var: "MASTER_PREFIX", val: "<MASTER_PREFIX>", cmd: "ocp4-master" },
          { cat: "VM Names", var: "WORKER_PREFIX", val: "<WORKER_PREFIX>", cmd: "ocp4-worker" },
          { cat: "Credentials", var: "SSH_KEY_PATH", val: "<SSH_KEY_PATH>", cmd: "~/.ssh/openshift (ssh-keygen -t ed25519)" },
          { cat: "Credentials", var: "OCP_ADMIN_PASS", val: "<OCP_ADMIN_PASS>", cmd: "ocp@dmin!23 (htpasswd -nB admin)" },
          { cat: "Credentials", var: "PULL_SECRET", val: "<PULL_SECRET>", cmd: "download from console.redhat.com" },
          { cat: "Paths", var: "OCP4_DIR", val: "<OCP4_DIR>", cmd: "/root/ocp4" },
          { cat: "Paths", var: "NFS_EXPORT", val: "<NFS_EXPORT>", cmd: "/exports" },
          { cat: "Paths", var: "SSH_PUBLIC_KEY", val: "<SSH_PUBLIC_KEY>", cmd: "~/.ssh/openshift.pub (cat ~/.ssh/openshift.pub)" },
        ]}
      />
    </Section>
  );
}
