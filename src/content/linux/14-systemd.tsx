import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";

export function Section14() {
  return (
    <Section id="systemd" num={14} title="Systemd Deep Dive">
      <Prose>
        systemd is the service and system manager in all modern Linux
        distributions. It is PID 1 — the first Process that runs after the
        Kernel. Responsible for starting and managing all services.
      </Prose>

      {/* ── 1. Unit Types ── */}
      <Subsection title="Unit Types">
        <Prose>
          systemd manages everything as a Unit. Each Unit has a specific type:
        </Prose>

        <InfoTable
          columns={[
            { header: "Type", key: "type" },
            { header: "Function", key: "func" },
            { header: "Example", key: "example" },
          ]}
          rows={[
            {
              type: "<strong>.service</strong>",
              func: "Service — most common type",
              example: "<code>nginx.service</code>",
            },
            {
              type: "<strong>.socket</strong>",
              func: "Socket — listening port",
              example: "<code>sshd.socket</code>",
            },
            {
              type: "<strong>.timer</strong>",
              func: "Timer — cron replacement",
              example: "<code>systemd-tmpfiles-clean.timer</code>",
            },
            {
              type: "<strong>.target</strong>",
              func: "Target — group of units",
              example: "<code>multi-user.target</code>",
            },
            {
              type: "<strong>.mount</strong>",
              func: "Mount point",
              example: "<code>home.mount</code>",
            },
            {
              type: "<strong>.path</strong>",
              func: "File watcher",
              example: "<code>myapp.path</code>",
            },
          ]}
        />

        <Callout variant="info">
          <strong>Search for unit:</strong>{" "}
          <code>
            systemctl list-unit-files --type=service | head
          </code>{" "}
          shows all service units.
        </Callout>
      </Subsection>

      {/* ── 2. Service Management ── */}
      <Subsection title="Service Management — systemctl">
        <CodeBlock lang="bash" label="Basic systemctl Commands">
{`# Start and Stop
systemctl start nginx
systemctl stop nginx
systemctl restart nginx
systemctl reload nginx

# Enable at boot (compared to chkconfig)
systemctl enable nginx
systemctl disable nginx

# Status
systemctl status nginx
systemctl is-active nginx
systemctl is-enabled nginx

# List all services
systemctl list-units --type=service --state=running
systemctl list-unit-files --type=service | head -20`}
        </CodeBlock>

        <Subsection title="list-unit-files vs list-units">
          <InfoTable
            columns={[
              { header: "Command", key: "cmd" },
              { header: "What it shows", key: "shows" },
            ]}
            rows={[
              {
                cmd: "<code>systemctl list-units</code>",
                shows: "Units that are currently running (loaded + active)",
              },
              {
                cmd: "<code>systemctl list-unit-files</code>",
                shows: "All installed units (regardless of state)",
              },
              {
                cmd: "<code>systemctl list-dependencies</code>",
                shows: "Dependency tree between units",
              },
            ]}
          />
        </Subsection>
      </Subsection>

      {/* ── 3. Targets vs Runlevels ── */}
      <Subsection title="Targets vs Runlevels">
        <Prose>
          In the old days we used runlevels (0-6). systemd replaced them with
          targets:
        </Prose>

        <InfoTable
          columns={[
            { header: "Old (Runlevel)", key: "old" },
            { header: "New (Target)", key: "new" },
            { header: "Description", key: "desc" },
          ]}
          rows={[
            {
              old: "0",
              new: "<code>poweroff.target</code>",
              desc: "Power off",
            },
            {
              old: "1",
              new: "<code>rescue.target</code>",
              desc: "Maintenance mode (Single user)",
            },
            {
              old: "2, 3, 4",
              new: "<code>multi-user.target</code>",
              desc: "Multi-user (without GUI)",
            },
            {
              old: "5",
              new: "<code>graphical.target</code>",
              desc: "With graphical interface",
            },
            {
              old: "6",
              new: "<code>reboot.target</code>",
              desc: "Reboot",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Working with targets">
{`# Current default target
systemctl get-default
# multi-user.target

# Change default target (like systemd.unit= in GRUB)
systemctl set-default multi-user.target

# Switch to a target temporarily
systemctl isolate rescue.target`}
        </CodeBlock>
      </Subsection>

      {/* ── 4. Unit File Structure ── */}
      <Subsection title="Unit File Structure">
        <Prose>
          Unit files are located in <code>/usr/lib/systemd/system/</code> (for
          installed programs) and <code>/etc/systemd/system/</code> (for local
          modifications).
        </Prose>

        <CodeBlock lang="bash" label="nginx.service — File Structure">
{`[Unit]
Description=The NGINX HTTP and reverse proxy server
After=network.target

[Service]
Type=forking
PIDFile=/run/nginx.pid
ExecStart=/usr/sbin/nginx
ExecReload=/usr/sbin/nginx -s reload
ExecStop=/usr/sbin/nginx -s quit
PrivateTmp=true

[Install]
WantedBy=multi-user.target`}
        </CodeBlock>

        <InfoTable
          columns={[
            { header: "Section", key: "section" },
            { header: "Description", key: "desc" },
          ]}
          rows={[
            {
              section: "<code>[Unit]</code>",
              desc: "General description — dependencies (After, Requires, Wants)",
            },
            {
              section: "<code>[Service]</code>",
              desc: "Service settings — ExecStart, Type, User",
            },
            {
              section: "<code>[Install]</code>",
              desc: "Enable settings — WantedBy, RequiredBy",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Create custom unit — Example">
{`# /etc/systemd/system/myapp.service
[Unit]
Description=My Custom Application
After=network.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/python3 /opt/myapp/app.py
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target`}
        </CodeBlock>

        <Callout variant="success">
          <strong>After creating the unit:</strong>
          <br />
          <code>systemctl daemon-reload</code> ← Reload systemd
          <br />
          <code>systemctl enable --now myapp</code> ← Enable and start
        </Callout>
      </Subsection>

      {/* ── 5. Drop-in Configs ── */}
      <Subsection title="Drop-in Configs — override.conf">
        <Prose>
          Instead of modifying the original unit file (which changes with
          updates), use drop-in file in{" "}
          <code>/etc/systemd/system/&lt;unit&gt;.d/</code>.
        </Prose>

        <CodeBlock lang="bash" label="Modify an existing service — override">
{`# Create the override directory
mkdir -p /etc/systemd/system/nginx.service.d/

# /etc/systemd/system/nginx.service.d/override.conf
[Service]
Restart=always
RestartSec=10
LimitNOFILE=65536

# Or using the command directly
systemctl edit nginx

# Reload
systemctl daemon-reload
systemctl restart nginx`}
        </CodeBlock>

        <Callout variant="info">
          <strong>systemd-analyze:</strong> Boot time analysis tools:
          <br />
          <code>systemd-analyze</code> — Total boot time
          <br />
          <code>systemd-analyze blame</code> — Services sorted by start time
          <br />
          <code>systemd-analyze critical-chain</code> — Critical chain
        </Callout>
      </Subsection>

      {/* ── 6. systemd-cgls ── */}
      <Subsection title="systemd-cgls — Cgroups Tree">
        <CodeBlock lang="bash" label="Display cgroups tree">
{`# cgroups tree (what services are running)
systemd-cgls

# Services tree only
systemd-cgls --no-pager | head -40

# Or display each service's resources
systemd-cgtop`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
