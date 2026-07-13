import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section2() {
  return (
    <Section id="create-vms" num={2} title="Create VMs with govc">
      <Prose>
        Create 6 VMs from a RHEL ISO using <code>govc</code>. One template VM
        is installed from the ISO, then cloned 6 times with static IPs.
      </Prose>

      <Subsection title="Install govc on your workstation">
        <CodeBlock lang="bash" label="Workstation (not the air-gapped network)">
{`# Download govc binary for your OS
curl -L -o govc.gz https://github.com/vmware/govmomi/releases/latest/download/govc_linux_amd64.gz
gunzip govc.gz
chmod +x govc
sudo mv govc /usr/local/bin/

# Set vCenter credentials
export GOVC_URL="<VCENTER_IP>"
export GOVC_USERNAME="<VCENTER_USER>"
export GOVC_PASSWORD="<VCENTER_PASS>"
export GOVC_INSECURE=true   # skip TLS verification in lab

# Verify connection
govc ls /<DATACENTER>/vm`}
        </CodeBlock>

        <VerifyBlock label="Expected result">
          <p>
            <code>govc ls</code> shows the datacenter VM folder tree without
            errors.
          </p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Upload ISO to datastore">
        <Prose>
          Upload the RHEL ISO from your workstation to the vSphere datastore.
          The ISO will be used to boot the template VM for installation.
        </Prose>
        <CodeBlock lang="bash" label="Workstation">
{`# Upload RHEL ISO to datastore
govc datastore.upload \\
  -ds "<DATASTORE>" \\
  <PATH_TO_RHEL_ISO> \\
  "ISO/<RHEL_ISO>"`}
        </CodeBlock>

        <VerifyBlock label="Expected result">
          <p>
            <code>{'govc datastore.ls -ds "<DATASTORE>" ISO/'}</code> shows the
            uploaded ISO file.
          </p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Create template VM">
        <Prose>
          Create one VM from scratch with the ISO attached, install RHEL
          manually via the vSphere console, then mark it as a reusable template
          for cloning.
        </Prose>

        <CodeBlock lang="bash" label="Workstation">
{`# Create a VM with ISO attached
govc vm.create \\
  -ds "<DATASTORE>" \\
  -folder "<VM_FOLDER>" \\
  -pool "/<DATACENTER>/host/<CLUSTER>/Resources" \\
  -net "<NETWORK>" \\
  -disk "<DISK_SIZE>GB" \\
  -c <TEMPLATE_CPU> -m <TEMPLATE_RAM> \\
  -iso "<RHEL_ISO_PATH_DATASTORE>" \\
  -on=false \\
  "<RHEL_TEMPLATE>"

# Power on and install RHEL via vSphere console
govc vm.power -on "<RHEL_TEMPLATE>"`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>After RHEL installation completes</strong>, shut down the VM
          and mark it as a template so it can be cloned.
        </Callout>

        <CodeBlock lang="bash" label="Workstation">
{`# Shut down after install
govc vm.power -off "<RHEL_TEMPLATE>"

# Mark as reusable template
govc vm.markastemplate "<RHEL_TEMPLATE>"`}
        </CodeBlock>

        <VerifyBlock label="Expected result">
          <p>
            <code>{'govc vm.info "<RHEL_TEMPLATE>"'}</code> shows the VM as a
            template.
          </p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Clone VMs from template">
        <Prose>
          Clone the template 6 times with <code>govc vm.clone</code>, configure
          static IPs with <code>govc vm.customize</code>, then power on.
        </Prose>
        <CodeBlock lang="bash" label="Workstation">
{`# --- Set your variables (edit these) ---
export MASTER_0_IP="<MASTER_0_IP>"
export MASTER_1_IP="<MASTER_1_IP>"
export MASTER_2_IP="<MASTER_2_IP>"
export WORKER_0_IP="<WORKER_0_IP>"
export WORKER_1_IP="<WORKER_1_IP>"
export WORKER_2_IP="<WORKER_2_IP>"
export SUBNET_MASK="<SUBNET_MASK>"
export GATEWAY="<GATEWAY>"
export DNS_SERVERS="<DNS_SERVERS>"

# --- Master nodes ---
for i in 0 1 2; do
  IP_VAR="MASTER_\${i}_IP"
  NAME="master$\((i+1))"
  IP=\${!IP_VAR}
  govc vm.clone \\
    -vm "<RHEL_TEMPLATE>" \\
    -folder "<VM_FOLDER>" \\
    -ds "<DATASTORE>" \\
    -on=false \\
    "\$NAME"
  govc vm.customize -vm "\$NAME" \\
    -ip "\$IP" \\
    -netmask "\$SUBNET_MASK" \\
    -name "\$NAME" \\
    \${GATEWAY:+-gateway "\$GATEWAY"} \\
    \${DNS_SERVERS:+-dns-server "\$DNS_SERVERS"}
  govc vm.power -on "\$NAME"
done

# --- Worker nodes ---
for i in 0 1 2; do
  IP_VAR="WORKER_\${i}_IP"
  NAME="worker$\((i+1))"
  IP=\${!IP_VAR}
  govc vm.clone \\
    -vm "<RHEL_TEMPLATE>" \\
    -folder "<VM_FOLDER>" \\
    -ds "<DATASTORE>" \\
    -on=false \\
    "\$NAME"
  govc vm.customize -vm "\$NAME" \\
    -ip "\$IP" \\
    -netmask "\$SUBNET_MASK" \\
    -name "\$NAME" \\
    \${GATEWAY:+-gateway "\$GATEWAY"} \\
    \${DNS_SERVERS:+-dns-server "\$DNS_SERVERS"}
  govc vm.power -on "\$NAME"
done`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Subnet mask must be in full format</strong> — use{" "}
          <code>255.255.255.0</code>, not CIDR <code>24</code>. Leave{" "}
          <code>GATEWAY</code> and <code>DNS_SERVERS</code> empty if not needed.
        </Callout>

        <Callout variant="warn">
          <strong>Adjust CPU/RAM</strong> per your cluster sizing. Masters need
          minimum 4 CPU / 8 GB. Workers can be larger depending on workload.
        </Callout>

        <VerifyBlock label="Expected result">
          <p>
            <code>{'govc ls "<VM_FOLDER>"'}</code> shows all 6 VMs powered on.
          </p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Verify network connectivity">
        <Prose>
          From a machine that can reach the new VMs, SSH in and confirm
          networking.
        </Prose>
        <CodeBlock lang="bash" label="Each node (via jump host or console)">
{`# SSH into each node
ssh root@<MASTER_0_IP>

# Verify IP assignment
ip a show ens192
hostnamectl

# Test DNS resolution (will work after Section 5 — skip if not resolving yet)
ping -c3 master1
ping -c3 google.com`}
        </CodeBlock>

        <VerifyBlock label="Expected result">
          <p>
            <code>ip a</code> shows the correct IP on the interface.
          </p>
          <p>
            <code>hostnamectl</code> shows the correct hostname.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
