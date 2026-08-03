import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section6() {
  return (
    <Section id="phase-b-lvm" num={6} title="Phase B — LVM, XFS and Mount">

      {/* ── B8 ── */}
      <Subsection id="b8" title="B8. Create LVM on Each Node's Multipath Device">
        <Callout variant="danger">
          <strong>Run each block only on its matching node.</strong>{" "}
          <code>pvcreate</code> writes metadata to the block device.
          Running it on the wrong device destroys all data on that LUN permanently.
          Before each command, confirm your hostname with <code>hostname</code>.
        </Callout>

        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_1" /> only</>} variant="h1" />
        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="NODE_1" /> — LVM on /dev/mapper/<Var course="storage-iscsi-3lun" name="LUN_NAME_1" /></span>} variant="h1">
{`pvcreate /dev/mapper/<LUN_NAME_1>
vgcreate <VG_1>  /dev/mapper/<LUN_NAME_1>
lvcreate -l 100%FREE -n <LV_1>  <VG_1>

# Confirm all three LVM layers
pvs && vgs && lvs`}
        </CodeBlock>

        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_2" /> only</>} variant="h2" />
        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="NODE_2" /> — LVM on /dev/mapper/<Var course="storage-iscsi-3lun" name="LUN_NAME_2" /></span>} variant="h2">
{`pvcreate /dev/mapper/<LUN_NAME_2>
vgcreate <VG_2>  /dev/mapper/<LUN_NAME_2>
lvcreate -l 100%FREE -n <LV_2>  <VG_2>
pvs && vgs && lvs`}
        </CodeBlock>

        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_3" /> only</>} variant="h3" />
        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="NODE_3" /> — LVM on /dev/mapper/<Var course="storage-iscsi-3lun" name="LUN_NAME_3" /></span>} variant="h3">
{`pvcreate /dev/mapper/<LUN_NAME_3>
vgcreate <VG_3>  /dev/mapper/<LUN_NAME_3>
lvcreate -l 100%FREE -n <LV_3>  <VG_3>
pvs && vgs && lvs`}
        </CodeBlock>
      </Subsection>

      {/* ── B9 ── */}
      <Subsection id="b9" title="B9. Format XFS — Stripe-Aligned to RAID-6 Geometry">
        <Prose>
          The flags <code>su=256k,sw=20</code> align XFS allocation units to the ME4024 RAID-6
          stripe geometry (256 KB stripe unit, 20 data drives). Without these flags, XFS generates
          partial-stripe writes that force the array to perform expensive read-modify-write cycles
          on every write operation — this permanently degrades write throughput on spinning HDD.
        </Prose>

        <Callout variant="warn">
          <strong>Format only once, only on the correct node.</strong>{" "}
          The <code>-f</code> flag overwrites all existing data with no confirmation.
          Before pressing Enter, run <code>hostname</code> and <code>lvs</code> to confirm
          you are on the right server formatting the right volume.
        </Callout>

        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_1" /> only</>} variant="h1" />
        <CodeBlock lang="bash" label={<><Var course="storage-iscsi-3lun" name="NODE_1" /></>} variant="h1">
{`mkfs.xfs -f \\
    -L pv-root-1 \\
    -d su=256k,sw=20 \\
    -l size=256m \\
    /dev/<VG_1>/<LV_1>

mkdir -p <MOUNT_BASE>/pv-root-1`}
        </CodeBlock>

        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_2" /> only</>} variant="h2" />
        <CodeBlock lang="bash" label={<><Var course="storage-iscsi-3lun" name="NODE_2" /></>} variant="h2">
{`mkfs.xfs -f \\
    -L pv-root-2 \\
    -d su=256k,sw=20 \\
    -l size=256m \\
    /dev/<VG_2>/<LV_2>

mkdir -p <MOUNT_BASE>/pv-root-2`}
        </CodeBlock>

        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_3" /> only</>} variant="h3" />
        <CodeBlock lang="bash" label={<><Var course="storage-iscsi-3lun" name="NODE_3" /></>} variant="h3">
{`mkfs.xfs -f \\
    -L pv-root-3 \\
    -d su=256k,sw=20 \\
    -l size=256m \\
    /dev/<VG_3>/<LV_3>

mkdir -p <MOUNT_BASE>/pv-root-3`}
        </CodeBlock>
      </Subsection>

      {/* ── B10 ── */}
      <Subsection id="b10" title="B10. Add to fstab and Mount">
        <Callout variant="info">
          <strong>Why <code>_netdev</code> is required and must not be omitted:</strong>{" "}
          Without this flag, systemd attempts to mount the XFS filesystem during early boot —
          before the iSCSI session has been established. The mount fails, and the server
          drops into emergency/recovery mode on every reboot. <code>_netdev</code> tells
          systemd to defer this mount until the network is available. Always include it on
          any iSCSI-backed device.
        </Callout>

        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_1" /> only</>} variant="h1" />
        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="NODE_1" /> — add to /etc/fstab and mount</span>} variant="h1">
{`echo "LABEL=pv-root-1  <MOUNT_BASE>/pv-root-1  xfs  defaults,_netdev,noatime,nodiratime,inode64,allocsize=128m  0 0" >> /etc/fstab

mount <MOUNT_BASE>/pv-root-1
df -h <MOUNT_BASE>/pv-root-1
xfs_info <MOUNT_BASE>/pv-root-1`}
        </CodeBlock>

        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_2" /> only</>} variant="h2" />
        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="NODE_2" /> — add to /etc/fstab and mount</span>} variant="h2">
{`echo "LABEL=pv-root-2  <MOUNT_BASE>/pv-root-2  xfs  defaults,_netdev,noatime,nodiratime,inode64,allocsize=128m  0 0" >> /etc/fstab

mount <MOUNT_BASE>/pv-root-2
df -h <MOUNT_BASE>/pv-root-2
xfs_info <MOUNT_BASE>/pv-root-2`}
        </CodeBlock>

        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_3" /> only</>} variant="h3" />
        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="NODE_3" /> — add to /etc/fstab and mount</span>} variant="h3">
{`echo "LABEL=pv-root-3  <MOUNT_BASE>/pv-root-3  xfs  defaults,_netdev,noatime,nodiratime,inode64,allocsize=128m  0 0" >> /etc/fstab

mount <MOUNT_BASE>/pv-root-3
df -h <MOUNT_BASE>/pv-root-3
xfs_info <MOUNT_BASE>/pv-root-3`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>Reboot test required before going to production.</strong>{" "}
          After adding the fstab entry, reboot <strong><Var course="storage-iscsi-3lun" name="NODE_1" /></strong> and run{" "}
          <code>df -h <Var course="storage-iscsi-3lun" name="MOUNT_BASE" />/pv-root-1</code> after it comes back.
          The mount must be present automatically without any manual intervention.
          If it is not, check that <code>_netdev</code> is in the fstab line and
          that iscsid starts before the mount unit.
        </Callout>

        <VerifyBlock label="Expected output — on each node (substitute N)">
          <p><code>df -h</code>: ~19.5 TiB usable XFS at <code><Var course="storage-iscsi-3lun" name="MOUNT_BASE" />/pv-root-N</code></p>
          <p><code>xfs_info</code>: sunit=512 (256 KB) and swidth=10240 (20 drives × 512 blocks)</p>
          <p>Stripe alignment confirmed — these numbers must match exactly.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
