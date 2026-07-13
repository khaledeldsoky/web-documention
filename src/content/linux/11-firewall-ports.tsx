import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section11() {
  return (
    <Section id="firewall-ports" num={11} title="Firewall & Ports">
      <Prose>
        <code>firewalld</code> is the primary firewall manager in
        RHEL/CentOS/Fedora systems. It uses zones to manage rules flexibly.
        Knowing who holds a specific port and where it&apos;s coming from is
        essential for troubleshooting.
      </Prose>

      {/* ── 1. Open and Close a Port ── */}
      <Subsection title="Open and Close a Port">
        <CodeBlock lang="bash" label="Basic firewall-cmd Commands">
{`# Open port (temporary — lost after reload)
firewall-cmd --add-port=8080/tcp

# Open port (permanent — persists after reload)
firewall-cmd --permanent --add-port=8080/tcp

# Close port
firewall-cmd --permanent --remove-port=8080/tcp

# Show open ports in current zone
firewall-cmd --list-ports

# Show all rules
firewall-cmd --list-all`}
        </CodeBlock>
      </Subsection>

      {/* ── 2. Reload vs Restart ── */}
      <Subsection title="Reload vs Restart — The Difference">
        <Prose>
          After modifying firewall rules, you need to apply the changes. There
          are two methods:
        </Prose>

        <InfoTable
          columns={[
            { header: "Command", key: "cmd" },
            { header: "Behavior", key: "behavior" },
            { header: "When to use", key: "when" },
          ]}
          rows={[
            {
              cmd: "<code>firewall-cmd --reload</code>",
              behavior:
                "Reloads rules without dropping existing connections (not stateful)",
              when: "Daily changes — does not interrupt services",
            },
            {
              cmd: "<code>firewall-cmd --complete-reload</code>",
              behavior: "Drops all connections and rebuilds rules from scratch",
              when: "When applying major changes (rare)",
            },
            {
              cmd: "<code>systemctl reload firewalld</code>",
              behavior: "Similar to --reload but via systemd",
              when: "When modifying config files directly",
            },
            {
              cmd: "<code>systemctl restart firewalld</code>",
              behavior:
                "Stops and starts the service — temporarily drops all connections",
              when: "If the service is stuck or unresponsive",
            },
          ]}
        />

        <Callout variant="warn">
          <strong>Important reminder:</strong> If you add a rule with{" "}
          <code>--permanent</code> only and don&apos;t do{" "}
          <code>--reload</code>, the rule won&apos;t take effect until reload.
          Conversely: if you add a rule without <code>--permanent</code>, the
          rule is active immediately but disappears after reload.
        </Callout>

        <VerifyBlock label="Best Practice">
          <p>
            # Add the rule (permanent) then reload immediately
          </p>
          <p>
            <code>
              firewall-cmd --permanent --add-port=8080/tcp &amp;&amp;
              firewall-cmd --reload
            </code>
          </p>
        </VerifyBlock>
      </Subsection>

      {/* ── 3. Find who opened the Port ── */}
      <Subsection title="Find out who opened the Port — Listening">
        <Prose>
          The best and most modern is to use <code>ss</code> instead of{" "}
          <code>netstat</code>.
        </Prose>

        <CodeBlock lang="bash" label="ss -lntp | grep :PORT">
{`# Who opened port 80?
ss -lntp | grep :80
# LISTEN 0  511  *:80   *:*   users:(("nginx",pid=1234,fd=6))

# Explanation:
# LISTEN     → Port is open and accepting connections
# nginx      → Program name
# pid=1234   → Process number
# *:80       → Listening on all IPs on port 80`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Flags meaning:</strong> <code>-l</code> (listening only),{" "}
          <code>-n</code> (numeric — don&apos;t resolve names),{" "}
          <code>-t</code> (TCP only), <code>-p</code> (show the process).
        </Callout>
      </Subsection>

      {/* ── 4. Established connections ── */}
      <Subsection title="See all actual connections — Established">
        <Prose>
          The difference from above: without <code>-l</code> to show connections
          that are actually happening.
        </Prose>

        <CodeBlock lang="bash" label="ss -ntp | grep :PORT">
{`# Who is connected to port 80 right now?
ss -ntp | grep :80
# ESTAB  0  0  192.168.1.50:54000  192.168.1.10:80  users:(("nginx",pid=1234))

# Explanation:
# ESTAB           → Actual established connection
# 192.168.1.50    → Client IP that is connected
# 54000           → Client Port (random)
# 192.168.1.10    → Your server
# 80              → Server Port`}
        </CodeBlock>
      </Subsection>

      {/* ── 5. lsof ── */}
      <Subsection title="A Very Powerful Method — lsof">
        <Prose>
          The <code>lsof</code> command gives you complete details about open
          files including network connections.
        </Prose>

        <CodeBlock lang="bash" label="lsof -i :PORT">
{`# Complete details about port 443
lsof -i :443
# COMMAND  PID   USER   FD   TYPE  DEVICE  NODE  NAME
# nginx    1234  root   6u   IPv4  12345   TCP   *:https (LISTEN)
# nginx    1235  www    7u   IPv4  12346   TCP   10.0.0.1:443->10.0.0.2:56000 (ESTABLISHED)

# Shows you: Process, PID, user, connection type, local and remote IP`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>Note:</strong> <code>lsof</code> needs <code>sudo</code>{" "}
          privileges to see all processes. Alternative if not available:{" "}
          <code>ss -tulnp</code> (with sudo).
        </Callout>
      </Subsection>

      {/* ── 6. Process Details ── */}
      <Subsection title="Process Details">
        <Prose>
          After getting the PID from the commands above, you can find more
          details about the process:
        </Prose>

        <CodeBlock lang="bash" label="Process Details from PID">
{`# Complete process details
ps -fp 1234
# UID   PID  PPID  C STIME TTY      TIME CMD
# root 1234     1  0 10:30 ?    00:00:00 nginx: master process /usr/sbin/nginx

# See the command line used to run it
cat /proc/1234/cmdline | tr '\0' ' '
# /usr/sbin/nginx -c /etc/nginx/nginx.conf`}
        </CodeBlock>
      </Subsection>

      {/* ── 7. Everything in One Command ── */}
      <Subsection title="Everything in One Powerful Command">
        <CodeBlock lang="bash" label="sudo ss -tulnp">
{`# All open ports with Processes (TCP + UDP)
sudo ss -tulnp
# Netid  State   Recv-Q  Send-Q  Local Address:Port   Peer Address:Port   Process
# tcp    LISTEN  0       128     0.0.0.0:22           0.0.0.0:*           users:(("sshd",pid=789))
# tcp    LISTEN  0       511     *:80                 *:*                 users:(("nginx",pid=1234))
# tcp    LISTEN  0       128     *:443                *:*                 users:(("nginx",pid=1234))
# udp    LISTEN  0       128     *:5353               *:*                 users:(("avahi",pid=456))`}
        </CodeBlock>

        <Callout variant="success">
          <strong>Tip:</strong> Memorize this command{" "}
          <code>sudo ss -tulnp</code> — it&apos;s the first thing you run to
          see all running services on the server and the ports they are listening
          on.
        </Callout>
      </Subsection>

      {/* ── 8. Quick Summary ── */}
      <Subsection title="Quick Summary">
        <InfoTable
          columns={[
            {
              header: "You want to know...",
              key: "question",
            },
            { header: "Command", key: "cmd" },
          ]}
          rows={[
            {
              question: "Who opened a port?",
              cmd: "<code>ss -lntp</code>",
            },
            {
              question: "Who is actually connected?",
              cmd: "<code>ss -ntp</code>",
            },
            {
              question: "Full details?",
              cmd: "<code>lsof -i:port</code>",
            },
            {
              question: "Everything in one command",
              cmd: "<code>sudo ss -tulnp</code>",
            },
          ]}
        />
      </Subsection>

      {/* ── 9. Listening vs Established ── */}
      <Subsection title="Listening vs Established — The Difference">
        <Callout variant="info">
          <strong>Listening:</strong> The port is open and ready to accept
          connections (like an open door). The server is waiting for someone to
          connect. Example: <code>sshd</code> on port 22.
          <br />
          <br />
          <strong>Established:</strong> There is an actual connection between two
          devices. The door isn&apos;t just open — someone came through it.
          Example: A client connected via SSH right now.
        </Callout>

        <VerifyBlock label="Quick difference in the command">
          <p># Listening only: Shows open ports that are waiting</p>
          <p>
            <code>ss -lntp</code>
          </p>
          <p># Established: Shows connections that are actually happening</p>
          <p>
            <code>ss -ntp | grep ESTAB</code>
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
