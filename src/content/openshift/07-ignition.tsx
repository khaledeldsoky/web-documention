import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import Collapsible from "@/components/docs/Collapsible";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section7() {
  return (
    <Section id="ignition" num={7} title="Generate Ignition Configs">
      <Prose>Generate the install-config.yaml and Ignition files that tell each node how to join the cluster, then inject them via the pyVmomi Python script. Requires VMs from <a href="#ocp-vms">Section 6</a> to already exist.</Prose>
      <Prose>All commands on <strong>WSL</strong>.</Prose>

      <Subsection title="Create install-config.yaml">
        <CodeBlock lang="bash" label="WSL">
{`# Create the install-config.yaml
vim $OCP4_DIR/config/install-config.yaml`}
        </CodeBlock>

        <Collapsible title="$OCP4_DIR/config/install-config.yaml">
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
        </Collapsible>

        <Callout variant="danger">
          Download the pull secret from <code>console.redhat.com</code>. For the SSH key, run <code>cat ~/.ssh/openshift.pub</code>. Wrap both values in single quotes.
        </Callout>
      </Subsection>

      <Subsection title="Generate Manifests & Ignition">
        <CodeBlock lang="bash" label="WSL">
{`# Generate Kubernetes manifests from install-config.yaml
openshift-install create manifests --dir=$OCP4_DIR/config

# Generate ignition configs (bootstrap, master, worker)
openshift-install create ignition-configs --dir=$OCP4_DIR/config

# Verify the 3 ignition files were created
ls $OCP4_DIR/config/*.ign`}
        </CodeBlock>

        <VerifyBlock>
          <p>Three <code>.ign</code> files exist: <code>bootstrap.ign</code>, <code>master.ign</code>, <code>worker.ign</code></p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Inject Ignition via pyVmomi">
        <Prose>Use this Python script to inject ignition into all 6 VMs directly via the vSphere API. VMs must be cloned first (<a href="#ocp-vms">Section 6</a>).</Prose>

        <Callout variant="warn">
          This requires <code>pyVmomi</code> — install via <code>pip install pyVmomi</code>.
        </Callout>

        <CodeBlock lang="bash" label="WSL">
{`# Create the pyVmomi ignition injection script
vim $OCP4_DIR/config/inject-ignition.py`}
        </CodeBlock>

        <Collapsible title="$OCP4_DIR/config/inject-ignition.py">
        <CodeBlock lang="python" label="WSL — $OCP4_DIR/config/inject-ignition.py">
{`import base64, ssl
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
    '<BOOTSTRAP_VM>':             '<OCP4_DIR>/config/bootstrap.ign',
    '<MASTER_PREFIX>-0': '<OCP4_DIR>/config/master.ign',
    '<MASTER_PREFIX>-1': '<OCP4_DIR>/config/master.ign',
    '<MASTER_PREFIX>-2': '<OCP4_DIR>/config/master.ign',
    '<WORKER_PREFIX>-0': '<OCP4_DIR>/config/worker.ign',
    '<WORKER_PREFIX>-1': '<OCP4_DIR>/config/worker.ign',
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
Disconnect(si)`}
        </CodeBlock>
        </Collapsible>

        <VerifyBlock>
          <p>All 6 VMs show <code>guestinfo.ignition.config.data</code> and <code>guestinfo.ignition.config.data.encoding</code> set.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
