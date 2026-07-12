import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import InfoTable from "@/components/docs/InfoTable";
import StepList from "@/components/docs/StepList";
import Var from "@/components/docs/Var";

export function Section2() {
  return (
    <Section id="prerequisites" num={2} title="Prerequisites">
      <Prose>Make sure your hardware, DNS records, and vSphere access are ready before you start.</Prose>

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
  );
}
