import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import StepList from "@/components/docs/StepList";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section9() {
  return (
    <Section id="reference" num={9} title="DR Procedure and Sign-off Checklist">

      {/* ── DR ── */}
      <Subsection id="dr" title="Disaster Recovery — Manual LUN Re-masking">
        <Prose>
          When a heavy node fails and cannot be recovered quickly, its LUN can be moved to a
          surviving node. The data on the LUN is <strong>never lost</strong> — it stays intact
          on the <Var course="storage-iscsi-3lun" name="ARRAY_MODEL" />. This is a manual procedure.
          Estimated time: 1–4 hours.
        </Prose>

        <Callout variant="danger">
          <strong>The failed node MUST be completely powered off before you touch the array.</strong>{" "}
          If the failed node comes back online while another node has its LUN mounted,
          both will write to the same XFS filesystem simultaneously — this destroys the data
          permanently and irrecoverably. Verify via iDRAC that the server is off before proceeding.
        </Callout>

        <StepList
          steps={[
            { title: "Confirm power off.", desc: "Check via iDRAC web UI. The server must be fully off — not just network-unreachable. A server that is kernel-panicked may still have I/O in flight." },
            { title: "At the ME4024 UI:", desc: <>Go to Volumes → <Var course="storage-iscsi-3lun" name="LUN_NAME_1" /> (the failed node's LUN) → Map → Host Access. Remove the failed node's IQN. Add the surviving node's IQN.</> },
            { title: "On the surviving node — rediscover the new LUN:", desc: "See code block below." },
            { title: "Mount the LUN on the surviving node:", desc: "See code block below." },
            { title: <>Update the Kubernetes node label on <Var course="storage-iscsi-3lun" name="MASTER_NODE" />:</>, desc: "See code block below." },
            { title: "Workload pods for shard N reschedule on the surviving node.", desc: "That node now runs two shards. Monitor CPU, memory, and I/O closely. Reduce ClickHouse background merge threads and concurrent query limits if pressure builds." },
          ]}
        />

        <NodeTag label="surviving heavy node" variant="all" />
        <CodeBlock lang="bash" label="surviving heavy node — rediscover the new LUN">
{`iscsiadm -m discovery -t sendtargets -p <CTRL_A_IP>:3260
iscsiadm -m node --login
multipath -r
multipath -ll   # the failed node's LUN alias should now appear`}
        </CodeBlock>

        <CodeBlock lang="bash" label="surviving heavy node — substitute N with the failed shard number">
{`mkdir -p <MOUNT_BASE>/pv-root-<N>
mount /dev/<VG_N>/<LV_N>  <MOUNT_BASE>/pv-root-<N>
df -h <MOUNT_BASE>/pv-root-<N>`}
        </CodeBlock>

        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="MASTER_NODE" /> — X = surviving node number, N = failed shard number</span>}>
{`kubectl label node <NODE_X> storage-owner-<N>=true --overwrite`}
        </CodeBlock>

        <Callout variant="warn">
          While two shards share one node, both LUNs&apos; I/O shares the same 10 GbE iSCSI NIC.
          Monitor with <code>iostat -x 1</code>. If I/O wait climbs above 30%, reduce
          ClickHouse <code>background_pool_size</code> and Kafka broker throughput limits until
          the failed node is recovered and the second shard is moved back.
        </Callout>
      </Subsection>

      {/* ── Checklist ── */}
      <Subsection id="checklist" title="Sign-off Checklist">
        <Prose>
          Complete every item before handing over to the application team.
          All items must be ticked. Record the engineer name and date for your team&apos;s records.
        </Prose>

        <Prose><strong>Phase A — <Var course="storage-iscsi-3lun" name="ARRAY_MODEL" /> Array</strong></Prose>
        <InfoTable
          columns={[
            { header: "✓", key: "check" },
            { header: "Item", key: "item" },
            { header: "Details", key: "details" },
          ]}
          rows={[
            { check: "☐", item: <>Disk group <Var course="storage-iscsi-3lun" name="DISK_GROUP" /> — RAID-6 — Status: OK</>, details: "22 data drives · 2 parity · 1 hot spare · stripe unit 256 KB" },
            { check: "☐", item: <>Three LUNs created: <Var course="storage-iscsi-3lun" name="LUN_NAME_1" />, <Var course="storage-iscsi-3lun" name="LUN_NAME_2" />, <Var course="storage-iscsi-3lun" name="LUN_NAME_3" /></>, details: <>Each <Var course="storage-iscsi-3lun" name="LUN_SIZE" /> · Write Back · from <Var course="storage-iscsi-3lun" name="DISK_GROUP" /></> },
            { check: "☐", item: "Host ACL — each LUN mapped to exactly ONE IQN", details: "Confirmed in Volumes → Mappings · absolutely no overlap" },
            { check: "☐", item: "Write-back cache ON · BBU battery healthy/green", details: "" },
            { check: "☐", item: "iSCSI host ports MTU 9000 on both controllers", details: "" },
            { check: "☐", item: "CHAP credentials created and stored in password vault", details: "" },
            { check: "☐", item: "Both controllers online (A and B)", details: "" },
            { check: "☐", item: "Controller A and B portal IPs recorded in team wiki", details: "" },
            { check: "☐", item: "Array health alerts configured and routed to on-call", details: "" },
          ]}
        />

        <Prose><strong>Phase B — OS (repeat for each heavy node)</strong></Prose>
        <InfoTable
          columns={[
            { header: "✓", key: "check" },
            { header: "Item", key: "item" },
            { header: "Details", key: "details" },
          ]}
          rows={[
            { check: "☐", item: "Packages installed on all 3 nodes", details: "open-iscsi · device-mapper-multipath · lvm2 · xfsprogs · sg3_utils" },
            { check: "☐", item: "iscsid and multipathd enabled and running on all 3 nodes", details: "" },
            { check: "☐", item: "Kernel tuning applied: /etc/sysctl.d/99-xdr.conf", details: "" },
            { check: "☐", item: "Swap permanently disabled · THP disabled via systemd unit", details: "" },
            { check: "☐", item: "Storage NIC: MTU 9000 confirmed on all 3 nodes", details: "" },
            { check: "☐", item: "Jumbo frame ping succeeds to both controller IPs from all 3 nodes", details: "ping -M do -s 8972 · zero fragmentation errors" },
            { check: "☐", item: "Unique IQN set on each node and matches ME4024 ACL exactly", details: <>iqn.<Var course="storage-iscsi-3lun" name="IQN_DATE" />.<Var course="storage-iscsi-3lun" name="IQN_DOMAIN" />:<Var course="storage-iscsi-3lun" name="NODE_1" /> (etc.)</> },
            { check: "☐", item: "CHAP credentials in iscsid.conf on all 3 nodes", details: "" },
            { check: "☐", item: "iscsiadm -m session shows exactly 2 sessions on each node", details: "" },
            { check: "☐", item: "Each node sees ONLY its own LUN (lsblk confirms — one disk only)", details: "" },
            { check: "☐", item: "WWID recorded for each LUN and entered in multipath.conf", details: "" },
            { check: "☐", item: "multipath -ll shows 2 paths on all 3 nodes", details: "active/ready (owning controller) + active/ghost (standby)" },
            { check: "☐", item: "LVM created on each node's own multipath device", details: <>pvcreate → vgcreate <Var course="storage-iscsi-3lun" name="VG_1" /> → lvcreate <Var course="storage-iscsi-3lun" name="LV_1" /></> },
            { check: "☐", item: "mkfs.xfs with -d su=256k,sw=20 run on each node's LV", details: "" },
            { check: "☐", item: "xfs_info confirms sunit=512 and swidth=10240", details: "" },
            { check: "☐", item: "fstab entry includes _netdev on all 3 nodes", details: "" },
            { check: "☐", item: <>Reboot test completed on <Var course="storage-iscsi-3lun" name="NODE_1" /> — mount came back automatically</>, details: "" },
            { check: "☐", item: "df -h confirms ~19.5 TiB usable on all 3 mounts", details: "" },
            { check: "☐", item: "mq-deadline I/O scheduler set via udev on all 3 nodes", details: "" },
            { check: "☐", item: <>chown <Var course="storage-iscsi-3lun" name="APP_UID" />:<Var course="storage-iscsi-3lun" name="APP_UID" /> applied at mount root on all 3 nodes</>, details: "" },
            { check: "☐", item: <><Var course="storage-iscsi-3lun" name="NODE_1" /> only: feeds/ decoded/ directories and symlinks created</>, details: "" },
          ]}
        />

        <Prose><strong>Phase C — Kubernetes</strong></Prose>
        <InfoTable
          columns={[
            { header: "✓", key: "check" },
            { header: "Item", key: "item" },
            { header: "Details", key: "details" },
          ]}
          rows={[
            { check: "☐", item: "Node labels applied and verified with kubectl get nodes -L", details: "workload-class · storage-attached · storage-owner-1/2/3 · file-ingress" },
            { check: "☐", item: "local-path-provisioner installed and Running in local-path-storage namespace", details: "" },
            { check: "☐", item: "nodePathMap updated: 3 pv-root-N paths + 3 light-tier paths", details: "" },
            { check: "☐", item: "Sanity test PVCs: all 3 bound on correct nodes, pods completed", details: "" },
            { check: "☐", item: "Test resources cleaned up (pods and PVCs deleted)", details: "" },
          ]}
        />

        <Prose><strong>Handover</strong></Prose>
        <InfoTable
          columns={[
            { header: "✓", key: "check" },
            { header: "Item", key: "item" },
          ]}
          rows={[
            { check: "☐", item: "WWID-to-LUN-to-node mapping table recorded in team wiki" },
            { check: "☐", item: "CHAP credentials confirmed in password vault — accessible to on-call" },
            { check: "☐", item: "DR re-masking procedure read and understood by at least 2 team members" },
            { check: "☐", item: "Array health alert routing tested (send a test alert)" },
          ]}
        />

        <Callout variant="success">
          All items checked? The storage layer is ready. Hand off to the application team with
          the LUN-to-node mapping table and confirm the DR procedure is accessible in your
          on-call runbook. Storage configuration is complete.
        </Callout>
      </Subsection>
    </Section>
  );
}
