import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import Var from "@/components/docs/Var";

export function Section6() {
  return (
    <Section id="ocp-vms" num={6} title="OpenShift VMs">
      <Prose>Clone the RHCOS template into 6 VMs (1 bootstrap, 3 masters, 2 workers) and assign static IPs via the Afterburn guestinfo system. The HAProxy VIPs from <a href="#nfs-haproxy">Section 5</a> must match the API/Ingress IPs shown below.</Prose>
      <Prose>All commands run on <strong>WSL</strong>. Do not power on yet — ignition must be injected first (Section 7).</Prose>

      <Subsection title="Clone Bootstrap">
        <CodeBlock lang="bash" label="WSL">
{`# Clone the RHCOS template to create the bootstrap VM
govc vm.clone \\
  -vm <RHCOS_TEMPLATE> \\
  -net "<NETWORK>" \\
  -net.adapter vmxnet3 \\
  -folder /<DATACENTER>/vm/ \\
  -pool /<DATACENTER>/host/<CLUSTER>/Resources \\
  -ds <DATASTORE> \\
  -on=false \\
  <BOOTSTRAP_VM>

# Resize bootstrap: 16 GB RAM, 4 vCPUs, 120 GB disk
govc vm.change -vm <BOOTSTRAP_VM> -m 16384 -c 4
govc vm.disk.change -vm <BOOTSTRAP_VM> -disk.label "Hard disk 1" -size "120G"`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Clone Master Nodes">
        <CodeBlock lang="bash" label="WSL">
{`# Clone master-0, master-1, master-2 with 16 GB RAM, 4 vCPUs, 120 GB disk each
for i in 0 1 2; do
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

      <Subsection title="Clone Worker Nodes">
        <CodeBlock lang="bash" label="WSL">
{`# Clone worker-0 and worker-1 with 8 GB RAM, 2 vCPUs, 120 GB disk each
for i in 0 1; do
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
{`# List all 6 cluster VMs
govc ls /<DATACENTER>/vm/{<BOOTSTRAP_VM>,<MASTER_PREFIX>-{0,1,2},<WORKER_PREFIX>-{0,1}}`}
          </CodeBlock>
          <p>6 VMs listed.</p>
        </VerifyBlock>
      </Subsection>

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
          <p><code>govc vm.info <Var course="openshift-upi-v414" name="BOOTSTRAP_VM" /> | grep afterburn</code> shows the guestinfo key.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
