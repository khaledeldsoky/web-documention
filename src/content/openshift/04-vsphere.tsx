import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import Var from "@/components/docs/Var";

export function Section4() {
  return (
    <Section id="vsphere-prep" num={4} title="vSphere Environment">
      <Prose>Download the RHCOS virtual appliance and import it as a vSphere template. Every cluster node is cloned from this template.</Prose>

      <Subsection title="Download RHCOS OVA">
        <CodeBlock lang="bash" label="WSL">
{`# Set the RHCOS version and download the vSphere OVA
export RHCOS_VERSION=4.14.0
 cd $OCP4_DIR/rhcos
 wget https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/4.14/\${RHCOS_VERSION}/rhcos-\${RHCOS_VERSION}-x86_64-vmware.x86_64.ova
 # Verify checksum
 sha256sum rhcos-\${RHCOS_VERSION}-x86_64-vmware.x86_64.ova`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Import RHCOS OVA as Template">
        <CodeBlock lang="bash" label="WSL">
{`# Import the OVA as a VM in vSphere
govc import.ova \\
  -name <RHCOS_TEMPLATE> \\
  -ds <DATASTORE> \\
  -pool /<DATACENTER>/host/<CLUSTER>/Resources \\
  -folder /<DATACENTER>/vm/ \\
  -net "<NETWORK>" \\
  $OCP4_DIR/rhcos/rhcos-4.14.0-x86_64-vmware.x86_64.ova
# Convert the VM to a reusable template
govc vm.markastemplate <RHCOS_TEMPLATE>`}
        </CodeBlock>
        <VerifyBlock>
          <p><code>{'govc vm.info '}<Var name="RHCOS_TEMPLATE" /></code> shows the VM as a template.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
