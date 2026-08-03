import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section8() {
  return (
    <Section id="phase-c" num={8} title="Phase C — Kubernetes Integration">
      <Prose>
        <strong>Run from <Var course="storage-iscsi-3lun" name="MASTER_NODE" /> only. Requires kubectl. This is where the storage becomes visible to workloads.</strong>
      </Prose>

      {/* ── C1 ── */}
      <Subsection id="c1" title="C1. Apply Node Labels">
        <NodeTag label={<Var course="storage-iscsi-3lun" name="MASTER_NODE" />} variant="m1" />
        <Prose>
          Labels are how Kubernetes knows which storage belongs to which node.
          The <code>storage-owner-N=true</code> label is what pins each workload shard&apos;s PVC
          to the correct heavy node. Apply once — they are permanent unless you are doing DR.
        </Prose>

        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="MASTER_NODE" /> — apply all node labels</span>}>
{`# Mark these nodes as heavy-tier workload nodes
kubectl label node <NODE_1> workload-class=heavy --overwrite
kubectl label node <NODE_2> workload-class=heavy --overwrite
kubectl label node <NODE_3> workload-class=heavy --overwrite

# Mark that each heavy has direct iSCSI block storage attached
kubectl label node <NODE_1> storage-attached=true --overwrite
kubectl label node <NODE_2> storage-attached=true --overwrite
kubectl label node <NODE_3> storage-attached=true --overwrite

# Storage ownership — each label pins shard N to its owning node
kubectl label node <NODE_1> storage-owner-1=true --overwrite
kubectl label node <NODE_2> storage-owner-2=true --overwrite
kubectl label node <NODE_3> storage-owner-3=true --overwrite

# File-ingress role — <NODE_1> also runs the decoder pod
kubectl label node <NODE_1> file-ingress=true --overwrite

# Verify all labels applied correctly
kubectl get nodes -L workload-class,storage-attached,storage-owner-1,storage-owner-2,storage-owner-3,file-ingress`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p><code><Var course="storage-iscsi-3lun" name="NODE_1" /></code>:  workload-class=heavy  storage-attached=true  storage-owner-1=true  file-ingress=true</p>
          <p><code><Var course="storage-iscsi-3lun" name="NODE_2" /></code>:  workload-class=heavy  storage-attached=true  storage-owner-2=true</p>
          <p><code><Var course="storage-iscsi-3lun" name="NODE_3" /></code>:  workload-class=heavy  storage-attached=true  storage-owner-3=true</p>
        </VerifyBlock>
      </Subsection>

      {/* ── C2 ── */}
      <Subsection id="c2" title="C2. Install and Configure local-path-provisioner">
        <NodeTag label={<Var course="storage-iscsi-3lun" name="MASTER_NODE" />} variant="m1" />
        <Prose>
          <code>local-path-provisioner</code> creates PersistentVolumes by making subdirectories
          inside the node-local XFS mounts you configured in Phase B. When a workload requests
          storage, Kubernetes binds the PVC to the node where the pod will run —
          which is controlled by the <code>storage-owner-N=true</code> nodeSelector on the pod.
        </Prose>

        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="MASTER_NODE" /> — install local-path-provisioner</span>}>
{`kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/master/deploy/local-path-storage.yaml

# Wait for provisioner pod to be running
kubectl -n local-path-storage rollout status deploy/local-path-provisioner`}
        </CodeBlock>

        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="MASTER_NODE" /> — open the ConfigMap to edit nodePathMap</span>}>
{`kubectl -n local-path-storage edit configmap local-path-config`}
        </CodeBlock>

        <Prose>
          When the editor opens, find the <code>config.json</code> field and replace its value
          with exactly this JSON:
        </Prose>

        <CodeBlock lang="bash" label="config.json value — paste this into the ConfigMap editor">
{`{
  "nodePathMap": [
    { "node": "<NODE_1>", "paths": ["<MOUNT_BASE>/pv-root-1"] },
    { "node": "<NODE_2>", "paths": ["<MOUNT_BASE>/pv-root-2"] },
    { "node": "<NODE_3>", "paths": ["<MOUNT_BASE>/pv-root-3"] },
    { "node": "light-1", "paths": ["/srv/monitoring/pv-root"] },
    { "node": "light-2", "paths": ["/srv/monitoring/pv-root"] },
    { "node": "light-3", "paths": ["/srv/monitoring/pv-root"] }
  ],
  "setupCommand": "/bin/mkdir -p",
  "teardownCommand": "/bin/rm -rf",
  "helperPod": "default/helper-pod"
}`}
        </CodeBlock>

        <Callout variant="info">
          <strong>No DEFAULT_PATH_FOR_NON_LISTED_NODES — this is intentional.</strong>{" "}
          A PVC that ends up on an unlisted or wrong node will fail loudly (PVC stays Pending)
          rather than silently provisioning storage on an unintended path.
          This is a safety guardrail. Do not add a default path.
        </Callout>
      </Subsection>

      {/* ── C3 ── */}
      <Subsection id="c3" title="C3. Sanity Test — Verify End-to-End Storage on Each Node">
        <NodeTag label={<Var course="storage-iscsi-3lun" name="MASTER_NODE" />} variant="m1" />
        <Prose>
          Create one test PVC and pod per heavy node. Each pod must land on its correct node
          with PVC Bound. This confirms the full stack works before you hand off to the
          application team.
        </Prose>

        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="MASTER_NODE" /> — create test PVC + pod for each heavy node</span>}>
{`for N in 1 2 3; do
  kubectl apply -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-shard\${N}
  namespace: default
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: local-path
  resources:
    requests:
      storage: 1Gi
---
apiVersion: v1
kind: Pod
metadata:
  name: test-shard\${N}
  namespace: default
spec:
  nodeSelector:
    storage-owner-\${N}: "true"
  containers:
  - name: t
    image: busybox
    command: [sh, -c, "echo storage-ok > /data/test.txt && cat /data/test.txt"]
    volumeMounts:
    - name: d
      mountPath: /data
  volumes:
  - name: d
    persistentVolumeClaim:
      claimName: test-shard\${N}
  restartPolicy: Never
EOF
done

# Check — each pod must be on its correct heavy node
kubectl get pod test-shard1 test-shard2 test-shard3 -o wide

# All three PVCs must show Bound
kubectl get pvc test-shard1 test-shard2 test-shard3`}
        </CodeBlock>

        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="MASTER_NODE" /> — clean up test resources when done</span>}>
{`kubectl delete pod test-shard1 test-shard2 test-shard3
kubectl delete pvc  test-shard1 test-shard2 test-shard3`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p><code>test-shard1  Completed  NODE=<Var course="storage-iscsi-3lun" name="NODE_1" />  PVC=Bound</code></p>
          <p><code>test-shard2  Completed  NODE=<Var course="storage-iscsi-3lun" name="NODE_2" />  PVC=Bound</code></p>
          <p><code>test-shard3  Completed  NODE=<Var course="storage-iscsi-3lun" name="NODE_3" />  PVC=Bound</code></p>
          <p>If a pod stays Pending → check nodeSelector matches label, path exists on node, check:</p>
          <p><code>kubectl -n local-path-storage logs deploy/local-path-provisioner</code></p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
