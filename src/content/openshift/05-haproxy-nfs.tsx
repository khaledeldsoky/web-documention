import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import Collapsible from "@/components/docs/Collapsible";
import Var from "@/components/docs/Var";

export function Section5() {
  return (
    <Section id="nfs-haproxy" num={5} title="HAProxy + NFS VM">
      <Prose>Create and configure the nfs-haproxy VM — it will load-balance API traffic to the cluster and provide NFS storage for the image registry. The VM IPs configured here are referenced when cloning OpenShift nodes (<a href="#ocp-vms">Section 6</a>) and generating ignition (<a href="#ignition">Section 7</a>).</Prose>

      <Subsection title="Create VM from ISO">
        <CodeBlock lang="bash" label="WSL">
{`# Create the HAProxy VM with 8 GB RAM and 4 vCPUs
govc vm.create \\
  -m 8192 -c 4 \\
  -disk "40G" \\
  -disk.controller pvscsi \\
  -net "<NETWORK>" \\
  -pool /<DATACENTER>/host/<CLUSTER>/Resources \\
  -folder /<DATACENTER>/vm/ \\
  -on=false \\
  <NFS_HAPROXY_VM>

# Attach the CentOS installation ISO
govc device.cdrom.add -vm <NFS_HAPROXY_VM>
govc vm.dvd.insert \\
  -vm <NFS_HAPROXY_VM> \\
  -ds <DATASTORE> \\
  <CENTOS_ISO>

# Create a 100 GB data disk for NFS exports
govc vm.disk.create \\
  -vm <NFS_HAPROXY_VM> \\
  -name <NFS_HAPROXY_VM>/nfs-data \\
  -size "100G" -ds <DATASTORE>

# Power on and open the console for manual OS install
govc vm.power -on <NFS_HAPROXY_VM>
govc vm.console <NFS_HAPROXY_VM>`}
        </CodeBlock>

        <Callout variant="warn">
          Open the console URL in a browser to install CentOS 9 manually. Set hostname <code>nfs-haproxy.<Var course="openshift-upi-v414" name="DOMAIN" /></code> and user <code>khaled</code>.
        </Callout>
      </Subsection>

      <Subsection title="Configure Static IP">
        <Prose>Run on the <strong>nfs-haproxy VM</strong> via SSH.</Prose>

        <CodeBlock lang="bash" label="nfs-haproxy">
{`# SSH into the nfs-haproxy VM
ssh -i ~/.ssh/openshift <NFS_HAPROXY_USER>@<NFS_HAPROXY_IP>

# Set a static IP address with DNS
sudo nmcli con mod ens32 \\
  ipv4.addresses <NFS_HAPROXY_IP>/16 \\
  ipv4.gateway <GATEWAY> \\
  ipv4.dns <DNS1> \\
  ipv4.dns-search <DOMAIN> \\
  ipv4.method manual

# Restart the interface and verify
sudo nmcli con down ens32 && sudo nmcli con up ens32
ip addr show ens32`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Install & Configure HAProxy">
        <Prose>Open the HAProxy config file with <code>vim /etc/haproxy/haproxy.cfg</code> and replace its content.</Prose>
        <Collapsible title="/etc/haproxy/haproxy.cfg">
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
        </Collapsible>

        <CodeBlock lang="bash" label="nfs-haproxy — Apply config">
{`# Install HAProxy and create its run directory
sudo dnf install -y haproxy
sudo mkdir -p /var/lib/haproxy && sudo chown haproxy:haproxy /var/lib/haproxy

# Allow HAProxy to connect to any network (required for backend servers)
sudo setsebool -P haproxy_connect_any 1

# Validate config, then enable and start the service
sudo haproxy -c -f /etc/haproxy/haproxy.cfg
sudo systemctl enable --now haproxy

# Verify HAProxy is listening on all required ports
sudo ss -tlnp | grep -E ':(6443|22623|443|80)'`}
        </CodeBlock>

        <VerifyBlock>
          <p><code>sudo haproxy -c -f /etc/haproxy/haproxy.cfg</code> — <code>Configuration file is valid</code></p>
          <p><code>sudo ss -tlnp | grep haproxy</code> shows 4 listening ports.</p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Install & Configure Firewall">
        <CodeBlock lang="bash" label="nfs-haproxy">
{`# Install and start firewalld
sudo dnf install -y firewalld
sudo systemctl enable --now firewalld

# Open required services (HTTP, HTTPS, NFS) and cluster ports
sudo firewall-cmd --permanent --add-service={http,https,nfs,rpc-bind,mountd}
sudo firewall-cmd --permanent --add-port={6443/tcp,22623/tcp}
sudo firewall-cmd --reload`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Install & Configure NFS Export">
        <CodeBlock lang="bash" label="nfs-haproxy">
{`# Install NFS utilities
sudo dnf install -y nfs-utils

# Create the NFS export directory with open permissions
sudo mkdir -p <NFS_EXPORT>
sudo chown -R nobody:nobody <NFS_EXPORT>
sudo chmod 777 <NFS_EXPORT>

# Format the data disk as XFS and mount it to the export path
sudo mkfs.xfs /dev/sdb
sudo mount /dev/sdb <NFS_EXPORT>

# Persist mount in fstab and configure the NFS export
echo "/dev/sdb <NFS_EXPORT> xfs defaults 0 0" | sudo tee -a /etc/fstab
echo "<NFS_EXPORT> *(rw,sync,no_subtree_check,no_root_squash)" | sudo tee -a /etc/exports

# Apply exports and start the NFS server
sudo exportfs -r
sudo systemctl enable --now nfs-server`}
        </CodeBlock>

        <VerifyBlock>
          <p><code>showmount -e localhost</code> — shows <code><Var course="openshift-upi-v414" name="NFS_EXPORT" /> *</code></p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="SELinux Configuration">
        <CodeBlock lang="bash" label="nfs-haproxy">
{`# Install SELinux management tools
sudo dnf install -y policycoreutils-python-utils

# Allow NFS to export filesystems with read-write
sudo setsebool -P nfs_export_all_rw on

# Label ports 6443 and 22623 for HAProxy (instead of http_port_t)
sudo semanage port -a -t haproxy_port_t -p tcp 6443
sudo semanage port -a -t haproxy_port_t -p tcp 22623`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Add API & Ingress VIPs">
        <Prose>
          The API VIP and Ingress VIP must exist as IPs on the HAProxy VM so the cluster can reach them.
          Add them as secondary addresses on <code>ens32</code>.
        </Prose>

        <CodeBlock lang="bash" label="nfs-haproxy">
{`# Add API and Ingress VIPs temporarily (live until reboot)
sudo ip addr add <API_IP>/16 dev ens32
sudo ip addr add <APPS_IP>/16 dev ens32

# Persist VIPs via NetworkManager and restart the interface
sudo nmcli con mod ens32 +ipv4.addresses <API_IP>/16
sudo nmcli con mod ens32 +ipv4.addresses <APPS_IP>/16
sudo nmcli con down ens32 && sudo nmcli con up ens32`}
        </CodeBlock>

        <VerifyBlock>
          <p><code>ip addr show ens32 | grep <Var course="openshift-upi-v414" name="API_IP" /></code> shows both VIPs on the interface.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
