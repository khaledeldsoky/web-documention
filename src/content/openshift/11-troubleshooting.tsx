import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import Var from "@/components/docs/Var";

export function Section11() {
  return (
    <Section id="troubleshooting" num={11} title="Troubleshooting">
      <Prose>Diagnose and fix common issues with vCenter connectivity, bootstrap startup, master joining, ignition, DNS, and NFS.</Prose>

      <Subsection title="govc Cannot Connect">
        <CodeBlock lang="bash" label="WSL">
{`nc -zv <VCENTER_IP> 443
env | grep GOVC
# Ensure GOVC_INSECURE=true for self-signed certs`}
        </CodeBlock>
        <Callout variant="info">
          <code>nc -zv</code> should show <code>succeeded!</code> on port 443. If it times out, check firewall rules or vCenter service status. <code>env | grep GOVC</code> should show all 6 variables — if missing, re-run <code>source</code> on <code>setup-env.sh</code>.
        </Callout>
      </Subsection>

      <Subsection title="Bootstrap Not Completing">
        <CodeBlock lang="bash" label="WSL — SSH to bootstrap">
{`# SSH into the bootstrap VM to inspect logs
ssh -i ~/.ssh/openshift core@<BOOTSTRAP_IP>
# Check image pull and setup progress
sudo journalctl -b -f -u release-image.service -u setup.service
# Check bootkube (Kubernetes bootstrap)
sudo journalctl -b -f -u bootkube.service
# Check kubelet health
sudo journalctl -b -f -u kubelet.service`}
        </CodeBlock>
        <Callout variant="info">
          Look for <code>release-image: pulled</code> and <code>bootkube: Started the Kubernetes API server</code>. If stuck at <code>release-image</code>, check DNS resolution and internet connectivity from the bootstrap VM. If bootkube never starts, verify ignition was injected (<a href="#11-4">see 11.4</a>).
        </Callout>
      </Subsection>

      <Subsection title="Master Not Joining">
        <CodeBlock lang="bash" label="WSL — SSH to master">
{`# SSH into a master node to troubleshoot
ssh -i ~/.ssh/openshift core@<MASTER_0_IP>
# Follow kubelet logs in real-time
sudo journalctl -u kubelet -f
# List running containers via CRI-O
sudo crictl ps`}
        </CodeBlock>
        <Callout variant="info">
          If kubelet reports <code>node &quot;master-0&quot; not found</code>, CSRs haven't been approved (<a href="#cluster-install">see Section 8.4</a>). If <code>crictl ps</code> returns nothing, the node likely didn't receive ignition — check guestinfo keys (<a href="#11-4">see 11.4</a>). A failing kubelet often shows <code>Error: ImagePullBackOff</code> — check DNS.
        </Callout>
      </Subsection>

      <Subsection title="Ignition Not Fetched">
        <CodeBlock lang="bash" label="nfs-haproxy">
{`# Check SELinux denials that might affect HAProxy
sudo ausearch -m avc -ts recent
# Verify ignition guestinfo keys are set on the bootstrap VM
govc vm.info -e <BOOTSTRAP_VM> | grep guestinfo.ignition`}
        </CodeBlock>
        <Callout variant="info">
          If <code>ausearch</code> shows denials with <code>comm=&quot;haproxy&quot;</code>, SELinux port labels are wrong — re-run <a href="#nfs-haproxy">Section 5.6</a>. If <code>grep guestinfo.ignition</code> returns nothing, the pyVmomi script from <a href="#ignition">Section 7.3</a> didn't run or failed — check the script output for errors.
        </Callout>
      </Subsection>

      <Subsection title="DNS Resolution Fails">
        <CodeBlock lang="bash" label="Any Node">
{`# Test DNS resolution for the cluster API
nslookup api.<DOMAIN> <DNS1>
dig api.<DOMAIN> @<DNS1>
# Check local resolver config
cat /etc/resolv.conf`}
        </CodeBlock>
        <Callout variant="info">
          <code>nslookup</code> or <code>dig</code> should return the API IP (<code><Var name="API_IP" /></code>). If it returns <code>NXDOMAIN</code> or <code>SERVFAIL</code>, the A record is missing or the DNS server hasn't reloaded. Check <code>/etc/resolv.conf</code> points to the correct DNS server (<code><Var name="DNS1" /></code>).
        </Callout>
      </Subsection>

      <Subsection title="NFS Registry Not Mounting">
        <CodeBlock lang="bash" label="WSL">
{`# Check image registry logs for errors
oc logs -n openshift-image-registry deployment/image-registry
# Test NFS export visibility from a cluster node
oc debug node/<MASTER_PREFIX>-0 -- chroot /host showmount -e <NFS_HAPROXY_IP>
# Test NFS mount from a cluster node
oc debug node/<MASTER_PREFIX>-0 -- chroot /host mount -t nfs <NFS_HAPROXY_IP>:<NFS_EXPORT> /mnt`}
        </CodeBlock>
        <Callout variant="info">
          If <code>showmount</code> fails, the NFS server or firewall on nfs-haproxy (<a href="#nfs-haproxy">Section 5.4–5.5</a>) isn't configured correctly. If <code>mount</code> fails but <code>showmount</code> works, check <code><Var name="NFS_EXPORT" /></code> path and permissions on the nfs-haproxy VM. Registry pod logs showing <code>AccessDenied</code> usually mean SELinux blocking NFS.
        </Callout>
      </Subsection>

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
  );
}
