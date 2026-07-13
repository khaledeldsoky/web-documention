import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";

export function Section12() {
  return (
    <Section id="networking" num={12} title="Networking Config">
      <Prose>
        Network configuration in Linux has changed over time. Today{" "}
        <code>nmcli</code> and <code>ip</code> are the primary tools, replacing
        the old <code>ifconfig</code> and <code>netstat</code>.
      </Prose>

      {/* ── 1. nmcli ── */}
      <Subsection title="nmcli — Network Manager CLI">
        <Prose>
          <code>nmcli</code> is the network management tool in
          RHEL/CentOS/Fedora. It controls NetworkManager — responsible for
          connections.
        </Prose>

        <CodeBlock lang="bash" label="nmcli — Basic Commands">
{`# Show device status
nmcli device status
# DEVICE   TYPE      STATE      CONNECTION
# eth0     ethernet  connected  eth0
# lo       loopback  unmanaged  --

# Show connections
nmcli connection show
# NAME   UUID                                  TYPE      DEVICE
# eth0   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  ethernet  eth0

# Connection details
nmcli connection show eth0

# Change IP (static)
nmcli connection modify eth0 ipv4.addresses 192.168.1.100/24
nmcli connection modify eth0 ipv4.gateway 192.168.1.1
nmcli connection modify eth0 ipv4.dns 8.8.8.8
nmcli connection modify eth0 ipv4.method manual

# Activate changes
nmcli connection up eth0

# DHCP
nmcli connection modify eth0 ipv4.method auto
nmcli connection up eth0`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Note:</strong> Any change with nmcli needs{" "}
          <code>nmcli connection up</code> to take effect. If you&apos;re
          modifying an active connection, use <code>--ask</code> or restart the
          interface.
        </Callout>
      </Subsection>

      {/* ── 2. ip ── */}
      <Subsection title="ip — ifconfig Replacement">
        <CodeBlock lang="bash" label="ip Commands — addr, link, route, neigh">
{`# ip addr — Show and modify IPs
ip addr show eth0
ip addr add 192.168.1.100/24 dev eth0
ip addr del 192.168.1.100/24 dev eth0

# ip link — Device management
ip link set eth0 up
ip link set eth0 down
ip link set eth0 mtu 9000

# ip route — Routing table
ip route show
ip route add default via 192.168.1.1
ip route del default

# ip neigh — ARP table
ip neigh show`}
        </CodeBlock>
      </Subsection>

      {/* ── 3. Configuration Files ── */}
      <Subsection title="Configuration Files — /etc/sysconfig/network-scripts/">
        <Prose>
          In RHEL/CentOS, ifcfg files are in{" "}
          <code>/etc/sysconfig/network-scripts/</code> (RHEL 9 still supports
          them, but nmcli is recommended).
        </Prose>

        <CodeBlock lang="bash" label="ifcfg-eth0 — Example">
{`DEVICE=eth0
BOOTPROTO=static
IPADDR=192.168.1.100
PREFIX=24
GATEWAY=192.168.1.1
DNS1=8.8.8.8
DNS2=1.1.1.1
ONBOOT=yes`}
        </CodeBlock>
      </Subsection>

      {/* ── 4. Network Bonding ── */}
      <Subsection title="Network Bonding">
        <Prose>
          Bonding combines two NICs into one interface — for increased speed or
          redundancy.
        </Prose>

        <CodeBlock lang="bash" label="Create Bond interface">
{`# Create bond0
nmcli connection add type bond con-name bond0 ifname bond0 mode active-backup
nmcli connection add type ethernet con-name eth0 ifname eth0 master bond0
nmcli connection add type ethernet con-name eth1 ifname eth1 master bond0

# modes:
# active-backup  → one active, one standby
# balance-rr     → Load balancing (Round Robin)
# 802.3ad        → LACP (with switch support)`}
        </CodeBlock>
      </Subsection>

      {/* ── 5. DNS Resolution ── */}
      <Subsection title="/etc/hosts, /etc/resolv.conf, /etc/nsswitch.conf">
        <CodeBlock lang="bash" label="Domain Name Resolution">
{`# /etc/hosts — Manual IP to name mapping
192.168.1.10  db-server.internal

# /etc/resolv.conf — DNS servers
search internal.company.com
nameserver 8.8.8.8
nameserver 1.1.1.1

# /etc/nsswitch.conf — Lookup order
hosts:      files dns myhostname
# files → /etc/hosts priority
# dns   → then DNS`}
        </CodeBlock>
      </Subsection>

      {/* ── 6. Old vs New ── */}
      <Subsection title="ss and ip — Alternatives to netstat and ifconfig">
        <InfoTable
          columns={[
            { header: "Old", key: "old" },
            { header: "New", key: "new" },
          ]}
          rows={[
            {
              old: "<code>ifconfig</code>",
              new: "<code>ip addr</code> / <code>ip link</code>",
            },
            {
              old: "<code>netstat -tulnp</code>",
              new: "<code>ss -tulnp</code>",
            },
            {
              old: "<code>route -n</code>",
              new: "<code>ip route</code>",
            },
            {
              old: "<code>arp -a</code>",
              new: "<code>ip neigh</code>",
            },
          ]}
        />

        <Callout variant="info">
          <strong>Note:</strong> <code>ifconfig</code> and{" "}
          <code>netstat</code> still work but are not installed by default in
          RHEL 9+. <code>ip</code> and <code>ss</code> are the future.
        </Callout>
      </Subsection>
    </Section>
  );
}
