import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import Var from "@/components/docs/Var";
import BenefitGrid from "@/components/docs/BenefitCard";

export function Section1() {
  return (
    <Section id="overview" num={1} title="What You Will Build">
      <Prose>
        The <Var course="storage-iscsi-3lun" name="ARRAY_MODEL" /> holds 60 TB of
        usable storage across a RAID-6 disk group. Instead of one big shared volume,
        this is split into <strong>three <Var course="storage-iscsi-3lun" name="LUN_SIZE" /> LUNs at
        the array level</strong>. Each LUN is assigned to exactly one worker node.
        Each node connects to its LUN over iSCSI (two paths via both array controllers),
        creates a multipath device, an LVM layer, and finally formats XFS.
        Kubernetes then provisions storage into subdirectories on those mounts.
      </Prose>

      <Subsection title="Architecture">
        <CodeBlock lang="text" label="architecture — array to node storage stack">
{`        <ARRAY_MODEL>  (60 TB usable — single RAID-6 disk group)
        ┌─────────────────────────────────────────────────────────┐
        │  LUN <LUN_NAME_1>  (<LUN_SIZE>) ──────────────► <NODE_1> only │
        │  LUN <LUN_NAME_2>  (<LUN_SIZE>) ──────────────► <NODE_2> only │
        │  LUN <LUN_NAME_3>  (<LUN_SIZE>) ──────────────► <NODE_3> only │
        │                                                         │
        │  Controller A ◄────────────────────────► Controller B  │
        │  (iSCSI portal <CTRL_A_IP>)       (iSCSI portal <CTRL_B_IP>) │
        └─────────────────────────────────────────────────────────┘
                 dual iSCSI paths per LUN (ALUA multipath)

        Each node gets a fully independent local storage stack:

  <NODE_1> → iSCSI login (2 sessions) → multipathd /dev/mapper/<LUN_NAME_1>
           → LVM <VG_1>/<LV_1> → XFS → <MOUNT_BASE>/pv-root-1

  <NODE_2> → iSCSI login (2 sessions) → multipathd /dev/mapper/<LUN_NAME_2>
           → LVM <VG_2>/<LV_2> → XFS → <MOUNT_BASE>/pv-root-2

  <NODE_3> → iSCSI login (2 sessions) → multipathd /dev/mapper/<LUN_NAME_3>
           → LVM <VG_3>/<LV_3> → XFS → <MOUNT_BASE>/pv-root-3

        Kubernetes (local-path-provisioner) binds PVCs to the correct node:

        PVC shard-1 (storage-owner-1=true) → <MOUNT_BASE>/pv-root-1/<subdir>
        PVC shard-2 (storage-owner-2=true) → <MOUNT_BASE>/pv-root-2/<subdir>
        PVC shard-3 (storage-owner-3=true) → <MOUNT_BASE>/pv-root-3/<subdir>`}
        </CodeBlock>
      </Subsection>

      <Subsection title="LUN Assignment — Memorise This Table">
        <Callout variant="danger">
          <strong>The array ACL masking is the ONLY thing preventing data corruption.</strong>{" "}
          XFS is not cluster-aware. If two nodes mount the same LUN simultaneously, the
          filesystem is silently destroyed. Every ACL step in this guide exists to prevent
          exactly that. Verify masking twice before mounting.
        </Callout>

        <InfoTable
          columns={[
            { header: "LUN Name", key: "lun" },
            { header: "Size", key: "size" },
            { header: "Assigned Node", key: "node" },
            { header: "IQN for ACL", key: "iqn" },
            { header: "Multipath Alias", key: "alias" },
            { header: "Mount Point", key: "mount" },
          ]}
          rows={[
            {
              lun: <code><Var course="storage-iscsi-3lun" name="LUN_NAME_1" /></code>,
              size: <Var course="storage-iscsi-3lun" name="LUN_SIZE" />,
              node: <strong><Var course="storage-iscsi-3lun" name="NODE_1" /></strong>,
              iqn: <code>iqn.<Var course="storage-iscsi-3lun" name="IQN_DATE" />.<Var course="storage-iscsi-3lun" name="IQN_DOMAIN" />:<Var course="storage-iscsi-3lun" name="NODE_1" /></code>,
              alias: <code>/dev/mapper/<Var course="storage-iscsi-3lun" name="LUN_NAME_1" /></code>,
              mount: <code><Var course="storage-iscsi-3lun" name="MOUNT_BASE" />/pv-root-1</code>,
            },
            {
              lun: <code><Var course="storage-iscsi-3lun" name="LUN_NAME_2" /></code>,
              size: <Var course="storage-iscsi-3lun" name="LUN_SIZE" />,
              node: <strong><Var course="storage-iscsi-3lun" name="NODE_2" /></strong>,
              iqn: <code>iqn.<Var course="storage-iscsi-3lun" name="IQN_DATE" />.<Var course="storage-iscsi-3lun" name="IQN_DOMAIN" />:<Var course="storage-iscsi-3lun" name="NODE_2" /></code>,
              alias: <code>/dev/mapper/<Var course="storage-iscsi-3lun" name="LUN_NAME_2" /></code>,
              mount: <code><Var course="storage-iscsi-3lun" name="MOUNT_BASE" />/pv-root-2</code>,
            },
            {
              lun: <code><Var course="storage-iscsi-3lun" name="LUN_NAME_3" /></code>,
              size: <Var course="storage-iscsi-3lun" name="LUN_SIZE" />,
              node: <strong><Var course="storage-iscsi-3lun" name="NODE_3" /></strong>,
              iqn: <code>iqn.<Var course="storage-iscsi-3lun" name="IQN_DATE" />.<Var course="storage-iscsi-3lun" name="IQN_DOMAIN" />:<Var course="storage-iscsi-3lun" name="NODE_3" /></code>,
              alias: <code>/dev/mapper/<Var course="storage-iscsi-3lun" name="LUN_NAME_3" /></code>,
              mount: <code><Var course="storage-iscsi-3lun" name="MOUNT_BASE" />/pv-root-3</code>,
            },
          ]}
        />
      </Subsection>

      <Subsection title="Advantages and Trade-offs — Know Before You Deploy">
        <BenefitGrid
          cards={[
            {
              icon: "⚡",
              title: "All 3 nodes actively serving data",
              body: "Every heavy node runs its own ClickHouse shard, Kafka broker, and Keeper pod at the same time. No idle standby hardware wasting resources.",
            },
            {
              icon: "🧠",
              title: "Triple database cache",
              body: "Each shard gets its own dedicated mark and uncompressed block cache (≈30 GiB each). Total cluster cache triples compared to a single-node model — the single biggest read performance gain.",
            },
            {
              icon: "🔒",
              title: "Simpler stack — fewer failure modes",
              body: "No cluster storage manager, no NFS daemons, no floating VIPs, no shared-filesystem fencing. Each node mounts its own block device locally. A problem on one node cannot cascade to the others.",
            },
            {
              icon: "🚀",
              title: "Direct local I/O — no protocol overhead",
              body: "All reads and writes hit XFS directly over iSCSI multipath. No NFS protocol layer, no extra caching hop, no metadata round-trips across the network for filesystem operations.",
            },
            {
              icon: "⚠️",
              title: "Trade-off: node failure = that shard offline",
              body: <>If <Var course="storage-iscsi-3lun" name="NODE_2" /> goes down, shard-2 is offline until you manually re-mask its LUN to a surviving node and remount. Data is never lost — the LUN is intact on the array — but recovery is manual and takes 1–4 hours.</>,
              danger: true,
            },
            {
              icon: "🔧",
              title: "Trade-off: no automatic failover",
              body: "Recovery is a deliberate manual DR procedure (documented in this guide). Plan for it. At least two people on the team must know the re-masking steps before go-live. Practice it once in the lab first.",
              danger: true,
            },
          ]}
        />
      </Subsection>
    </Section>
  );
}
