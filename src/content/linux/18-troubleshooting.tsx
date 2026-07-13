import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import StepList from "@/components/docs/StepList";

export function Section18() {
  return (
    <Section id="troubleshooting" num={18} title="Troubleshooting">
      <Prose>
        Troubleshooting is the skill of &quot;systematic investigation&quot; for
        the cause of a problem. Not just memorizing commands — it&apos;s a
        methodology: Define the problem, gather information, analyze, implement
        the solution, test.
      </Prose>

      {/* ── 1. Diagnostic Methodology ── */}
      <Subsection title="Diagnostic Methodology — 5 Steps">
        <StepList
          steps={[
            {
              title: "Define the Problem",
              desc: "What exactly happened? A user said \"the site is down\" or is there an alert from monitoring?",
            },
            {
              title: "Gather Information",
              desc: "logs, status, metrics (dmesg, journalctl, top, df -h, ping). Start broad then narrow down.",
            },
            {
              title: "Analyze",
              desc: "What's the pattern? What changed before the problem? (last update, config change, traffic increase)",
            },
            {
              title: "Test the Hypothesis",
              desc: "Apply a small fix. If it's a permissions issue? Test with a single operation. If DNS? Try nslookup from the server.",
            },
            {
              title: "Confirm the Solution and Document",
              desc: "Is the problem solved? Make sure it won't come back. Document the steps.",
            },
          ]}
        />
      </Subsection>

      {/* ── 2. Common Problems ── */}
      <Subsection title="Common Problems and Solutions">
        <CodeBlock lang="bash" label="1. Server not responding (SSH not working)">
{`# Step 1: Is the server running? Try ping
ping 192.168.1.100

# Step 2: Is the SSH port open?
nc -zv 192.168.1.100 22

# Step 3: Is sshd running on the server? (need console access)
systemctl status sshd

# Step 4: logs
journalctl -u sshd -n 20 --no-pager

# Step 5: Check firewall rules
iptables -L INPUT -n | grep :22
firewall-cmd --list-all`}
        </CodeBlock>

        <CodeBlock lang="bash" label="2. Disk Full">
{`# Check space
df -h

# Largest files in each directory
du -sh /* 2>/dev/null | sort -rh | head -10

# Largest files in a specific directory
find /var -type f -size +100M -exec ls -lh {} \\; 2>/dev/null | sort -k 5 -rh

# Are there large deleted files still open?
lsof +L1

# Check logs
journalctl --disk-usage

# If large, vacuum old logs
journalctl --vacuum-time=7d`}
        </CodeBlock>

        <CodeBlock lang="bash" label="3. Slow Application">
{`# Is the problem CPU?
top -o %CPU
vmstat 2 10

# Is the problem Memory?
free -h
vmstat 2    # if si, so are high → swap is a problem

# Is the problem Disk I/O?
iostat -x 2

# Is the problem Network?
ss -s
sar -n DEV 2 5
iftop

# Application logs
journalctl -u myapp -n 50 --no-pager`}
        </CodeBlock>
      </Subsection>

      {/* ── 3. Quick Reference ── */}
      <Subsection title="Basic Tools — Quick Reference">
        <InfoTable
          columns={[
            { header: "Problem", key: "problem" },
            { header: "First two commands to run", key: "commands" },
          ]}
          rows={[
            {
              problem: "Server unreachable",
              commands: "<code>ping</code>, <code>traceroute</code>",
            },
            {
              problem: "Service not running",
              commands: "<code>systemctl status</code>, <code>journalctl -u</code>",
            },
            {
              problem: "High Disk I/O",
              commands: "<code>iostat -x 2</code>, <code>iotop</code>",
            },
            {
              problem: "Slow Network",
              commands: "<code>ss -s</code>, <code>iperf3</code>",
            },
            {
              problem: "DNS not working",
              commands: "<code>nslookup</code>, <code>dig</code>",
            },
            {
              problem: "Certificate issue",
              commands: "<code>openssl s_client -connect</code>, <code>certbot certificates</code>",
            },
            {
              problem: "Permission denied",
              commands: "<code>ls -la</code>, <code>getfacl</code>",
            },
            {
              problem: "No space left",
              commands: "<code>df -h</code>, <code>du -sh /*</code>",
            },
          ]}
        />

        <Callout variant="info">
          <strong>First Rule:</strong> Before changing anything, take a snapshot
          or backup the config.{" "}
          <code>cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak</code> might
          save you.
        </Callout>
      </Subsection>
    </Section>
  );
}
