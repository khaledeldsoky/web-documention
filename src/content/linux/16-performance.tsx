import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";

export function Section16() {
  return (
    <Section id="performance" num={16} title="Performance Diagnostics">
      <Prose>
        Performance analysis is an essential skill for a system administrator.
        Tools like <code>top</code>, <code>vmstat</code>, <code>iostat</code>,{" "}
        <code>sar</code> help you understand what the system needs before it
        crashes.
      </Prose>

      {/* ── 1. Basic Tools ── */}
      <Subsection title="Basic Tools — CPU, Memory, Disk, Network">
        <InfoTable
          columns={[
            { header: "Tool", key: "tool" },
            { header: "What it measures?", key: "measures" },
            { header: "Quick Example", key: "example" },
          ]}
          rows={[
            {
              tool: "<code>top / htop</code>",
              measures: "CPU + Memory per process",
              example: "<code>top -o %CPU</code>",
            },
            {
              tool: "<code>vmstat 2</code>",
              measures: "System — procs, memory, swap, IO, CPU",
              example: "<code>vmstat 2 5</code>",
            },
            {
              tool: "<code>iostat -x 2</code>",
              measures: "Disk — await, %util, r/s, w/s",
              example: "<code>iostat -x 1</code>",
            },
            {
              tool: "<code>sar -u 2 5</code>",
              measures: "CPU utilization history",
              example: "<code>sar -u -f /var/log/sa/sa21</code>",
            },
            {
              tool: "<code>free -h</code>",
              measures: "Memory — used, available, swap",
              example: "<code>free -h;cat /proc/meminfo</code>",
            },
            {
              tool: "<code>netstat / ss</code>",
              measures: "Network — connections, ports",
              example: "<code>ss -tuln</code>",
            },
            {
              tool: "<code>pidstat 2</code>",
              measures: "Per-process CPU/memory",
              example: "<code>pidstat -r 2 5</code>",
            },
            {
              tool: "<code>strace -c</code>",
              measures: "System calls per process",
              example: "<code>strace -c -p 1234</code>",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Quick Performance Diagnostic Commands">
{`# CPU — top 10 consuming processes
ps aux --sort=-%cpu | head -10

# Memory — top 10 consuming processes
ps aux --sort=-%mem | head -10

# Disk I/O — read and write per process
iotop -o

# Network connections count
ss -s

# Load average for 1, 5, 15 minutes
uptime

# Amount of context switches
vmstat 2 5

# Show open file descriptors
lsof | wc -l

# Memory bottleneck — is swap active?
vmstat 1 | awk '{print $3}'`}
        </CodeBlock>

        <Callout variant="info">
          <strong>80/20 Rule:</strong> Focus on the top 20% of processes that
          consume 80% of resources. <code>top -o %CPU</code> and{" "}
          <code>ps aux --sort=-%cpu</code> are the first things you run.
        </Callout>
      </Subsection>

      {/* ── 2. Memory ── */}
      <Subsection title="Memory — Virtual Memory, Swap, Page Cache">
        <Prose>
          Linux uses RAM as page cache (disk cache memory) to speed up access.{" "}
          <code>free -h</code> shows <code>available</code> which is the actual
          memory available to applications.
        </Prose>

        <CodeBlock lang="bash" label="Memory Check — In Detail">
{`# Total and available memory
free -h
#               total  used  free  shared  buff/cache  available
# Mem:          7.6G   2.1G  3.2G   120M       2.3G       5.1G
# Swap:         2.0G   0.0B  2.0G

# /proc/meminfo details
grep -E '^(MemTotal|MemAvailable|SwapTotal|SwapFree)' /proc/meminfo

# Is there swap activity? If yes, you need more RAM
vmstat 1  # si (swap in), so (swap out) — if greater than 0, it is a problem

# Find out what is using swap
for file in /proc/*/status ; do
    awk '/VmSwap|Name/{printf $2 " " $4}END{ print ""}' $file 2>/dev/null
done | sort -k 2 -n -r | head -10`}
        </CodeBlock>
      </Subsection>

      {/* ── 3. Disk I/O ── */}
      <Subsection title="Disk I/O — Disk Performance Analysis">
        <Prose>
          <code>iostat</code> and <code>iotop</code> are your tools for
          understanding disk performance. The most important things to monitor:{" "}
          <code>%util</code> and <code>await</code>.
        </Prose>

        <CodeBlock lang="bash" label="iostat — Disk Analysis">
{`# Monitor all disks — update every 2 seconds
iostat -x 2

# Important columns:
# r/s, w/s    — read/write operations per second
# rkB/s, wkB/s — kilobytes read/written per second
# await       — average wait time (ms) — very important
# %util       — disk utilization percentage — if 100%, it's a bottleneck

# If await is high and %util isn't 100%, the problem is in disk hardware
# If %util is 100% and await is high, the disk can't keep up`}
        </CodeBlock>
      </Subsection>

      {/* ── 4. Network Performance ── */}
      <Subsection title="Network Performance">
        <CodeBlock lang="bash" label="Network Tools — Quick Diagnosis">
{`# Show interface and utilization
ip -s link show eth0

# Or use sar
sar -n DEV 2 5

# Check latency and packet loss
ping -c 10 8.8.8.8

# Trace packet path
mtr google.com

# Show connections — ss is faster than netstat
ss -tuln
ss -s

# Measure bandwidth
iperf3 -c server_ip

# Monitor traffic in real-time
nethogs
iftop`}
        </CodeBlock>
      </Subsection>

      {/* ── 5. CPU — Load Average ── */}
      <Subsection title="CPU — Load Average Explained">
        <CodeBlock lang="bash" label="Load Average Explained">
{`# load average: 1.50, 2.00, 1.75     (1, 5, 15 minutes)

# Rule: load compared to number of CPU cores
#   load < number of cores → system is fine
#   load > number of cores × 1.5 → might be a problem
#   load > number of cores × 2 → system under pressure

# Example: server with 4 cores and load = 6.0
#   → 6 / 4 = 1.5 → system is under high pressure, you need to act

# Find number of cores
nproc
# Or
grep -c ^processor /proc/cpuinfo`}
        </CodeBlock>

        <Callout variant="success">
          <strong>Tip:</strong> high load doesn&apos;t mean CPU is busy —
          processes might be waiting for I/O (disk or network). Use{" "}
          <code>vmstat</code> to see <code>wa</code> (I/O wait).
        </Callout>
      </Subsection>
    </Section>
  );
}
