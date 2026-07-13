import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Collapsible from "@/components/docs/Collapsible";
import VerifyBlock from "@/components/docs/VerifyBlock";
import Var from "@/components/docs/Var";

export function Section9() {
  return (
    <Section id="postinstall" num={9} title="Post-Install">
      <Prose>Configure the NFS-backed image registry, verify all cluster operators are healthy, and log into the web console. Requires HAProxy and NFS from <a href="#nfs-haproxy">Section 5</a> to be running.</Prose>

      <Subsection title="Configure Image Registry (NFS-backed)">
        <Prose>Create a PersistentVolume and PersistentVolumeClaim backed by the NFS export, then point the image registry at the PVC. The <code>oc patch</code> <code>spec.storage.nfs</code> path is not valid in OCP 4.14+ — use a PVC claim instead.</Prose>

        <CodeBlock lang="bash" label="WSL">
{`# Create the registry-nfs.yaml
vim registry-nfs.yaml`}
        </CodeBlock>

        <Collapsible title="registry-nfs.yaml">
        <CodeBlock lang="yaml" label="WSL — registry-nfs.yaml">
{`apiVersion: v1
kind: PersistentVolume
metadata:
  name: registry-nfs-pv
spec:
  capacity:
    storage: 100Gi
  accessModes:
    - ReadWriteMany
  nfs:
    server: <NFS_HAPROXY_IP>
    path: <NFS_EXPORT>
  persistentVolumeReclaimPolicy: Retain
  storageClassName: ""
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: registry-nfs-pvc
  namespace: openshift-image-registry
spec:
  storageClassName: ""
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 100Gi`}
        </CodeBlock>
        </Collapsible>

        <CodeBlock lang="bash" label="WSL">
{`# Apply the PV and PVC
oc apply -f registry-nfs.yaml

# Patch the image registry to use the PVC
oc patch configs.imageregistry.operator.openshift.io cluster \\
  --type merge \\
  --patch '{"spec":{"managementState":"Managed","storage":{"pvc":{"claim":"registry-nfs-pvc"}}}}'`}
        </CodeBlock>

        <VerifyBlock>
          <p><code>oc get pvc -n openshift-image-registry</code> shows <code>Bound</code></p>
          <p><code>oc get clusteroperator image-registry</code> shows <code>Available=True</code></p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Verify All Operators">
        <CodeBlock lang="bash" label="WSL">
{`# Check all cluster operators are healthy
oc get clusteroperators

# Verify the cluster version and upgrade status
oc get clusterversion

# List all nodes with detailed info
oc get nodes -o wide

# List all pods across all namespaces
oc get pods --all-namespaces`}
        </CodeBlock>

        <VerifyBlock>
          <p><code>oc get clusterversion</code> shows <code>4.14.x</code> with <code>Available=True</code></p>
          <p>All operators show <code>True / False / False</code> (Available / Degraded / Progressing)</p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Access the Cluster">
        <CodeBlock lang="bash" label="WSL">
{`# Show the kubeadmin password and web console URL
cat $OCP4_DIR/config/auth/kubeadmin-password
echo "https://console-openshift-console.apps.<DOMAIN>"

# Log in to the cluster via CLI
oc login -u kubeadmin -p "$(cat $OCP4_DIR/config/auth/kubeadmin-password)" \\
  https://api.<DOMAIN>:6443`}
        </CodeBlock>
        <VerifyBlock>
          <p><code>oc login</code> returns <code>Logged in</code>. Web console returns HTTP <code>200</code>/<code>302</code> at the URL above.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
