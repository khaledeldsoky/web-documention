import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import VerifyBlock from "@/components/docs/VerifyBlock";
import StepList from "@/components/docs/StepList";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section2() {
  return (
    <Section id="phase-a" num={2} title="Phase A — Dell EMC ME4024 Array Configuration">
        <Prose>
          <strong>Performed via the ME Storage Manager web UI. No SSH to servers yet. Estimated time: ~1 hour.</strong>
        </Prose>

      {/* ── A0 ── */}
      <Subsection id="a0" title="A0. Collect the Values — What to Read from the Array, What Not to Ask">
        <NodeTag label="ME4024 Web UI + CLI" variant="arr" />
        <Prose>
          Gather the values below before Phase A. Most values in this guide are fixed and need
          no storage-team input. The kernel tuning in B2 is generic best practice, and the iSCSI
          session tuning in B5 (queue depth, burst lengths, NOP timers) is configured on the
          initiator side — the ME4024 does not expose those values in its GUI or CLI. The only
          real secret to obtain is the CHAP credential pair.
        </Prose>

        <InfoTable
          columns={[
            { header: "Value", key: "value" },
            { header: "ME4024 GUI", key: "gui" },
            { header: "ME4024 CLI", key: "cli" },
            { header: "Used in", key: "used" },
          ]}
          rows={[
            {
              value: "CHAP username + secret",
              gui: "System → Security → CHAP",
              cli: <><code>show chap-records name &lt;IQN&gt; show-secrets</code> (manage role)</>,
              used: <><Var course="storage-iscsi-3lun" name="CHAP_USER" /> / <Var course="storage-iscsi-3lun" name="CHAP_PASS" /> in B5 · store in password vault</>,
            },
            {
              value: "CHAP enabled on array",
              gui: "System → Security → CHAP",
              cli: <><code>show iscsi-parameters</code> → <code>CHAP</code></>,
              used: "B5 — must be enabled or iSCSI login fails",
            },
            {
              value: "MTU 9000 (jumbo frames)",
              gui: "System → Network → iSCSI Ports",
              cli: <><code>show iscsi-parameters</code> → <code>Jumbo Frames</code> (disabled by default) · enable with <code>set iscsi-parameters jumbo-frame enabled</code></>,
              used: "A4 · B1 server NIC MTU — both sides must match",
            },
            {
              value: "iSCSI link speed",
              gui: "System → Network → iSCSI Ports",
              cli: <><code>show iscsi-parameters</code> → <code>iSCSI Speed</code> (auto / 1Gbps)</>,
              used: "Sanity check only",
            },
            {
              value: "Controller iSCSI portal IPs",
              gui: "System → Network → iSCSI Ports",
              cli: "Not exposed by CLI — read from GUI and record",
              used: <><Var course="storage-iscsi-3lun" name="CTRL_A_IP" /> / <Var course="storage-iscsi-3lun" name="CTRL_B_IP" /> in B3 and iSCSI discovery</>,
            },
            {
              value: "Session tuning: queue_depth, cmds_max, burst lengths, NOP timers",
              gui: "Not exposed — initiator-side setting",
              cli: "Not exposed by array CLI",
              used: "B5 · verify negotiated values after login with <code>iscsiadm -m session -P 3</code>",
            },
          ]}
        />

        <Callout variant="info">
          <strong>Nothing else needs to be asked for.</strong>{" "}
          The B2 kernel tuning (<code>99-xdr.conf</code>) uses fixed generic values, and the B5
          session tuning is initiator-side with no array counterpart to confirm. If the storage
          team cannot hand over CHAP credentials, create them yourself in
          System → Security → CHAP (A4) and store them in the password vault.
        </Callout>
      </Subsection>

      {/* ── A1 ── */}
      <Subsection id="a1" title="A1. Create the Disk Group (RAID-6)">
        <NodeTag label="ME4024 Web UI" variant="arr" />
        <Prose>
          The <Var course="storage-iscsi-3lun" name="ARRAY_MODEL" /> has 24 drive bays. You will
          create one RAID-6 disk group that pools all drives. This is done once — you never
          need to touch the disk group again after this step. All three LUNs come from this
          single disk group.
        </Prose>

        <Callout variant="info">
          Log into the ME4024 web interface at its management IP.
          Default credentials are usually <code>manage / !manage</code> — check the array label
          or ask procurement if the password was changed at delivery.
        </Callout>

        <StepList
          steps={[
            { title: "Go to Pools → Disk Groups → Add Disk Group.", desc: "" },
            { title: "Select RAID level: RAID-6.", desc: "" },
            { title: "Add 22 drives as data disks, 2 drives as dedicated parity. Assign 1 drive as global hot spare.", desc: "" },
            { title: "Name the disk group:", desc: <><Var course="storage-iscsi-3lun" name="DISK_GROUP" /></> },
            { title: "Set chunk size (stripe unit) to 256 KB.", desc: "This must match the XFS format flags used in Phase B." },
            { title: "Click Add.", desc: "The disk group will initialise — this can take several hours on a new array. The array is usable immediately but performance improves as initialisation completes in the background." },
          ]}
        />

        <Callout variant="warn">
          <strong>Do not create LUNs until the disk group shows status: OK.</strong>{" "}
          An initialising disk group can still create volumes, but stripe geometry is not yet
          finalised. Wait for the OK status to avoid permanent write-performance degradation.
        </Callout>

        <VerifyBlock label="Expected result">
          <p>Pools → Disk Groups shows: <code><Var course="storage-iscsi-3lun" name="DISK_GROUP" /></code> · RAID-6 · Status: OK</p>
          <p>Total usable capacity: ~60 TB</p>
        </VerifyBlock>
      </Subsection>

      {/* ── A2 ── */}
      <Subsection id="a2" title="A2. Create the 3 LUNs (Volumes)">
        <NodeTag label="ME4024 Web UI" variant="arr" />
        <Prose>
          Create three volumes from the disk group, each exactly <Var course="storage-iscsi-3lun" name="LUN_SIZE" />.
          Use equal sizes — the application shards data evenly using a hash function (cityHash64).
          Unequal LUN sizes would make one node the bottleneck with no way for the application
          to compensate automatically.
        </Prose>

        <Callout variant="info">
          <strong>Why three array-level LUNs and not one big LUN split with OS LVM?</strong><br />
          A single block device can only be safely mounted by one server at a time — XFS has no
          awareness of other servers. OS-level LVM does not change that fundamental constraint.
          Three separate LUNs at the array layer is the only way to give each server an
          independently writable block device without introducing a cluster filesystem (which
          adds significant operational complexity).
        </Callout>

        <Prose>
          <strong>Create <Var course="storage-iscsi-3lun" name="LUN_NAME_1" /> (will go to <Var course="storage-iscsi-3lun" name="NODE_1" />)</strong>
        </Prose>
        <StepList
          steps={[
            { title: "Go to Volumes → Add Volume.", desc: "" },
            { title: "Name:", desc: <><Var course="storage-iscsi-3lun" name="LUN_NAME_1" /></> },
            { title: "Disk group:", desc: <><Var course="storage-iscsi-3lun" name="DISK_GROUP" /></> },
            { title: "Size:", desc: <><Var course="storage-iscsi-3lun" name="LUN_SIZE" /></> },
            { title: "Write policy: Write Back.", desc: "Requires healthy BBU — verify battery status is green before enabling." },
            { title: "All other settings: leave at defaults. Click Add.", desc: "" },
          ]}
        />

        <Prose>
          <strong>Create <Var course="storage-iscsi-3lun" name="LUN_NAME_2" /> (will go to <Var course="storage-iscsi-3lun" name="NODE_2" />)</strong>
        </Prose>
        <StepList
          steps={[
            { title: "Repeat the same steps above.", desc: <>Name: <Var course="storage-iscsi-3lun" name="LUN_NAME_2" /> · Same disk group · Same size · Same write policy.</> },
          ]}
        />

        <Prose>
          <strong>Create <Var course="storage-iscsi-3lun" name="LUN_NAME_3" /> (will go to <Var course="storage-iscsi-3lun" name="NODE_3" />)</strong>
        </Prose>
        <StepList
          steps={[
            { title: "Repeat again.", desc: <>Name: <Var course="storage-iscsi-3lun" name="LUN_NAME_3" /> · Same disk group · Same size · Same write policy.</> },
          ]}
        />

        <VerifyBlock label="Expected result">
          <p>Volumes list shows: <code><Var course="storage-iscsi-3lun" name="LUN_NAME_1" /></code>, <code><Var course="storage-iscsi-3lun" name="LUN_NAME_2" /></code>, <code><Var course="storage-iscsi-3lun" name="LUN_NAME_3" /></code></p>
          <p>Each: <Var course="storage-iscsi-3lun" name="LUN_SIZE" /> · Write Back · Status: OK · from disk group <Var course="storage-iscsi-3lun" name="DISK_GROUP" /></p>
        </VerifyBlock>
      </Subsection>

      {/* ── A3 ── */}
      <Subsection id="a3" title="A3. Host Access Masking (ACL) — One LUN Per Node">
        <NodeTag label="ME4024 Web UI" variant="arr" />

        <Callout variant="danger">
          <strong>This is the most critical step in the entire guide.</strong>{" "}
          Each LUN must be accessible to exactly one host IQN and no others.
          An incorrect ACL that allows two nodes to see the same LUN will result in
          immediate filesystem corruption the moment both attempt to write.
          Read every entry twice before saving.
        </Callout>

        <Prose>
          <strong>Step 1 — Register each server as a Host in the array</strong>
        </Prose>
        <Prose>
          Go to <strong>Hosts → Create Host</strong> and add one entry per node:
        </Prose>
        <InfoTable
          columns={[
            { header: "Host Name (in array)", key: "host" },
            { header: "IQN — type this exactly", key: "iqn" },
          ]}
          rows={[
            { host: <code><Var course="storage-iscsi-3lun" name="NODE_1" /></code>, iqn: <code>iqn.<Var course="storage-iscsi-3lun" name="IQN_DATE" />.<Var course="storage-iscsi-3lun" name="IQN_DOMAIN" />:<Var course="storage-iscsi-3lun" name="NODE_1" /></code> },
            { host: <code><Var course="storage-iscsi-3lun" name="NODE_2" /></code>, iqn: <code>iqn.<Var course="storage-iscsi-3lun" name="IQN_DATE" />.<Var course="storage-iscsi-3lun" name="IQN_DOMAIN" />:<Var course="storage-iscsi-3lun" name="NODE_2" /></code> },
            { host: <code><Var course="storage-iscsi-3lun" name="NODE_3" /></code>, iqn: <code>iqn.<Var course="storage-iscsi-3lun" name="IQN_DATE" />.<Var course="storage-iscsi-3lun" name="IQN_DOMAIN" />:<Var course="storage-iscsi-3lun" name="NODE_3" /></code> },
          ]}
        />

        <Prose>
          <strong>Step 2 — Map each LUN to exactly one host</strong>
        </Prose>
        <StepList
          steps={[
            { title: <>Go to Volumes → <Var course="storage-iscsi-3lun" name="LUN_NAME_1" /> → Map → Host Access.</>, desc: <>Add <Var course="storage-iscsi-3lun" name="NODE_1" /> only. Confirm <Var course="storage-iscsi-3lun" name="NODE_2" /> and <Var course="storage-iscsi-3lun" name="NODE_3" /> are NOT listed.</> },
            { title: <>Go to Volumes → <Var course="storage-iscsi-3lun" name="LUN_NAME_2" /> → Map → Host Access.</>, desc: <>Add <Var course="storage-iscsi-3lun" name="NODE_2" /> only.</> },
            { title: <>Go to Volumes → <Var course="storage-iscsi-3lun" name="LUN_NAME_3" /> → Map → Host Access.</>, desc: <>Add <Var course="storage-iscsi-3lun" name="NODE_3" /> only.</> },
          ]}
        />

        <Prose>
          <strong>Step 3 — Verify the ACL mapping table</strong>
        </Prose>
        <Prose>
          Go to <strong>Volumes → Mappings</strong>. Confirm this exactly:
        </Prose>
        <InfoTable
          columns={[
            { header: "Volume", key: "vol" },
            { header: "Mapped to", key: "mapped" },
            { header: "Other hosts visible?", key: "other" },
          ]}
          rows={[
            { vol: <code><Var course="storage-iscsi-3lun" name="LUN_NAME_1" /></code>, mapped: <><Var course="storage-iscsi-3lun" name="NODE_1" /> only</>, other: "None — must be empty" },
            { vol: <code><Var course="storage-iscsi-3lun" name="LUN_NAME_2" /></code>, mapped: <><Var course="storage-iscsi-3lun" name="NODE_2" /> only</>, other: "None — must be empty" },
            { vol: <code><Var course="storage-iscsi-3lun" name="LUN_NAME_3" /></code>, mapped: <><Var course="storage-iscsi-3lun" name="NODE_3" /> only</>, other: "None — must be empty" },
          ]}
        />
      </Subsection>

      {/* ── A4 ── */}
      <Subsection id="a4" title="A4. Array Management Settings">
        <NodeTag label="ME4024 Web UI" variant="arr" />
        <StepList
          steps={[
            { title: "Write-back cache:", desc: "Confirm ON for all volumes. Go to System → Controller → Cache Settings. Requires a healthy BBU (battery backup unit) — check battery status is green/healthy first." },
            { title: "iSCSI host port MTU:", desc: "Set to 9000 on both controllers. Go to System → Network → iSCSI Ports. This must match what you set on the server NICs in Phase B." },
            { title: "CHAP authentication:", desc: "Create CHAP credentials. Go to System → Security → CHAP. Record the username and password — you need them for iscsid.conf on every server. Store immediately in your team's password vault." },
            { title: "Health alerts:", desc: "Go to System → Notifications. Route array health events (drive failure, controller fault, BBU degraded) to your on-call email or monitoring system. Do not skip this." },
            { title: "Record the iSCSI portal IPs", desc: "for both controllers (Controller A IP and Controller B IP). You will need these in every iSCSI command in Phase B." },
          ]}
        />
      </Subsection>

      {/* ── A5 ── */}
      <Subsection id="a5" title="A5. Verify Array Before Starting OS Work">
        <NodeTag label="ME4024 Web UI" variant="arr" />
        <Prose>
          Do not start Phase B until every item below is confirmed. A misconfiguration at the
          array level is far harder to fix after OS-level work has been done on top of it.
        </Prose>

        <InfoTable
          columns={[
            { header: "Check", key: "check" },
            { header: "Details", key: "details" },
          ]}
          rows={[
            { check: <>Disk group <Var course="storage-iscsi-3lun" name="DISK_GROUP" /> — Status: OK</>, details: "Not initialising, not degraded" },
            { check: "Three volumes exist", details: <><Var course="storage-iscsi-3lun" name="LUN_NAME_1" />, <Var course="storage-iscsi-3lun" name="LUN_NAME_2" />, <Var course="storage-iscsi-3lun" name="LUN_NAME_3" /> · <Var course="storage-iscsi-3lun" name="LUN_SIZE" /> each · Write Back</> },
            { check: "ACL correct — each LUN mapped to ONE IQN only", details: "Verified in Volumes → Mappings — absolutely no overlap" },
            { check: "Write-back cache ON, BBU battery healthy/green", details: "" },
            { check: "iSCSI host ports MTU 9000 on both controllers", details: "" },
            { check: "CHAP credentials created and stored in password vault", details: "" },
            { check: "Both controllers online", details: "Controller A and Controller B status: OK" },
            { check: "Controller A iSCSI portal IP recorded", details: <Var course="storage-iscsi-3lun" name="CTRL_A_IP" /> },
            { check: "Controller B iSCSI portal IP recorded", details: <Var course="storage-iscsi-3lun" name="CTRL_B_IP" /> },
          ]}
        />
      </Subsection>
    </Section>
  );
}
