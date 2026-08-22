import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section4() {
  return (
    <Section id="phase-b-network" num={4} title="Phase B — Network, IQN and CHAP">

      {/* ── B3 ── */}
      <Subsection id="b3" title="B3. Configure the Storage NIC — MTU 9000, No Gateway">
        <NodeTag label="ALL NODES" variant="all" />

        <Callout variant="warn">
          <strong>The iSCSI NIC must be dedicated to storage traffic only.</strong>{" "}
          It must be on its own storage VLAN (VLAN <Var course="storage-iscsi-3lun" name="STORAGE_VLAN" />),
          set to MTU 9000 (jumbo frames), and must have <strong>no default gateway</strong>.
          If iSCSI traffic routes onto the general network, connectivity is unreliable
          and performance will be severely degraded.
        </Callout>

        <Prose>
          First identify your storage NIC. Run <code>ip a</code> and look for the interface
          connected to the storage VLAN switch. Replace <code>&lt;<Var course="storage-iscsi-3lun" name="STORAGE_NIC" />&gt;</code> below with
          the real name (e.g. <code>ens224</code>, <code>ens192</code>, <code>eth1</code>).
          The IP scheme is: <Var course="storage-iscsi-3lun" name="NODE_1" /> →{" "}
          <Var course="storage-iscsi-3lun" name="NODE_1_IP" />, <Var course="storage-iscsi-3lun" name="NODE_2" /> →{" "}
          <Var course="storage-iscsi-3lun" name="NODE_2_IP" />, <Var course="storage-iscsi-3lun" name="NODE_3" /> →{" "}
          <Var course="storage-iscsi-3lun" name="NODE_3_IP" />.
        </Prose>

        <CodeBlock lang="bash" label="each heavy — identify storage NIC name first">
{`ip a
# Look for the interface on the storage VLAN — note its name`}
        </CodeBlock>

        <CodeBlock lang="bash" label="each heavy — configure via systemd-networkd (edit IP per node)">
{`# Replace <STORAGE_NIC> with your NIC name
# <NODE_1>: Address=<NODE_1_IP>/24
# <NODE_2>: Address=<NODE_2_IP>/24
# <NODE_3>: Address=<NODE_3_IP>/24

nmcli connection modify <STORAGE_NIC>  802-3-ethernet.mtu <MTU>

# Verify MTU applied correctly
ip link show <STORAGE_NIC>`}
        </CodeBlock>

        <CodeBlock lang="bash" label="each heavy — test jumbo frames reach BOTH array controllers (no fragmentation)">
{`# Replace with the actual controller portal IPs you recorded in A4
ping -M do -s 8972 -c 4 <CTRL_A_IP>
ping -M do -s 8972 -c 4 <CTRL_B_IP>`}
        </CodeBlock>

        <VerifyBlock label="Expected output">
          <p>MTU shows 9000 on <code>ip link</code> output.</p>
          <p>Both ping commands: 0% packet loss, no "Frag needed and DF set" errors.</p>
          <p>If you see fragmentation errors → jumbo frames are not end-to-end on the switch. Fix the switch before continuing.</p>
        </VerifyBlock>
      </Subsection>

      {/* ── B4 ── */}
      <Subsection id="b4" title="B4. Set Unique Initiator IQN on Each Node">
        <Callout variant="danger">
          <strong>Run each command on the matching node only.</strong>{" "}
          The IQN must match exactly what you configured in the ME4024 host-access list in A3.
          A mismatch means the array rejects the connection. Triple-check you are on the correct server.
        </Callout>

        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_1" /> only</>} variant="h1" />
        <CodeBlock lang="bash" label={<><Var course="storage-iscsi-3lun" name="NODE_1" /></>} variant="h1">
{`echo "InitiatorName=iqn.<IQN_DATE>.<IQN_DOMAIN>:<NODE_1>" > /etc/iscsi/initiatorname.iscsi
systemctl restart iscsid
cat /etc/iscsi/initiatorname.iscsi`}
        </CodeBlock>

        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_2" /> only</>} variant="h2" />
        <CodeBlock lang="bash" label={<><Var course="storage-iscsi-3lun" name="NODE_2" /></>} variant="h2">
{`echo "InitiatorName=iqn.<IQN_DATE>.<IQN_DOMAIN>:<NODE_2>" > /etc/iscsi/initiatorname.iscsi
systemctl restart iscsid
cat /etc/iscsi/initiatorname.iscsi`}
        </CodeBlock>

        <NodeTag label={<><Var course="storage-iscsi-3lun" name="NODE_3" /> only</>} variant="h3" />
        <CodeBlock lang="bash" label={<><Var course="storage-iscsi-3lun" name="NODE_3" /></>} variant="h3">
{`echo "InitiatorName=iqn.<IQN_DATE>.<IQN_DOMAIN>:<NODE_3>" > /etc/iscsi/initiatorname.iscsi
systemctl restart iscsid
cat /etc/iscsi/initiatorname.iscsi`}
        </CodeBlock>
      </Subsection>

      {/* ── B5 ── */}
      <Subsection id="b5" title="B5. Configure iscsid.conf — CHAP and Session Tuning">
        <NodeTag label="ALL NODES" variant="all" />
        <Prose>
          This file is identical on all three nodes. The CHAP credentials you created in A4 go here.
          Retrieve them from your password vault before running this step.
        </Prose>

        <Callout variant="warn">
          Replace <code>&lt;<Var course="storage-iscsi-3lun" name="CHAP_USER" />&gt;</code> and <code>&lt;<Var course="storage-iscsi-3lun" name="CHAP_PASS" />&gt;</code>{" "}
          with the real CHAP credentials from your vault.
          Leaving placeholders will cause iSCSI login to fail with an authentication error.
        </Callout>

        <CodeBlock lang="bash" label="all nodes — /etc/iscsi/iscsid.conf">
{`cat > /etc/iscsi/iscsid.conf <<'EOF'
node.startup                                = automatic
node.leading_login                          = No

# Session timers — tuned for 10K HDD over 10 GbE
node.session.timeo.replacement_timeout      = 15
node.conn[0].timeo.noop_out_interval        = 5
node.conn[0].timeo.noop_out_timeout         = 10
node.session.err_timeo.abort_timeout        = 15
node.session.err_timeo.lu_reset_timeout     = 20

# Queue depth and burst — tuned for 10K HDD workload
node.session.cmds_max                       = 1024
node.session.queue_depth                    = 128
node.session.iscsi.MaxBurstLength           = 524288
node.session.iscsi.FirstBurstLength         = 262144
node.session.iscsi.MaxRecvDataSegmentLength = 262144

# CHAP — retrieve credentials from password vault
node.session.auth.authmethod                = CHAP
node.session.auth.username                  = <CHAP_USER>
node.session.auth.password                  = <CHAP_PASS>
EOF

systemctl restart iscsid`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Confirm the values after login.</strong>{" "}
          After the first iSCSI session is up (Phase B iSCSI login), run{" "}
          <code>iscsiadm -m session -P 3</code> on any node. The session section shows the
          negotiated values — <code>MaxBurstLength</code>, <code>FirstBurstLength</code>,
          <code>MaxRecvDataSegmentLength</code>, and queue depth. The ME4024 does not expose or
          limit these, so this output is the confirmation that the tuning above took effect.
        </Callout>
      </Subsection>
    </Section>
  );
}
