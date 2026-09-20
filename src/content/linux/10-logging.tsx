import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";

export function Section10() {
  return (
    <Section id="logging" num={10} title="Logging & Log Management">
      <Prose>
        Logs are the first thing to check when a problem occurs. Linux has an
        integrated system for collecting, rotating, and managing logs.
      </Prose>

      {/* ── 1. journalctl ── */}
      <Subsection title="journalctl — systemd Logs">
        <Prose>
          <code>journalctl</code> is a tool for reading systemd logs — it
          collects logs from all services and the Kernel.
        </Prose>

        <CodeBlock lang="bash" label="journalctl — Examples">
{`# All logs (requires less)
journalctl

# Logs for a specific service
journalctl -u nginx

# Logs from the last hour
journalctl --since "1 hour ago"

# Logs from a specific time
journalctl --since "2025-01-15 10:00" --until "2025-01-15 12:00"

# Kernel logs
journalctl -k

# Live follow (like tail -f)
journalctl -f

# Error logs only
journalctl -p err

# Last 20 lines with details
journalctl -u sshd -n 20 --no-pager`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Priority Levels:</strong> emerg, alert, crit, err, warning,
          notice, info, debug. Use <code>-p err</code> for errors only.
        </Callout>
      </Subsection>

      {/* ── 2. rsyslog ── */}
      <Subsection title="rsyslog — Traditional Logging">
        <Prose>
          rsyslog collects logs from the system and applications and writes them
          to text files under <code>/var/log/</code>.
        </Prose>

        <InfoTable
          columns={[
            { header: "Log File", key: "file" },
            { header: "Content", key: "content" },
          ]}
          rows={[
            {
              file: "<code>/var/log/messages</code>",
              content: "General system logs",
            },
            {
              file: "<code>/var/log/secure</code>",
              content: "Security logs (SSH, sudo, login)",
            },
            {
              file: "<code>/var/log/maillog</code>",
              content: "Email logs",
            },
            {
              file: "<code>/var/log/cron</code>",
              content: "Cron job logs",
            },
            {
              file: "<code>/var/log/dmesg</code>",
              content: "Kernel logs (boot)",
            },
            {
              file: "<code>/var/log/audit/audit.log</code>",
              content: "SELinux logs",
            },
          ]}
        />

        <CodeBlock lang="bash" label="rsyslog — Configuration">
{`# /etc/rsyslog.conf — Basic rules
*.info;mail.none;authpriv.none;cron.none  /var/log/messages
authpriv.*                                /var/log/secure
mail.*                                    /var/log/maillog
cron.*                                    /var/log/cron

# Add custom rule in /etc/rsyslog.d/
# /etc/rsyslog.d/myapp.conf
local0.*  /var/log/myapp.log

# Restart rsyslog after modification
systemctl restart rsyslog`}
        </CodeBlock>
      </Subsection>

      {/* ── 3. logrotate ── */}
      <Subsection title="logrotate — Log Rotation">
        <Prose>
          Logs grow over time. logrotate compresses and deletes old logs
          automatically.
        </Prose>

        <CodeBlock lang="bash" label="/etc/logrotate.conf">
{`# /etc/logrotate.conf — General settings
weekly            # Weekly rotation
rotate 4          # Keep 4 copies
create            # Create new file after rotation
dateext           # Add date to filename
compress          # Compress old files

# Include custom configuration directory
include /etc/logrotate.d`}
        </CodeBlock>

        <CodeBlock lang="bash" label="logrotate — Custom Configuration">
{`# /etc/logrotate.d/nginx
/var/log/nginx/*.log {
    daily
    rotate 7
    missingok
    compress
    delaycompress
    notifempty
    sharedscripts
    postrotate
        /usr/bin/systemctl reload nginx 2>/dev/null || true
    endscript
}`}
        </CodeBlock>

        <Callout variant="success">
          <strong>Test logrotate:</strong>
          <br />
          <code>logrotate -d /etc/logrotate.conf</code> ← Debug mode
          <br />
          <code>logrotate -f /etc/logrotate.conf</code> ← Force rotation
        </Callout>
      </Subsection>

      {/* ── 4. Persistent Journal ── */}
      <Subsection title="Persistent Journal — Permanent Storage">
        <Prose>
          By default, journald stores logs in memory (lost after reboot). To
          keep them permanently:
        </Prose>

        <CodeBlock lang="bash" label="Enable persistent journal">
{`# Create permanent storage directory
mkdir -p /var/log/journal
systemd-tmpfiles --create --prefix /var/log/journal

# Or enable persistent storage in /etc/systemd/journald.conf
sed -i 's/^#\?Storage=.*/Storage=persistent/' /etc/systemd/journald.conf

# Restart journald
systemctl restart systemd-journald

# Show log size
journalctl --disk-usage`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
