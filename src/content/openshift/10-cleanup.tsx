import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import Var from "@/components/docs/Var";

export function Section10() {
  return (
    <Section id="cleanup" num={10} title="Cleanup">
      <Prose>Teardown all cluster resources — local files, HAProxy config and services on nfs-haproxy, VMs, and DNS records. If keeping the nfs-haproxy VM for future installs, skip <a href="#10-2">10.2</a>.</Prose>
      <Prose>
        Remove the cluster as if it never existed. Steps marked <em>optional</em> can be skipped if you plan to rebuild.
        All commands on <strong>WSL</strong> unless labeled otherwise.
      </Prose>

      <Subsection title="10.1 WSL Local Files">
        <Prose>Remove cluster-specific generated files. Keep reusable binaries.</Prose>

        <CodeBlock lang="bash" label="WSL">
{`# Remove generated config and ignition files (keep directory structure)
rm -rf $OCP4_DIR/config/*
find $OCP4_DIR/config -mindepth 1 -delete
rm -rf $OCP4_DIR/ignition/*
find $OCP4_DIR/ignition -mindepth 1 -delete

# Keep downloaded binaries for future use (uncomment to delete)
# rm -rf $OCP4_DIR/rhcos/
# rm -f $OCP4_DIR/openshift-client-linux.tar.gz
# rm -f $OCP4_DIR/openshift-install-linux.tar.gz`}
        </CodeBlock>
      </Subsection>

      <Subsection id="10-2" title="10.2 nfs-haproxy Services">
        <Prose>Only needed if keeping the nfs-haproxy VM. If you destroy the VM, skip this step.</Prose>

        <Prose>SSH into the nfs-haproxy VM then run the commands below:</Prose>

        <CodeBlock lang="bash" label="WSL — SSH into nfs-haproxy">
{`# SSH into the nfs-haproxy VM
ssh -i ~/.ssh/openshift <NFS_HAPROXY_USER>@<NFS_HAPROXY_IP>

# Stop and disable all cluster services
sudo systemctl disable --now haproxy nfs-server firewalld

# Remove HAProxy config and NFS exports
sudo rm -f /etc/haproxy/haproxy.cfg
sudo rm -f /etc/exports

# Remove SELinux port labels for 6443 and 22623
sudo semanage port -d -t haproxy_port_t -p tcp 6443 2>/dev/null || true
sudo semanage port -d -t haproxy_port_t -p tcp 22623 2>/dev/null || true

# Remove VIPs from the interface
sudo nmcli con mod ens32 -ipv4.addresses <API_IP>/16
sudo nmcli con mod ens32 -ipv4.addresses <APPS_IP>/16
sudo nmcli con down ens32 && sudo nmcli con up ens32`}
        </CodeBlock>
      </Subsection>

      <Subsection title="10.3 Virtual Machines">
        <Prose>Destroy cluster VMs. The RHCOS template and nfs-haproxy are optional to keep for future installs.</Prose>

        <CodeBlock lang="bash" label="WSL">
{`# Destroy worker VMs
govc vm.destroy <WORKER_PREFIX>-0 <WORKER_PREFIX>-1

# Destroy master VMs
govc vm.destroy <MASTER_PREFIX>-0 <MASTER_PREFIX>-1 <MASTER_PREFIX>-2

# Destroy bootstrap (may already be gone)
govc vm.destroy <BOOTSTRAP_VM> 2>/dev/null || true

# Keep template and nfs-haproxy for future use (uncomment to delete)
# govc vm.destroy <RHCOS_TEMPLATE>
# govc vm.destroy <NFS_HAPROXY_VM>`}
        </CodeBlock>

        <VerifyBlock>
          <p><code>govc ls /<Var course="openshift-upi-v414" name="DATACENTER" />/vm/</code> — only template and nfs-haproxy remain (if kept).</p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="10.4 vCenter Resources">
        <Prose>Optional — only if you want a completely blank vCenter. Skip if you plan to rebuild the same cluster.</Prose>
        <CodeBlock lang="bash" label="WSL">
{`# govc datastore.rm -ds <DATASTORE> bootstrap/ 2>/dev/null || true
# govc datastore.rm -ds <DATASTORE> <RHCOS_TEMPLATE>/ 2>/dev/null || true
# govc folder.destroy /<DATACENTER>/vm/ocp4-vms 2>/dev/null || true`}
        </CodeBlock>
      </Subsection>

      <Subsection title="10.5 DNS Records">
        <Prose>Remove all cluster DNS A records from the DNS server.</Prose>

        <CodeBlock lang="bash" label="WSL">
{`# Remove all cluster DNS records using nsupdate
ssh <NFS_HAPROXY_USER>@<NFS_HAPROXY_IP> nsupdate << EOF
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
          <p><code>dig api.<Var course="openshift-upi-v414" name="DOMAIN" /> +short</code> returns empty (NXDOMAIN or no answer).</p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="10.6 Final Verification">
        <CodeBlock lang="bash" label="WSL">
{`# List remaining VMs in vSphere
govc ls /<DATACENTER>/vm/

# Confirm API DNS record is removed
dig api.<DOMAIN> +short

# Check that config directory is empty
ls $OCP4_DIR/config/ 2>/dev/null || echo "clean"

# Verify bootstrap VM is unreachable
ping -c1 -W2 <BOOTSTRAP_IP> 2>&1 | grep -q "100% packet loss" && echo "OK"`}
        </CodeBlock>
        <VerifyBlock>
          <p>Only template and nfs-haproxy VMs listed. DNS returns empty. Config directory empty. Bootstrap unreachable.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
