import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section5() {
  return (
    <Section id="phase-b-iscsi" num={5} title="Phase B — iSCSI Discovery and Multipath">

      {/* ── B6 ── */}
      <Subsection id="b6" title="B6. Discover and Login to the Array">
        <NodeTag label="ALL NODES — run independently on each node" variant="all" />
        <Prose>
          The <Var course="storage-iscsi-3lun" name="ARRAY_MODEL" /> has two controllers. Discover
          and log in to <strong>both portal IPs</strong> so multipath has two active paths
          (one per controller) from day one. After login, run <code>lsblk</code> — each node
          must see <strong>only its own LUN</strong>.
        </Prose>

        <CodeBlock lang="bash" label="all nodes — discover both controller portals and login">
{`# Discover targets from Controller A then Controller B
iscsiadm -m discovery -t sendtargets -p <CTRL_A_IP>:3260
iscsiadm -m discovery -t sendtargets -p <CTRL_B_IP>:3260

# Login to all discovered targets
iscsiadm -m node --login

# Check — must show exactly 2 sessions (one per controller)
iscsiadm -m session

# Check what block devices appeared — must be THIS node's LUN only
# <NODE_1> should see <LUN_NAME_1> only
# <NODE_2> should see <LUN_NAME_2> only
# <NODE_3> should see <LUN_NAME_3> only
lsblk`}
        </CodeBlock>

        <Callout variant="danger">
          <strong>If lsblk shows more than one new disk — STOP IMMEDIATELY.</strong>{" "}
          The array ACL is wrong. A node can see a LUN that does not belong to it.
          Return to Phase A3, fix the host-access mapping, and re-run from B6.
          Do NOT continue to the next step.
        </Callout>

        <CodeBlock lang="bash" label="each heavy — get the LUN WWID (needed for multipath.conf)">
{`# Replace /dev/sdX with the new block device shown in lsblk (e.g. /dev/sdb)
/lib/udev/scsi_id -g -u /dev/sdX

# Output: a string starting with "3600..." — write it down, you need it in B7`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p><code>iscsiadm -m session</code>: exactly 2 sessions per node (ctrl-A and ctrl-B).</p>
          <p><code>lsblk</code>: exactly 1 new disk per node — not 2, not 3.</p>
          <p><code>scsi_id</code>: WWID string like <code>3600c0ff000xxxxxxxx</code> (record this per node)</p>
        </VerifyBlock>
      </Subsection>

      {/* ── B7 ── */}
      <Subsection id="b7" title="B7. Configure Multipath — ALUA (dual-path per LUN)">
        <Prose>
          The <Var course="storage-iscsi-3lun" name="ARRAY_MODEL" /> uses ALUA (Asymmetric Logical
          Unit Access): one controller owns the LUN (path shown as <em>active/ready</em>), the other
          is standby (<em>active/ghost</em>). multipathd presents both paths as a single device like{" "}
          <code>/dev/mapper/<Var course="storage-iscsi-3lun" name="LUN_NAME_1" /></code>. If the owning controller fails, ALUA promotes the
          standby path automatically — no action needed from you.
        </Prose>

        <Callout variant="info">
          The <code>defaults</code> and <code>devices</code> blocks are identical on all three nodes.
          Only the <code>wwid</code> and <code>alias</code> differ per node —
          use the WWID you recorded in B6.
        </Callout>

        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_1" /> only</>} variant="h1" />
        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="NODE_1" /> — /etc/multipath.conf</span>} variant="h1">
{`cat > /etc/multipath.conf <<'EOF'
defaults {
    user_friendly_names   yes
    find_multipaths       yes
    path_selector         "service-time 0"
    path_grouping_policy  group_by_prio
    failback              immediate
    no_path_retry         queue
    dev_loss_tmo          60
}

devices {
    device {
        vendor                "DellEMC"
        product               "ME4"
        path_grouping_policy  group_by_prio
        path_checker          tur
        hardware_handler      "1 alua"
        prio                  alua
        failback              immediate
        no_path_retry         queue
    }
}

multipaths {
    multipath {
        wwid   "<LUN_1_WWID>"
        alias  <LUN_NAME_1>
    }
}
EOF

systemctl restart multipathd
multipath -ll <LUN_NAME_1>`}
        </CodeBlock>

        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_2" /> only</>} variant="h2" />
        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="NODE_2" /> — /etc/multipath.conf (same structure, different wwid and alias)</span>} variant="h2">
{`cat > /etc/multipath.conf <<'EOF'
defaults {
    user_friendly_names   yes
    find_multipaths       yes
    path_selector         "service-time 0"
    path_grouping_policy  group_by_prio
    failback              immediate
    no_path_retry         queue
    dev_loss_tmo          60
}

devices {
    device {
        vendor                "DellEMC"
        product               "ME4"
        path_grouping_policy  group_by_prio
        path_checker          tur
        hardware_handler      "1 alua"
        prio                  alua
        failback              immediate
        no_path_retry         queue
    }
}

multipaths {
    multipath {
        wwid   "<LUN_2_WWID>"
        alias  <LUN_NAME_2>
    }
}
EOF

systemctl restart multipathd
multipath -ll <LUN_NAME_2>`}
        </CodeBlock>

        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_3" /> only</>} variant="h3" />
        <CodeBlock lang="bash" label={<span><Var course="storage-iscsi-3lun" name="NODE_3" /> — /etc/multipath.conf</span>} variant="h3">
{`cat > /etc/multipath.conf <<'EOF'
defaults {
    user_friendly_names   yes
    find_multipaths       yes
    path_selector         "service-time 0"
    path_grouping_policy  group_by_prio
    failback              immediate
    no_path_retry         queue
    dev_loss_tmo          60
}

devices {
    device {
        vendor                "DellEMC"
        product               "ME4"
        path_grouping_policy  group_by_prio
        path_checker          tur
        hardware_handler      "1 alua"
        prio                  alua
        failback              immediate
        no_path_retry         queue
    }
}

multipaths {
    multipath {
        wwid   "<LUN_3_WWID>"
        alias  <LUN_NAME_3>
    }
}
EOF

systemctl restart multipathd
multipath -ll <LUN_NAME_3>`}
        </CodeBlock>

        <VerifyBlock label={<>Expected output — multipath -ll <Var course="storage-iscsi-3lun" name="LUN_NAME_1" /> (on each node)</>}>
          <p><code><Var course="storage-iscsi-3lun" name="LUN_NAME_1" /> (3600...) dm-0 DellEMC,ME4</code></p>
          <p><code>size=<Var course="storage-iscsi-3lun" name="LUN_SIZE" /> features='1 queue_if_no_path' hwhandler='1 alua' wp=rw</code></p>
          <p><code>├─+─ policy='service-time 0' prio=50 status=active</code></p>
          <p><code>│   └─ XX:0:0:1 sdX  active ready  running   ← Controller A (owns the LUN)</code></p>
          <p><code>└─+─ policy='service-time 0' prio=10 status=enabled</code></p>
          <p><code>    └─ XX:0:0:1 sdY  active ghost  running   ← Controller B (standby)</code></p>
          <p>Two paths must show. If only one appears → check CHAP credentials and array ACL.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
