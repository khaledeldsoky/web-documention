import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";

export function Section9() {
  return (
    <Section id="kernel" num={9} title="Kernel & Modules">
      <Prose>
        The Kernel is the heart of Linux — it manages the CPU, RAM, devices,
        and all processes. Modules are parts of the Kernel that can be loaded
        and unloaded during operation without rebooting.
      </Prose>

      {/* ── 1. Kernel Information ── */}
      <Subsection title="Kernel Information">
        <CodeBlock lang="bash" label="uname — System Information">
{`# All information
uname -a
# Linux server 5.14.0-284.11.1.el9_2.x86_64 #1 SMP ...

# Kernel version
uname -r
# 5.14.0-284.11.1.el9_2.x86_64

# Info from /proc
cat /proc/version
# Linux version 5.14.0-284.11.1.el9_2.x86_64 ...`}
        </CodeBlock>
      </Subsection>

      {/* ── 2. Managing Modules ── */}
      <Subsection title="Managing Modules">
        <InfoTable
          columns={[
            { header: "Command", key: "cmd" },
            { header: "Description", key: "desc" },
          ]}
          rows={[
            {
              cmd: "<code>lsmod</code>",
              desc: "Show currently loaded modules",
            },
            {
              cmd: "<code>modprobe nvme</code>",
              desc: "Load a module",
            },
            {
              cmd: "<code>modprobe -r nvme</code>",
              desc: "Remove a module",
            },
            {
              cmd: "<code>modinfo nvme</code>",
              desc: "Module information",
            },
            {
              cmd: "<code>rmmod nvme</code>",
              desc: "Remove module (without dependencies)",
            },
          ]}
        />

        <CodeBlock lang="bash" label="lsmod and modinfo">
{`# Display loaded modules
lsmod | head -10
# Module           Size  Used by
# nvme            49152  2
# nvme_core      131072  3 nvme

# Module information
modinfo nvme
# filename:       /lib/modules/5.14.0/kernel/drivers/nvme/host/nvme.ko.xz
# license:        GPL
# description:    NVMe Storage Driver`}
        </CodeBlock>

        <Subsection title="/etc/modprobe.d/ — Module Configuration">
          <CodeBlock lang="bash" label="Prevent module loading — blacklist">
{`# /etc/modprobe.d/blacklist.conf
blacklist nouveau
blacklist pcspkr

# Or temporarily prevent module loading
echo "blacklist nouveau" > /etc/modprobe.d/blacklist-nvidia.conf`}
          </CodeBlock>
        </Subsection>
      </Subsection>

      {/* ── 3. sysctl ── */}
      <Subsection title="sysctl — Modify Kernel Parameters at Runtime">
        <CodeBlock lang="bash" label="sysctl — Examples">
{`# Show all parameters
sysctl -a | head -20

# Show specific parameter
sysctl net.ipv4.ip_forward
# net.ipv4.ip_forward = 0

# Enable IP Forwarding (temporary)
sysctl -w net.ipv4.ip_forward=1

# Permanent change — add to /etc/sysctl.conf
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p   # Apply changes`}
        </CodeBlock>

        <Callout variant="info">
          <strong>sysctl.conf:</strong> The main file for permanent Kernel
          modifications. In RHEL/CentOS 8+, use <code>/etc/sysctl.d/</code>{" "}
          for separate files.
        </Callout>
      </Subsection>

      {/* ── 4. /proc Filesystem ── */}
      <Subsection title="/proc Filesystem — Virtual Kernel">
        <InfoTable
          columns={[
            { header: "File", key: "file" },
            { header: "Function", key: "func" },
          ]}
          rows={[
            {
              file: "<code>/proc/cpuinfo</code>",
              func: "CPU information",
            },
            {
              file: "<code>/proc/meminfo</code>",
              func: "RAM information",
            },
            {
              file: "<code>/proc/uptime</code>",
              func: "System uptime",
            },
            {
              file: "<code>/proc/loadavg</code>",
              func: "Load Average",
            },
            {
              file: "<code>/proc/PID/</code>",
              func: "Information about a specific Process",
            },
          ]}
        />

        <CodeBlock lang="bash" label="/proc Examples">
{`# Check number of Cores
grep -c processor /proc/cpuinfo

# Check RAM
grep MemTotal /proc/meminfo

# Check uptime
cat /proc/uptime
# 2592000.10  (30 days)`}
        </CodeBlock>
      </Subsection>

      {/* ── 5. Kernel Parameters at Boot ── */}
      <Subsection title="Kernel Parameters at Boot">
        <Prose>
          You can pass Parameters to the Kernel from GRUB at boot time. (See{" "}
          <a href="#rescue-grub">Section 19 — Rescue Mode &amp; GRUB</a>).
        </Prose>

        <CodeBlock lang="bash" label="Modify GRUB kernel parameters">
{`# Permanent change — edit /etc/default/grub
GRUB_CMDLINE_LINUX="rhgb quiet net.ifnames=0 biosdevname=0"

# After modification, regenerate GRUB
grub2-mkconfig -o /boot/grub2/grub.cfg   # BIOS
grub2-mkconfig -o /boot/efi/EFI/redhat/grub.cfg   # UEFI`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
