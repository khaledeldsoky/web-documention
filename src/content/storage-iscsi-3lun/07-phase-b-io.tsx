import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section7() {
  return (
    <Section id="phase-b-io" num={7} title="Phase B — I/O Scheduler and Directories">

      {/* ── B11 ── */}
      <Subsection id="b11" title="B11. Set I/O Scheduler for Spinning HDD">
        <NodeTag label="ALL NODES" variant="all" />
        <Prose>
          The <code>mq-deadline</code> scheduler is optimal for rotational HDD workloads —
          it batches requests by sector order to minimise seek time.
          The CFQ/BFQ defaults are inappropriate for database I/O patterns.
          Set this persistently via udev so it survives reboots.
        </Prose>

        <CodeBlock lang="bash" label="all nodes — persistent I/O scheduler via udev">
{`cat > /etc/udev/rules.d/60-xdr-ioscheduler.rules <<'EOF'
ACTION=="add|change", KERNEL=="dm-[0-9]*", ATTR{queue/scheduler}="mq-deadline", ATTR{bdi/read_ahead_kb}="4096"
EOF

udevadm control --reload && udevadm trigger

# Verify — find the dm device number for your LUN alias first
ls -la /dev/mapper/<LUN_NAME_1>   # note the dm-N number

# Check scheduler (output must contain [mq-deadline])
cat /sys/block/dm-<N>/queue/scheduler`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p><code>cat /sys/block/dm-N/queue/scheduler</code> output includes: <code>[mq-deadline]</code></p>
          <p>(the active scheduler is shown in square brackets)</p>
        </VerifyBlock>
      </Subsection>

      {/* ── B12 ── */}
      <Subsection id="b12" title={<>B12. Directories, Permissions and <Var course="storage-iscsi-3lun" name="NODE_1" /> Special Setup</>}>
        <Prose>
          <strong>Set ownership — all three nodes</strong>
        </Prose>
        <NodeTag label="ALL NODES (substitute N)" variant="all" />
        <CodeBlock lang="bash" label="each heavy — substitute N with 1, 2, or 3">
{`# uid <APP_UID> = application user (ClickHouse, decoder, and workload processes run as this uid)
chown <APP_UID>:<APP_UID> <MOUNT_BASE>/pv-root-<N>
chmod 0775 <MOUNT_BASE>/pv-root-<N>`}
        </CodeBlock>

        <Prose>
          <strong>File-ingress directories — <Var course="storage-iscsi-3lun" name="NODE_1" /> only</strong>
        </Prose>
        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_1" /> only</>} variant="h1" />
        <Prose>
          <Var course="storage-iscsi-3lun" name="NODE_1" /> has an extra role as the file-ingress node (it runs the decoder pod).
          Create these directories and symlinks on <Var course="storage-iscsi-3lun" name="NODE_1" /> only.
          <Var course="storage-iscsi-3lun" name="NODE_2" /> and <Var course="storage-iscsi-3lun" name="NODE_3" /> do not need this structure.
        </Prose>
        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="NODE_1" /> — file-ingress directory structure and symlinks</span>} variant="h1">
{`# Decoder input and output directories
mkdir -p <MOUNT_BASE>/pv-root-1/feeds/{sip,map,isup}
mkdir -p <MOUNT_BASE>/pv-root-1/decoded/{sip,map,isup}
chown -R <APP_UID>:<APP_UID> <MOUNT_BASE>/pv-root-1/feeds
chown -R <APP_UID>:<APP_UID> <MOUNT_BASE>/pv-root-1/decoded

# Symlinks so the decoder pod's hostPath (/srv/xdr/feeds and /srv/xdr/decoded)
# resolves correctly to the mounted LUN without changing the application config
ln -s <MOUNT_BASE>/pv-root-1/feeds   <MOUNT_BASE>/feeds
ln -s <MOUNT_BASE>/pv-root-1/decoded <MOUNT_BASE>/decoded

# Verify
ls -la <MOUNT_BASE>/`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
