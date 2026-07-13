import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import Var from "@/components/docs/Var";

export function Section8() {
  return (
    <Section id="cluster-install" num={8} title="Cluster Install">
      <Prose>Power on the VMs in order (bootstrap → masters → workers). After powering on workers, SSH into bootstrap to approve certificate requests. VMs must be cloned (<a href="#ocp-vms">Section 6</a>) and ignition injected (<a href="#ignition">Section 7</a>) before powering on.</Prose>

      <Subsection title="Power On Bootstrap">
        <CodeBlock lang="bash" label="WSL">
{`# Power on the bootstrap VM
govc vm.power -on <BOOTSTRAP_VM>

# Wait for bootstrap to complete (10-15 minutes)
openshift-install wait-for bootstrap-complete \\
  --dir=$OCP4_DIR/config --log-level debug`}
        </CodeBlock>

        <Callout variant="info">
          This typically takes <strong>10-15 minutes</strong>. Ends with <code>It is now safe to remove the bootstrap resources</code>.
        </Callout>
        <VerifyBlock>
          <p>Output shows <code>It is now safe to remove the bootstrap resources</code>. Bootstrap VM is <code>poweredOn</code>.</p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Power On Masters">
        <CodeBlock lang="bash" label="WSL">
{`# Power on all 3 master VMs
for i in 0 1 2; do
  govc vm.power -on <MASTER_PREFIX>-$i
  echo "master-$i powered on"
done`}
        </CodeBlock>
        <VerifyBlock>
          <p><code>govc vm.info <Var course="openshift-upi-v414" name="MASTER_PREFIX" />-0</code> shows <code>poweredOn</code> for all 3 masters.</p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Power On Workers">
        <Prose>Power on both worker VMs.</Prose>
        <CodeBlock lang="bash" label="WSL">
{`# Power on both worker VMs
govc vm.power -on <WORKER_PREFIX>-0
govc vm.power -on <WORKER_PREFIX>-1`}
        </CodeBlock>
        <VerifyBlock>
          <p><code>govc vm.info <Var course="openshift-upi-v414" name="WORKER_PREFIX" />-0</code> shows <code>poweredOn</code> for both workers.</p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Approve CSRs">
        <Prose>SSH into the bootstrap VM to approve pending CSRs. Masters and workers send certificate requests that must be approved before they can join the cluster.</Prose>
        <CodeBlock lang="bash" label="WSL — SSH into bootstrap">
{`ssh -i ~/.ssh/openshift core@<BOOTSTRAP_IP>

# Approve all pending CSRs
oc get csr -o go-template="{{range .items}}{{if not .status}}{{.metadata.name}} {{end}}{{end}}" | xargs -r oc adm certificate approve`}
        </CodeBlock>
        <VerifyBlock>
          <p><code>oc get nodes</code> shows masters as <code>Ready</code></p>
        </VerifyBlock>
        <Callout variant="danger">
          Run <code>oc get csr -o go-template="..." | xargs -r oc adm certificate approve</code> <strong>only after the cluster install is complete</strong> and when <strong>adding new nodes</strong>. Re-approve CSRs each time a worker joins.
        </Callout>
      </Subsection>

      <Subsection title="Wait for Install Complete">
        <CodeBlock lang="bash" label="WSL">
{`# Wait for the cluster install to fully complete
openshift-install wait-for install-complete \\
  --dir=$OCP4_DIR/config --log-level debug`}
        </CodeBlock>

        <VerifyBlock>
          <p>Output ends with web console URL and admin credentials.</p>
          <p><code>oc get nodes</code> shows all 5 nodes (3 masters + 2 workers) as <code>Ready</code></p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Remove Bootstrap">
        <Prose>Destroy the bootstrap VM, then remove it from HAProxy on the nfs-haproxy node.</Prose>

        <CodeBlock lang="bash" label="WSL — Destroy bootstrap VM">
{`# Power off and destroy the bootstrap VM (no longer needed)
govc vm.power -off <BOOTSTRAP_VM>
govc vm.destroy <BOOTSTRAP_VM>`}
        </CodeBlock>

        <CodeBlock lang="bash" label="WSL — Remove bootstrap from HAProxy">
{`# SSH into nfs-haproxy, remove the bootstrap server line, and restart HAProxy
ssh -i ~/.ssh/openshift <NFS_HAPROXY_USER>@<NFS_HAPROXY_IP>
sudo sed -i '/server bootstrap/d' /etc/haproxy/haproxy.cfg
sudo systemctl restart haproxy`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
