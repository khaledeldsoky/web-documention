import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import BenefitGrid from "@/components/docs/BenefitCard";
import StepList from "@/components/docs/StepList";
import InfoTable from "@/components/docs/InfoTable";
import VariablesTable from "@/components/docs/VariablesTable";
import Var from "@/components/docs/Var";
import Chip, { ChipRow } from "@/components/docs/Chip";
import Cover from "@/components/docs/Cover";
import type { NavGroup } from "@/components/layout/Sidebar";

export const sidebarGroups: NavGroup[] = [
  {
    icon: "📋",
    label: "Getting Started",
    items: [
      { id: "variables", label: "1. Variables" },
      { id: "prerequisites", label: "2. Prerequisites" },
      { id: "wsl-prep", label: "3. WSL Setup" },
    ],
  },
  {
    icon: "🔌",
    label: "vSphere",
    items: [
      { id: "vsphere-prep", label: "4. vSphere Environment" },
      { id: "nfs-haproxy", label: "5. HAProxy + NFS VM" },
      { id: "ocp-vms", label: "6. OpenShift VMs" },
    ],
  },
  {
    icon: "🚀",
    label: "Installation",
    items: [
      { id: "ignition", label: "7. Generate Ignition Configs" },
      { id: "cluster-install", label: "8. Cluster Install" },
      { id: "postinstall", label: "9. Post-Install" },
    ],
  },
  {
    icon: "⚙️",
    label: "Operations",
    items: [
      { id: "cleanup", label: "10. Cleanup" },
      { id: "troubleshooting", label: "11. Troubleshooting" },
      { id: "tests", label: "12. Verification Tests" },
    ],
  },
];

export default function OpenShiftContent() {
  return (
    <>
      <Cover
        breadcrumb="devops / openshift / upi"
        title="OpenShift 4.14 UPI on vSphere"
        highlight="UPI"
        sub="User Provisioned Infrastructure — HAProxy, NFS, RHCOS on vSphere"
        chips={[
          { label: "OpenShift 4.14", color: "blue" },
          { label: "vSphere UPI", color: "green" },
          { label: "HAProxy + NFS", color: "amber" },
          { label: "govc", color: "red" },
        ]}
      />

      {/* ===== Section 1: Variables Table ===== */}
      <Section id="variables" num={1} title="Variables">
        <Prose>All changeable values are shown in amber. Replace with your environment.</Prose>
        <VariablesTable
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

      {/* ===== Section 2: Prerequisites ===== */}
      <Section id="prerequisites" num={2} title="Prerequisites">
        {/* --- 2.1: Hardware Requirements --- */}
        <Subsection title="Hardware Requirements">
          <InfoTable
            columns={[{ header: "Node", key: "node" }, { header: "vCPU", key: "vcpu" }, { header: "RAM", key: "ram" }, { header: "Disk", key: "disk" }, { header: "OS", key: "os" }]}
            rows={[
              { node: "nfs-haproxy", vcpu: "4", ram: "8 GB", disk: "40 GB + 100 GB (NFS)", os: "CentOS 9" },
              { node: "bootstrap", vcpu: "4", ram: "16 GB", disk: "120 GB", os: "RHCOS" },
              { node: "master (×3)", vcpu: "4", ram: "16 GB", disk: "120 GB", os: "RHCOS" },
              { node: "worker (×2)", vcpu: "2", ram: "8 GB", disk: "120 GB", os: "RHCOS" },
            ]}
          />
        </Subsection>

        {/* --- 2.2: Software (on WSL) --- */}
        <Subsection title="Software (on WSL)">
          <StepList
            steps={[
              { title: "govc", desc: "VMware CLI for vSphere management" },
              { title: "openshift-install", desc: "OpenShift 4.14 installer binary" },
              { title: "oc", desc: "OpenShift CLI" },
              { title: "SSH key", desc: "ed25519 key at ~/.ssh/openshift" },
            ]}
          />
        </Subsection>

        {/* --- 2.3: DNS Records --- */}
        <Subsection title="DNS Records">
          <Prose>These records must exist in your external DNS before starting.</Prose>
          <table className="info-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>api.<Var name="DOMAIN" /></td>
                <td>A</td>
                <td><Var name="API_IP" /></td>
              </tr>
              <tr>
                <td>api-int.<Var name="DOMAIN" /></td>
                <td>A</td>
                <td><Var name="API_IP" /></td>
              </tr>
              <tr>
                <td>*.apps.<Var name="DOMAIN" /></td>
                <td>A</td>
                <td><Var name="APPS_IP" /></td>
              </tr>
              <tr>
                <td>bootstrap.<Var name="DOMAIN" /></td>
                <td>A</td>
                <td><Var name="BOOTSTRAP_IP" /></td>
              </tr>
              <tr>
                <td>master-0.<Var name="DOMAIN" /></td>
                <td>A</td>
                <td><Var name="MASTER_0_IP" /></td>
              </tr>
              <tr>
                <td>master-1.<Var name="DOMAIN" /></td>
                <td>A</td>
                <td><Var name="MASTER_1_IP" /></td>
              </tr>
              <tr>
                <td>master-2.<Var name="DOMAIN" /></td>
                <td>A</td>
                <td><Var name="MASTER_2_IP" /></td>
              </tr>
              <tr>
                <td>worker-0.<Var name="DOMAIN" /></td>
                <td>A</td>
                <td><Var name="WORKER_0_IP" /></td>
              </tr>
              <tr>
                <td>worker-1.<Var name="DOMAIN" /></td>
                <td>A</td>
                <td><Var name="WORKER_1_IP" /></td>
              </tr>
            </tbody>
          </table>
          <Callout variant="warn">
            Also add reverse DNS (PTR) records if possible. OpenShift uses reverse DNS for node hostname resolution.
          </Callout>
        </Subsection>

        {/* --- 2.4: Verify vSphere Values --- */}
        <Subsection title="Verify vSphere Values with govc">
          <Prose>Run these from WSL to confirm your vSphere environment is correct.</Prose>
          <CodeBlock lang="bash" label="WSL — Verify vCenter">
{`# Set govc env vars
export GOVC_URL=<VCENTER_IP>
export GOVC_USERNAME=<VCENTER_USER>
export GOVC_PASSWORD=<VCENTER_PASSWORD>
export GOVC_INSECURE=true

# Test connection
govc about
govc datacenter.info
govc cluster.info
govc datastore.info
govc network.info`}
          </CodeBlock>

          <VerifyBlock>
            <p><code>govc about</code> returns vCenter version and build.</p>
            <p>All <code>govc *.info</code> commands return the expected names.</p>
          </VerifyBlock>
        </Subsection>
      </Section>

      {/* ===== Section 3: WSL Setup ===== */}
      <Section id="wsl-prep" num={3} title="WSL Setup">
        <Prose>All commands in this section run on <strong>WSL</strong>.</Prose>

        {/* --- 3.1: Install govc --- */}
        <Subsection title="Install govc">
          <CodeBlock lang="bash" label="WSL">
{`curl -sL https://github.com/vmware/govmomi/releases/latest/download/govc_$(uname -s)_$(uname -m).tar.gz | tar -C /usr/local/bin -xz govc
chmod +x /usr/local/bin/govc
govc version`}
          </CodeBlock>
        </Subsection>

        {/* --- 3.2: Download OpenShift Installer & CLI --- */}
        <Subsection title="Download OpenShift Installer & CLI">
          <CodeBlock lang="bash" label="WSL">
{`export OCP4_DIR=<OCP4_DIR>
mkdir -p $OCP4_DIR
cd $OCP4_DIR
mkdir -p $OCP4_DIR/{config,rhcos,ignition,scripts}
wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/4.14.0/openshift-client-linux.tar.gz
wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/4.14.0/openshift-install-linux.tar.gz
sudo tar xzf openshift-client-linux.tar.gz -C /usr/local/bin/
sudo tar xzf openshift-install-linux.tar.gz -C /usr/local/bin/
sudo chmod +x /usr/local/bin/{oc,kubectl,openshift-install}
openshift-install version
oc version`}
          </CodeBlock>

          <VerifyBlock>
            <p><code>openshift-install version</code> shows <code>4.14.x</code></p>
            <p><code>oc version</code> shows client version.</p>
          </VerifyBlock>
        </Subsection>

        {/* --- 3.3: Generate SSH Key --- */}
        <Subsection title="Generate SSH Key">
          <CodeBlock lang="bash" label="WSL">
{`ssh-keygen -t ed25519 -f ~/.ssh/openshift -N "" -C "khaled@ocp4"
cat ~/.ssh/openshift.pub`}
          </CodeBlock>

          <VerifyBlock>
            <p>Files exist: <code>~/.ssh/openshift</code> and <code>~/.ssh/openshift.pub</code></p>
          </VerifyBlock>
        </Subsection>

        {/* --- 3.4: Create setup-env.sh --- */}
        <Subsection title="Create setup-env.sh">
          <CodeBlock lang="bash" label="WSL — $OCP4_DIR/setup-env.sh">
{`#!/usr/bin/env bash
export GOVC_URL="<VCENTER_IP>"
export GOVC_USERNAME="<VCENTER_USER>"
export GOVC_PASSWORD="<VCENTER_PASSWORD>"
export GOVC_DATACENTER="<DATACENTER>"
export GOVC_CLUSTER="<CLUSTER>"
export GOVC_DATASTORE="<DATASTORE>"
export GOVC_NETWORK="<NETWORK>"
export GOVC_INSECURE="true"
export GOVC_FOLDER="<VM_FOLDER>"
export OCP4_DIR="<OCP4_DIR>"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/openshift`}
          </CodeBlock>

          <Callout variant="info">
            Always run <code>source $OCP4_DIR/setup-env.sh</code> at the start of each session.
          </Callout>
        </Subsection>
      </Section>

      {/* ===== Section 4: vSphere Environment ===== */}
      <Section id="vsphere-prep" num={4} title="vSphere Environment">
        {/* --- 4.1: Download RHCOS OVA --- */}
        <Subsection title="Download RHCOS OVA">
          <CodeBlock lang="bash" label="WSL">
{`export RHCOS_VERSION=4.14.0
 cd $OCP4_DIR/rhcos
 wget https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/4.14/\${RHCOS_VERSION}/rhcos-\${RHCOS_VERSION}-x86_64-vmware.x86_64.ova
 sha256sum rhcos-\${RHCOS_VERSION}-x86_64-vmware.x86_64.ova`}
          </CodeBlock>
        </Subsection>

        {/* --- 4.2: Import RHCOS OVA as Template --- */}
        <Subsection title="Import RHCOS OVA as Template">
          <CodeBlock lang="bash" label="WSL">
{`govc import.ova \\
  -name <RHCOS_TEMPLATE> \\
  -ds <DATASTORE> \\
  -pool /<DATACENTER>/host/<CLUSTER>/Resources \\
  -folder /<DATACENTER>/vm/ \\
  -net "<NETWORK>" \\
  $OCP4_DIR/rhcos/rhcos-4.14.0-x86_64-vmware.x86_64.ova

govc vm.markastemplate <RHCOS_TEMPLATE>`}
          </CodeBlock>
          <VerifyBlock>
            <p><code>{'govc vm.info '}<Var name="RHCOS_TEMPLATE" /></code> shows the VM as a template.</p>
          </VerifyBlock>
        </Subsection>
      </Section>

      {/* ===== Section 5: HAProxy + NFS VM ===== */}
      <Section id="nfs-haproxy" num={5} title="HAProxy + NFS VM">
        {/* --- 5.1: Create VM from ISO --- */}
        <Subsection title="Create VM from ISO">
          <CodeBlock lang="bash" label="WSL">
{`govc vm.create \\
  -m 8192 -c 4 \\
  -disk "40G" \\
  -disk.controller pvscsi \\
  -net "<NETWORK>" \\
  -pool /<DATACENTER>/host/<CLUSTER>/Resources \\
  -folder /<DATACENTER>/vm/ \\
  -on=false \\
  <NFS_HAPROXY_VM>

govc device.cdrom.add -vm <NFS_HAPROXY_VM>
govc vm.dvd.insert \\
  -vm <NFS_HAPROXY_VM> \\
  -ds <DATASTORE> \\
  <CENTOS_ISO>
govc vm.disk.create \\
  -vm <NFS_HAPROXY_VM> \\
  -name <NFS_HAPROXY_VM>/nfs-data \\
  -size "100G" -ds <DATASTORE>
govc vm.power -on <NFS_HAPROXY_VM>
govc vm.console <NFS_HAPROXY_VM>`}
          </CodeBlock>

          <Callout variant="warn">
            Open the console URL in a browser to install CentOS 9 manually. Set hostname <code>nfs-haproxy.<Var name="DOMAIN" /></code> and user <code>khaled</code>.
          </Callout>
        </Subsection>

        {/* --- 5.2: Configure Static IP --- */}
        <Subsection title="Configure Static IP">
          <Prose>Run on the <strong>nfs-haproxy VM</strong> via SSH.</Prose>

          <CodeBlock lang="bash" label="nfs-haproxy">
{`ssh -i ~/.ssh/openshift <NFS_HAPROXY_USER>@<NFS_HAPROXY_IP>
sudo nmcli con mod ens32 \\
  ipv4.addresses <NFS_HAPROXY_IP>/16 \\
  ipv4.gateway <GATEWAY> \\
  ipv4.dns <DNS1> \\
  ipv4.dns-search <DOMAIN> \\
  ipv4.method manual
sudo nmcli con down ens32 && sudo nmcli con up ens32
ip addr show ens32`}
          </CodeBlock>
        </Subsection>

        {/* --- 5.3: Install & Configure HAProxy --- */}
        {/* HAProxy runs on the nfs-haproxy VM, load-balancing ports 6443, 22623, 443, 80 to cluster nodes */}
        <Subsection title="Install & Configure HAProxy">
          <Prose>Open the HAProxy config file with <code>vim /etc/haproxy/haproxy.cfg</code> and replace its content.</Prose>
          <CodeBlock lang="ini" label="nfs-haproxy — /etc/haproxy/haproxy.cfg">
{`global
    log /dev/log local0
    chroot /var/lib/haproxy
    # pidfile /var/run/haproxy.pid
    stats socket /var/lib/haproxy/stats mode 660 level admin expose-fd listeners
    user haproxy
    group haproxy
    daemon

defaults
    log global
    mode tcp
    option tcplog
    retries 3
    timeout connect 10s
    timeout client 30s
    timeout server 30s
    timeout check 10s

frontend openshift-api
    bind *:6443
    default_backend openshift-api

backend openshift-api
    balance source
    server bootstrap <BOOTSTRAP_IP>:6443 check
    server master-0 <MASTER_0_IP>:6443 check
    server master-1 <MASTER_1_IP>:6443 check
    server master-2 <MASTER_2_IP>:6443 check

frontend mcs
    bind *:22623
    default_backend mcs

backend mcs
    balance source
    server bootstrap <BOOTSTRAP_IP>:22623 check
    server master-0 <MASTER_0_IP>:22623 check
    server master-1 <MASTER_1_IP>:22623 check
    server master-2 <MASTER_2_IP>:22623 check

frontend openshift-ingress
    bind *:443
    bind *:80
    default_backend openshift-ingress

backend openshift-ingress
    balance source
    server worker-0 <WORKER_0_IP>:443 check
    server worker-1 <WORKER_1_IP>:443 check`}
          </CodeBlock>

          <CodeBlock lang="bash" label="nfs-haproxy — Apply config">
{`sudo dnf install -y haproxy
sudo mkdir -p /var/lib/haproxy && sudo chown haproxy:haproxy /var/lib/haproxy
sudo setsebool -P haproxy_connect_any 1
sudo haproxy -c -f /etc/haproxy/haproxy.cfg
sudo systemctl enable --now haproxy
sudo ss -tlnp | grep -E ':(6443|22623|443|80)'`}
          </CodeBlock>

          <VerifyBlock>
            <p><code>sudo haproxy -c -f /etc/haproxy/haproxy.cfg</code> — <code>Configuration file is valid</code></p>
            <p><code>sudo ss -tlnp | grep haproxy</code> shows 4 listening ports.</p>
          </VerifyBlock>
        </Subsection>

        {/* --- 5.4: Install & Configure Firewall --- */}
        <Subsection title="Install & Configure Firewall">
          <CodeBlock lang="bash" label="nfs-haproxy">
{`sudo dnf install -y firewalld
sudo systemctl enable --now firewalld
sudo firewall-cmd --permanent --add-service={http,https,nfs,rpc-bind,mountd}
sudo firewall-cmd --permanent --add-port={6443/tcp,22623/tcp}
sudo firewall-cmd --reload`}
          </CodeBlock>
        </Subsection>

        {/* --- 5.5: Install & Configure NFS Export --- */}
        <Subsection title="Install & Configure NFS Export">
          <CodeBlock lang="bash" label="nfs-haproxy">
{`sudo dnf install -y nfs-utils
sudo mkdir -p <NFS_EXPORT>
sudo chown -R nobody:nobody <NFS_EXPORT>
sudo chmod 777 <NFS_EXPORT>
sudo mkfs.xfs /dev/sdb
sudo mount /dev/sdb <NFS_EXPORT>
echo "/dev/sdb <NFS_EXPORT> xfs defaults 0 0" | sudo tee -a /etc/fstab
echo "<NFS_EXPORT> *(rw,sync,no_subtree_check,no_root_squash)" | sudo tee -a /etc/exports
sudo exportfs -r
sudo systemctl enable --now nfs-server`}
          </CodeBlock>

          <VerifyBlock>
            <p><code>showmount -e localhost</code> — shows <code><Var name="NFS_EXPORT" /> *</code></p>
          </VerifyBlock>
        </Subsection>

        {/* --- 5.6: SELinux Configuration --- */}
        {/* Open ports 6443/22623 for haproxy_port_t so HAProxy can bind */}
        <Subsection title="SELinux Configuration">
          <CodeBlock lang="bash" label="nfs-haproxy">
{`sudo dnf install -y policycoreutils-python-utils
sudo setsebool -P nfs_export_all_rw on
sudo semanage port -a -t haproxy_port_t -p tcp 6443
sudo semanage port -a -t haproxy_port_t -p tcp 22623`}
          </CodeBlock>
        </Subsection>

        {/* --- 5.7: Add API & Ingress VIPs --- */}
        <Subsection title="Add API & Ingress VIPs">
          <Prose>
            The API VIP and Ingress VIP must exist as IPs on the HAProxy VM so the cluster can reach them.
            Add them as secondary addresses on <code>ens32</code>.
          </Prose>

          <CodeBlock lang="bash" label="nfs-haproxy">
{`sudo ip addr add <API_IP>/16 dev ens32
sudo ip addr add <APPS_IP>/16 dev ens32
sudo nmcli con mod ens32 +ipv4.addresses <API_IP>/16
sudo nmcli con mod ens32 +ipv4.addresses <APPS_IP>/16
sudo nmcli con down ens32 && sudo nmcli con up ens32`}
          </CodeBlock>

          <VerifyBlock>
            <p><code>ip addr show ens32 | grep <Var name="API_IP" /></code> shows both VIPs on the interface.</p>
          </VerifyBlock>
        </Subsection>
      </Section>

      {/* ===== Section 6: OpenShift VMs ===== */}
      <Section id="ocp-vms" num={6} title="OpenShift VMs">
        <Prose>All commands run on <strong>WSL</strong>. Do not power on yet — ignition must be injected first (Section 7).</Prose>

        {/* --- 6.1: Clone Bootstrap --- */}
        <Subsection title="Clone Bootstrap">
          <CodeBlock lang="bash" label="WSL">
{`govc vm.clone \\
  -vm <RHCOS_TEMPLATE> \\
  -net "<NETWORK>" \\
  -net.adapter vmxnet3 \\
  -folder /<DATACENTER>/vm/ \\
  -pool /<DATACENTER>/host/<CLUSTER>/Resources \\
  -ds <DATASTORE> \\
  -on=false \\
  <BOOTSTRAP_VM>

govc vm.change -vm <BOOTSTRAP_VM> -m 16384 -c 4
govc vm.disk.change -vm <BOOTSTRAP_VM> -disk.label "Hard disk 1" -size "120G"`}
          </CodeBlock>
        </Subsection>

        {/* --- 6.2: Clone Master Nodes --- */}
        <Subsection title="Clone Master Nodes">
          <CodeBlock lang="bash" label="WSL">
{`for i in 0 1 2; do
  govc vm.clone \\
    -vm <RHCOS_TEMPLATE> \\
    -net "<NETWORK>" \\
    -net.adapter vmxnet3 \\
    -folder /<DATACENTER>/vm/ \\
    -pool /<DATACENTER>/host/<CLUSTER>/Resources \\
    -ds <DATASTORE> \\
    -on=false \\
    <MASTER_PREFIX>-$i
  govc vm.change -vm <MASTER_PREFIX>-$i -m 16384 -c 4
  govc vm.disk.change -vm <MASTER_PREFIX>-$i -disk.label "Hard disk 1" -size "120G"
done`}
          </CodeBlock>
        </Subsection>

        {/* --- 6.3: Clone Worker Nodes --- */}
        <Subsection title="Clone Worker Nodes">
          <CodeBlock lang="bash" label="WSL">
{`for i in 0 1; do
  govc vm.clone \\
    -vm <RHCOS_TEMPLATE> \\
    -net "<NETWORK>" \\
    -net.adapter vmxnet3 \\
    -folder /<DATACENTER>/vm/ \\
    -pool /<DATACENTER>/host/<CLUSTER>/Resources \\
    -ds <DATASTORE> \\
    -on=false \\
    <WORKER_PREFIX>-$i
  govc vm.change -vm <WORKER_PREFIX>-$i -m 8192 -c 2
  govc vm.disk.change -vm <WORKER_PREFIX>-$i -disk.label "Hard disk 1" -size "120G"
done`}
          </CodeBlock>

          <VerifyBlock>
            <CodeBlock lang="bash" label="WSL">
{`govc ls /<DATACENTER>/vm/{<BOOTSTRAP_VM>,<MASTER_PREFIX>-{0,1,2},<WORKER_PREFIX>-{0,1}}`}
            </CodeBlock>
            <p>6 VMs listed.</p>
          </VerifyBlock>
        </Subsection>

        {/* --- 6.4: Set Static IPs via Afterburn --- */}
        {/* Afterburn reads guestinfo keys at boot to configure networking before ignition runs */}
        <Subsection title="Set Static IPs via Afterburn">
          <Prose>
            Without a DHCP server, each node must get its static IP via <code>guestinfo.afterburn.initrd.network-kargs</code>.
            This is set <strong>before</strong> power-on using <code>govc vm.change -e</code>.
            The format is <code>ip=&lt;IP&gt;::&lt;GATEWAY&gt;:&lt;SUBNET_MASK&gt;:&lt;FQDN&gt;:none</code>.
          </Prose>

          <CodeBlock lang="bash" label="WSL">
{`# Bootstrap
govc vm.change -vm <BOOTSTRAP_VM> \\
  -e "guestinfo.afterburn.initrd.network-kargs=ip=<BOOTSTRAP_IP>::<GATEWAY>:<SUBNET_MASK>:<BOOTSTRAP_VM>.<DOMAIN>::none:nameserver=<DNS1> nameserver=<DNS2>"

# Masters
for i in 0 1 2; do
  case $i in
    0) IP=<MASTER_0_IP>;;
    1) IP=<MASTER_1_IP>;;
    2) IP=<MASTER_2_IP>;;
  esac
  govc vm.change -vm <MASTER_PREFIX>-$i \\
    -e "guestinfo.afterburn.initrd.network-kargs=ip=$IP::<GATEWAY>:<SUBNET_MASK>:<MASTER_PREFIX>-$i.<DOMAIN>::none:nameserver=<DNS1> nameserver=<DNS2>"
done

# Workers
for i in 0 1; do
  case $i in
    0) IP=<WORKER_0_IP>;;
    1) IP=<WORKER_1_IP>;;
  esac
  govc vm.change -vm <WORKER_PREFIX>-$i \\
    -e "guestinfo.afterburn.initrd.network-kargs=ip=$IP::<GATEWAY>:<SUBNET_MASK>:<WORKER_PREFIX>-$i.<DOMAIN>::none:nameserver=<DNS1> nameserver=<DNS2>"
done`}
          </CodeBlock>

          <VerifyBlock>
            <p><code>govc vm.info <Var name="BOOTSTRAP_VM" /> | grep afterburn</code> shows the guestinfo key.</p>
          </VerifyBlock>
        </Subsection>
      </Section>

      {/* ===== Section 7: Generate Ignition Configs ===== */}
      <Section id="ignition" num={7} title="Generate Ignition Configs">
        <Prose>All commands on <strong>WSL</strong>.</Prose>

        {/* --- 7.1: Create install-config.yaml --- */}
        <Subsection title="Create install-config.yaml">
          <CodeBlock lang="yaml" label="WSL — $OCP4_DIR/config/install-config.yaml">
{`apiVersion: v1
baseDomain: <BASE_DOMAIN>
metadata:
  name: <CLUSTER_NAME>
platform:
  vsphere:
    vcenters:
      - server: <VCENTER_IP>
        user: <VCENTER_USER>
        password: <VCENTER_PASSWORD>
        datacenters:
          - <DATACENTER>
    failureDomains:
      - name: "fd1"
        server: <VCENTER_IP>
        region: "region1"
        zone: "zone1"
        topology:
          datacenter: <DATACENTER>
          computeCluster: /<DATACENTER>/host/<CLUSTER>
          resourcePool: /<DATACENTER>/host/<CLUSTER>/Resources
          datastore: /<DATACENTER>/datastore/<DATASTORE>
          networks:
            - <NETWORK>
          folder: /<DATACENTER>/vm/
    apiVIP: <API_IP>
    ingressVIP: <APPS_IP>
networking:
  clusterNetwork:
    - cidr: 10.128.0.0/14
      hostPrefix: 23
  serviceNetwork:
    - 172.30.0.0/16
  networkType: OVNKubernetes
compute:
  - name: worker
    replicas: 2
controlPlane:
  name: master
  replicas: 3
pullSecret: '<PULL_SECRET>'
sshKey: '<SSH_PUBLIC_KEY>'`}
          </CodeBlock>

          <Callout variant="danger">
            Download the pull secret from <code>console.redhat.com</code>. For the SSH key, run <code>cat ~/.ssh/openshift.pub</code>. Wrap both values in single quotes.
          </Callout>
        </Subsection>

        {/* --- 7.2: Generate Manifests & Ignition --- */}
        <Subsection title="Generate Manifests & Ignition">
          <CodeBlock lang="bash" label="WSL">
{`openshift-install create manifests --dir=$OCP4_DIR/config
openshift-install create ignition-configs --dir=$OCP4_DIR/config
ls $OCP4_DIR/config/*.ign`}
          </CodeBlock>

          <VerifyBlock>
            <p>Three <code>.ign</code> files exist: <code>bootstrap.ign</code>, <code>master.ign</code>, <code>worker.ign</code></p>
          </VerifyBlock>
        </Subsection>

        {/* --- 7.3: Inject Ignition via pyVmomi --- */}
        {/* Reads .ign files, base64-encodes, and injects into all 6 VMs via guestinfo.ignition.config.data — no HTTP server needed */}
        <Subsection title="Inject Ignition via pyVmomi">
          <Prose>Use this Python script to inject ignition into all 6 VMs directly via the vSphere API.</Prose>

          <Callout variant="warn">
            This requires <code>pyVmomi</code> — install via <code>pip install pyVmomi</code>.
          </Callout>

          <CodeBlock lang="bash" label="WSL — requires pyVmomi">
{`python3 -c "
import base64, ssl
from pyVim.connect import SmartConnect, Disconnect
from pyVmomi import vim

context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
context.check_hostname = False
context.verify_mode = ssl.CERT_NONE

si = SmartConnect(
    host='<VCENTER_IP>',
    user='<VCENTER_USER>',
    pwd='<VCENTER_PASSWORD>',
    sslContext=context
)
content = si.RetrieveContent()

vms = {
    '<BOOTSTRAP_VM>':             '\$OCP4_DIR/config/bootstrap.ign',
    '<MASTER_PREFIX>-0': '\$OCP4_DIR/config/master.ign',
    '<MASTER_PREFIX>-1': '\$OCP4_DIR/config/master.ign',
    '<MASTER_PREFIX>-2': '\$OCP4_DIR/config/master.ign',
    '<WORKER_PREFIX>-0': '\$OCP4_DIR/config/worker.ign',
    '<WORKER_PREFIX>-1': '\$OCP4_DIR/config/worker.ign',
}

view = content.viewManager.CreateContainerView(
    content.rootFolder, [vim.VirtualMachine], True
)

for vm_name, ign_path in vms.items():
    vm = next((v for v in view.view if v.name == vm_name), None)
    if not vm:
        print(f'Skipping {vm_name} — not found')
        continue
    with open(ign_path, 'rb') as f:
        ign_data = base64.b64encode(f.read()).decode('utf-8')
    spec = vim.vm.ConfigSpec()
    spec.extraConfig = [
        vim.option.OptionValue(key='guestinfo.ignition.config.data', value=ign_data),
        vim.option.OptionValue(key='guestinfo.ignition.config.data.encoding', value='base64')
    ]
    task = vm.ReconfigVM_Task(spec)
    while task.info.state == vim.TaskInfo.State.running:
        pass
    print(f'{vm_name}: {task.info.state}')
Disconnect(si)
"`}
          </CodeBlock>
        </Subsection>
      </Section>

      {/* ===== Section 8: Cluster Install ===== */}
      <Section id="cluster-install" num={8} title="Cluster Install">
        {/* --- 8.1: Power On Bootstrap --- */}
        <Subsection title="Power On Bootstrap">
          <CodeBlock lang="bash" label="WSL">
{`govc vm.power -on <BOOTSTRAP_VM>
openshift-install wait-for bootstrap-complete \\
  --dir=$OCP4_DIR/config --log-level debug`}
          </CodeBlock>

          <Callout variant="info">
            This typically takes <strong>10-15 minutes</strong>. Ends with <code>It is now safe to remove the bootstrap resources</code>.
          </Callout>
        </Subsection>

        {/* --- 8.2: Power On Masters --- */}
        <Subsection title="Power On Masters">
          <CodeBlock lang="bash" label="WSL">
{`for i in 0 1 2; do
  govc vm.power -on <MASTER_PREFIX>-$i
  echo "master-$i powered on"
done`}
          </CodeBlock>
        </Subsection>

        {/* --- 8.3: Approve CSRs --- */}
        <Subsection title="Approve CSRs">
          <CodeBlock lang="bash" label="WSL">
{`export KUBECONFIG=$OCP4_DIR/config/auth/kubeconfig
oc get csr -o go-template='{{range .items}}{{if not .status}}{{.metadata.name}}{{"\\n"}}{{end}}{{end}}' | xargs oc adm certificate approve
watch -n 10 'oc get csr -o go-template="{{range .items}}{{if not .status}}{{.metadata.name}} {{end}}{{end}}" | xargs -r oc adm certificate approve'`}
          </CodeBlock>

          <VerifyBlock>
            <p><code>oc get nodes</code> shows masters as <code>Ready</code></p>
          </VerifyBlock>
        </Subsection>

        {/* --- 8.4: Power On Workers --- */}
        <Subsection title="Power On Workers">
          <CodeBlock lang="bash" label="WSL">
{`govc vm.power -on <WORKER_PREFIX>-0
govc vm.power -on <WORKER_PREFIX>-1
oc get csr -o go-template='{{range .items}}{{if not .status}}{{.metadata.name}}{{"\\n"}}{{end}}{{end}}' | xargs oc adm certificate approve`}
          </CodeBlock>
        </Subsection>

        {/* --- 8.5: Wait for Install Complete --- */}
        <Subsection title="Wait for Install Complete">
          <CodeBlock lang="bash" label="WSL">
{`openshift-install wait-for install-complete \\
  --dir=$OCP4_DIR/config --log-level debug`}
          </CodeBlock>

          <VerifyBlock>
            <p>Output ends with web console URL and admin credentials.</p>
            <p><code>oc get nodes</code> shows all 5 nodes (3 masters + 2 workers) as <code>Ready</code></p>
          </VerifyBlock>
        </Subsection>

        {/* --- 8.6: Remove Bootstrap VM + HAProxy entry --- */}
        <Subsection title="Remove Bootstrap">
          <Prose>Destroy the bootstrap VM, then remove it from HAProxy on the nfs-haproxy node.</Prose>

          <CodeBlock lang="bash" label="WSL — Destroy bootstrap VM">
{`govc vm.power -off <BOOTSTRAP_VM>
govc vm.destroy <BOOTSTRAP_VM>`}
          </CodeBlock>

          <CodeBlock lang="bash" label="WSL — Remove bootstrap from HAProxy">
{`ssh -i ~/.ssh/openshift <NFS_HAPROXY_USER>@<NFS_HAPROXY_IP>
sudo sed -i '/server bootstrap/d' /etc/haproxy/haproxy.cfg
sudo systemctl restart haproxy`}
          </CodeBlock>
        </Subsection>
      </Section>

      {/* ===== Section 9: Post-Install ===== */}
      <Section id="postinstall" num={9} title="Post-Install">
        {/* --- 9.1: Configure Image Registry (NFS-backed) --- */}
        <Subsection title="Configure Image Registry (NFS-backed)">
          <CodeBlock lang="bash" label="WSL">
{`oc patch configs.imageregistry.operator.openshift.io cluster \\
  --type merge \\
  --patch '{"spec":{"managementState":"Managed","storage":{"nfs":{"server":"<NFS_HAPROXY_IP>","path":"<NFS_EXPORT>"}}}}'`}
          </CodeBlock>

          <VerifyBlock>
            <p><code>oc get clusteroperator image-registry</code> shows <code>Available=True</code></p>
          </VerifyBlock>
        </Subsection>

        {/* --- 9.2: Verify All Operators --- */}
        <Subsection title="Verify All Operators">
          <CodeBlock lang="bash" label="WSL">
{`oc get clusteroperators
oc get clusterversion
oc get nodes -o wide
oc get pods --all-namespaces`}
          </CodeBlock>

          <VerifyBlock>
            <p><code>oc get clusterversion</code> shows <code>4.14.x</code> with <code>Available=True</code></p>
            <p>All operators show <code>True / False / False</code> (Available / Degraded / Progressing)</p>
          </VerifyBlock>
        </Subsection>

        {/* --- 9.3: Access the Cluster --- */}
        <Subsection title="Access the Cluster">
          <CodeBlock lang="bash" label="WSL">
{`cat $OCP4_DIR/config/auth/kubeadmin-password
echo "https://console-openshift-console.apps.<DOMAIN>"
oc login -u kubeadmin -p "$(cat $OCP4_DIR/config/auth/kubeadmin-password)" \\
  https://api.<DOMAIN>:6443`}
          </CodeBlock>
        </Subsection>
      </Section>

      {/* ===== Section 10: Cleanup ===== */}
      <Section id="cleanup" num={10} title="Cleanup">
        {/* Cleanup steps won't destroy the nfs-haproxy VM — only cluster resources */}
        <Prose>
          Remove the cluster as if it never existed. Steps marked <em>optional</em> can be skipped if you plan to rebuild.
          All commands on <strong>WSL</strong> unless labeled otherwise.
        </Prose>

        <Subsection title="10.1 WSL Local Files">
          <Prose>Remove cluster-specific generated files. Keep reusable binaries.</Prose>

          <CodeBlock lang="bash" label="WSL">
{`rm -rf $OCP4_DIR/config/*
find $OCP4_DIR/config -mindepth 1 -delete
rm -rf $OCP4_DIR/ignition/*
find $OCP4_DIR/ignition -mindepth 1 -delete
# rm -rf $OCP4_DIR/rhcos/
# rm -f $OCP4_DIR/openshift-client-linux.tar.gz
# rm -f $OCP4_DIR/openshift-install-linux.tar.gz`}
          </CodeBlock>
        </Subsection>

        {/* --- 10.2: nfs-haproxy Services --- */}
        <Subsection title="10.2 nfs-haproxy Services">
          <Prose>Only needed if keeping the nfs-haproxy VM. If you destroy the VM, skip this step.</Prose>

          <Prose>SSH into the nfs-haproxy VM then run the commands below:</Prose>

          <CodeBlock lang="bash" label="WSL — SSH into nfs-haproxy">
{`ssh -i ~/.ssh/openshift <NFS_HAPROXY_USER>@<NFS_HAPROXY_IP>

sudo systemctl disable --now haproxy nfs-server firewalld
sudo rm -f /etc/haproxy/haproxy.cfg
sudo rm -f /etc/exports
sudo semanage port -d -t haproxy_port_t -p tcp 6443 2>/dev/null || true
sudo semanage port -d -t haproxy_port_t -p tcp 22623 2>/dev/null || true
sudo nmcli con mod ens32 -ipv4.addresses <API_IP>/16
sudo nmcli con mod ens32 -ipv4.addresses <APPS_IP>/16
sudo nmcli con down ens32 && sudo nmcli con up ens32`}
          </CodeBlock>
        </Subsection>

        {/* --- 10.3: Virtual Machines --- */}
        <Subsection title="10.3 Virtual Machines">
          <Prose>Destroy cluster VMs. The RHCOS template and nfs-haproxy are optional to keep for future installs.</Prose>

          <CodeBlock lang="bash" label="WSL">
{`govc vm.destroy <WORKER_PREFIX>-0 <WORKER_PREFIX>-1
govc vm.destroy <MASTER_PREFIX>-0 <MASTER_PREFIX>-1 <MASTER_PREFIX>-2
govc vm.destroy <BOOTSTRAP_VM> 2>/dev/null || true
# govc vm.destroy <RHCOS_TEMPLATE>
# govc vm.destroy <NFS_HAPROXY_VM>`}
          </CodeBlock>

          <VerifyBlock>
            <p><code>govc ls /<Var name="DATACENTER" />/vm/</code> — only template and nfs-haproxy remain (if kept).</p>
          </VerifyBlock>
        </Subsection>

        {/* --- 10.4: vCenter Resources --- */}
        <Subsection title="10.4 vCenter Resources">
          <Prose>Optional — only if you want a completely blank vCenter. Skip if you plan to rebuild the same cluster.</Prose>
          <CodeBlock lang="bash" label="WSL">
{`# govc datastore.rm -ds <DATASTORE> bootstrap/ 2>/dev/null || true
# govc datastore.rm -ds <DATASTORE> <RHCOS_TEMPLATE>/ 2>/dev/null || true
# govc folder.destroy /<DATACENTER>/vm/ocp4-vms 2>/dev/null || true`}
          </CodeBlock>
        </Subsection>

        {/* --- 10.5: DNS Records --- */}
        <Subsection title="10.5 DNS Records">
          <Prose>Remove all cluster DNS A records from the DNS server.</Prose>

          <CodeBlock lang="bash" label="WSL">
{`ssh <NFS_HAPROXY_USER>@<NFS_HAPROXY_IP> nsupdate << EOF
server <DNS_ADMIN_IP>
update delete api.<DOMAIN>. A
update delete api-int.<DOMAIN>. A
update delete *.apps.<DOMAIN>. A
update delete bootstrap.<DOMAIN>. A
update delete master-0.<DOMAIN>. A
update delete master-1.<DOMAIN>. A
update delete master-2.<DOMAIN>. A
update delete worker-0.<DOMAIN>. A
update delete worker-1.<DOMAIN>. A
send
EOF`}
          </CodeBlock>

          <VerifyBlock>
            <p><code>dig api.<Var name="DOMAIN" /> +short</code> returns empty (NXDOMAIN or no answer).</p>
          </VerifyBlock>
        </Subsection>

        {/* --- 10.6: Final Verification --- */}
        <Subsection title="10.6 Final Verification">
          <CodeBlock lang="bash" label="WSL">
{`govc ls /<DATACENTER>/vm/
dig api.<DOMAIN> +short
ls $OCP4_DIR/config/ 2>/dev/null || echo "clean"
ping -c1 -W2 <BOOTSTRAP_IP> 2>&1 | grep -q "100% packet loss" && echo "OK"`}
          </CodeBlock>
        </Subsection>
      </Section>

      {/* ===== Section 11: Troubleshooting ===== */}
      <Section id="troubleshooting" num={11} title="Troubleshooting">
        {/* --- 11.1: govc Cannot Connect --- */}
        <Subsection title="govc Cannot Connect">
          <CodeBlock lang="bash" label="WSL">
{`nc -zv <VCENTER_IP> 443
env | grep GOVC
# Ensure GOVC_INSECURE=true for self-signed certs`}
          </CodeBlock>
        </Subsection>

        {/* --- 11.2: Bootstrap Not Completing --- */}
        <Subsection title="Bootstrap Not Completing">
          <CodeBlock lang="bash" label="WSL — SSH to bootstrap">
{`ssh -i ~/.ssh/openshift core@<BOOTSTRAP_IP>
sudo journalctl -b -f -u release-image.service -u setup.service
sudo journalctl -b -f -u bootkube.service
sudo journalctl -b -f -u kubelet.service`}
          </CodeBlock>
        </Subsection>

        {/* --- 11.3: Master Not Joining --- */}
        <Subsection title="Master Not Joining">
          <CodeBlock lang="bash" label="WSL — SSH to master">
{`ssh -i ~/.ssh/openshift core@<MASTER_0_IP>
sudo journalctl -u kubelet -f
sudo crictl ps`}
          </CodeBlock>
        </Subsection>

        {/* --- 11.4: Ignition Not Fetched --- */}
        <Subsection title="Ignition Not Fetched">
          <CodeBlock lang="bash" label="nfs-haproxy">
{`sudo ausearch -m avc -ts recent
govc vm.info -e <BOOTSTRAP_VM> | grep guestinfo.ignition`}
          </CodeBlock>
        </Subsection>

        {/* --- 11.5: DNS Resolution Fails --- */}
        <Subsection title="DNS Resolution Fails">
          <CodeBlock lang="bash" label="Any Node">
{`nslookup api.<DOMAIN> <DNS1>
dig api.<DOMAIN> @<DNS1>
cat /etc/resolv.conf`}
          </CodeBlock>
        </Subsection>

        {/* --- 11.6: NFS Registry Not Mounting --- */}
        <Subsection title="NFS Registry Not Mounting">
          <CodeBlock lang="bash" label="WSL">
{`oc logs -n openshift-image-registry deployment/image-registry
oc debug node/<MASTER_PREFIX>-0 -- chroot /host showmount -e <NFS_HAPROXY_IP>
oc debug node/<MASTER_PREFIX>-0 -- chroot /host mount -t nfs <NFS_HAPROXY_IP>:<NFS_EXPORT> /mnt`}
          </CodeBlock>
        </Subsection>

        {/* --- 11.7: Log Locations --- */}
        <Subsection title="Log Locations">
          <InfoTable
            columns={[{ header: "Node", key: "node" }, { header: "Service", key: "svc" }, { header: "Command", key: "cmd" }]}
            rows={[
              { node: "bootstrap", svc: "Bootkube", cmd: "journalctl -u bootkube.service -f" },
              { node: "bootstrap", svc: "Kubelet", cmd: "journalctl -u kubelet.service -f" },
              { node: "master", svc: "Kubelet", cmd: "journalctl -u kubelet -f" },
              { node: "master", svc: "CRI-O", cmd: "sudo crictl ps" },
              { node: "nfs-haproxy", svc: "HAProxy", cmd: "journalctl -u haproxy -f" },
              { node: "nfs-haproxy", svc: "SELinux", cmd: "ausearch -m avc -ts recent" },
              { node: "WSL", svc: "Installer log", cmd: "$OCP4_DIR/.openshift_install.log" },
            ]}
          />
        </Subsection>
      </Section>

      {/* ===== Section 12: Verification Tests ===== */}
      <Section id="tests" num={12} title="Verification Tests">
        {/* --- 12.1: Pre-Install Tests --- */}
        <Subsection title="Pre-Install Tests">
          <InfoTable
            columns={[{ header: "#", key: "num" }, { header: "Test", key: "test" }, { header: "Expected", key: "expected" }]}
            rows={[
              { num: "1", test: "govc about", expected: "vCenter version" },
              { num: "2", test: "govc datacenter.info", expected: "Datacenter matches" },
              { num: "3", test: "govc cluster.info", expected: "Cluster matches" },
              { num: "4", test: "govc datastore.info", expected: "Datastore matches" },
              { num: "5", test: "govc network.info", expected: "Network matches" },
              { num: "6", test: "ls -la ~/.ssh/openshift*", expected: "2 key files" },
              { num: "7", test: "govc vm.info <RHCOS_TEMPLATE>", expected: "Template exists" },
              { num: "8", test: "dig api.<DOMAIN>", expected: "<API_IP>" },
              { num: "9", test: "nslookup test.apps.<DOMAIN>", expected: "<APPS_IP>" },
              { num: "10", test: "All nodes resolve", expected: "6 IPs match DNS table" },
            ]}
          />
        </Subsection>

        {/* --- 12.2: HAProxy & NFS Tests --- */}
        <Subsection title="HAProxy & NFS Tests">
          <InfoTable
            columns={[{ header: "#", key: "num" }, { header: "Test", key: "test" }, { header: "Expected", key: "expected" }]}
            rows={[
              { num: "11", test: "SSH to nfs-haproxy", expected: "khaled" },
              { num: "12", test: "haproxy -c -f ...", expected: "Configuration file is valid" },
              { num: "13", test: "ss -tlnp | grep ...", expected: "4 haproxy entries" },
              { num: "14", test: "exportfs -v", expected: "NFS export listed" },
              { num: "15", test: "showmount -e localhost", expected: "Export visible" },
            ]}
          />
        </Subsection>

        {/* --- 12.3: VM & Ignition Tests --- */}
        <Subsection title="VM & Ignition Tests">
          <InfoTable
            columns={[{ header: "#", key: "num" }, { header: "Test", key: "test" }, { header: "Expected", key: "expected" }]}
            rows={[
              { num: "17", test: "6 VMs exist", expected: "All 6 listed" },
              { num: "18", test: "Bootstrap specs", expected: "16 GB, 4 CPU, 120 GB" },
              { num: "19", test: "Master specs", expected: "16 GB, 4 CPU, 120 GB" },
              { num: "20", test: "Worker specs", expected: "8 GB, 2 CPU, 120 GB" },
              { num: "21", test: "Ignition injected", expected: "guestinfo present on all 6" },
              { num: "22", test: "3 .ign files", expected: "bootstrap, master, worker" },
              { num: "23", test: "pyVmomi injection", expected: "data + encoding keys set" },
            ]}
          />
        </Subsection>

        {/* --- 12.4: Cluster Tests --- */}
        <Subsection title="Cluster Tests">
          <InfoTable
            columns={[{ header: "#", key: "num" }, { header: "Test", key: "test" }, { header: "Expected", key: "expected" }]}
            rows={[
              { num: "24", test: "Bootstrap powers on", expected: "poweredOn" },
              { num: "25", test: "Masters power on", expected: "poweredOn" },
              { num: "26", test: "Workers power on", expected: "poweredOn" },
              { num: "27", test: "Bootstrap complete", expected: "Success message" },
              { num: "28", test: "CSRs approved", expected: "0 Pending" },
              { num: "29", test: "Nodes Ready", expected: "5 nodes Ready" },
              { num: "30", test: "Install completes", expected: "Credentials displayed" },
              { num: "31", test: "Version", expected: "4.14.x, Available=True" },
              { num: "32", test: "Operators healthy", expected: "All True/False/False" },
              { num: "33", test: "Registry running", expected: "Pod Running" },
              { num: "34", test: "NFS storage", expected: "NFS server configured" },
              { num: "35", test: "Console accessible", expected: "HTTP 200/302" },
            ]}
          />
        </Subsection>
      </Section>
    </>
  );
}
