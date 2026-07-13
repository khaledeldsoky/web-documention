import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import BenefitGrid from "@/components/docs/BenefitCard";

export function Section8() {
  return (
    <Section id="selinux" num={8} title="SELinux">
      <Prose>
        SELinux is an additional security system in Linux. Regular permissions
        (DAC) control who can do what. SELinux (MAC) adds a security layer —
        even if root has permissions, SELinux can block him.
      </Prose>

      {/* ── 1. Modes ── */}
      <Subsection title="Modes — SELinux Modes">
        <InfoTable
          columns={[
            { header: "Mode", key: "mode" },
            { header: "Behavior", key: "behavior" },
            { header: "When to use", key: "when" },
          ]}
          rows={[
            {
              mode: "<strong>Enforcing</strong>",
              behavior: "Enforces rules and blocks violations",
              when: "Production — full security",
            },
            {
              mode: "<strong>Permissive</strong>",
              behavior: "Logs violations but doesn't block",
              when: "Diagnostics — see what violations exist",
            },
            {
              mode: "<strong>Disabled</strong>",
              behavior: "SELinux completely off",
              when: "Rarely — not secure",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Check SELinux mode">
{`# Show current mode
getenforce
# Enforcing

# Full details
sestatus
# SELinux status:                 enabled
# Current mode:                   enforcing
# Mode from config file:          enforcing

# Change mode (temporary — lost after reboot)
setenforce 0    # Permissive
setenforce 1    # Enforcing

# Permanent change — edit /etc/selinux/config
vim /etc/selinux/config
# SELINUX=enforcing / permissive / disabled`}
        </CodeBlock>

        <Callout variant="danger">
          <strong>RHCSA:</strong> If asked to disable SELinux, use{" "}
          <code>setenforce 0</code> and edit <code>/etc/selinux/config</code>{" "}
          to <code>permissive</code>. Only use <code>disabled</code> if
          specifically told — because it requires a reboot.
        </Callout>
      </Subsection>

      {/* ── 2. SELinux Contexts ── */}
      <Subsection title="SELinux Contexts — ls -Z, ps auxZ">
        <Prose>
          Every file and process in SELinux has a Context. The Context is a tag
          that determines permissions.
        </Prose>

        <CodeBlock lang="bash" label="View SELinux Contexts">
{`# File Context
ls -Z /var/www/html
# system_u:object_r:httpd_sys_content_t:s0 index.html

# Process Context
ps auxZ | grep httpd
# system_u:system_r:httpd_t:s0   apache  1234  ...

# User Context
id -Z
# unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023`}
        </CodeBlock>

        <Prose>
          Context format: <code>user:role:type:level</code>
        </Prose>
      </Subsection>

      {/* ── 3. Modifying Context ── */}
      <Subsection title="Modifying Context — semanage, restorecon, chcon">
        <CodeBlock lang="bash" label="SELinux Context modification tools">
{`# Change context (manual — not persistent)
chcon -t httpd_sys_content_t /var/www/html/index.html

# Reset context according to default rules
restorecon -v /var/www/html/index.html

# Full directory
restorecon -Rv /var/www/html

# Permanent context change — semanage
semanage fcontext -a -t httpd_sys_content_t "/custom/web(/.*)?"
restorecon -Rv /custom/web

# View fcontext rules
semanage fcontext -l | grep httpd`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Rule:</strong> Use <code>restorecon</code> first — if it
          doesn't work, use <code>semanage fcontext</code> for a permanent
          solution. <code>chcon</code> is temporary — lost after relabel.
        </Callout>
      </Subsection>

      {/* ── 4. Common Scenarios ── */}
      <Subsection title="Common Scenarios">
        <BenefitGrid
          cards={[
            {
              icon: "🔌",
              title: "SSH on Non-Default Port",
              body: 'Changed SSH Port to 2222 and it\'s not working?\nsemanage port -a -t ssh_port_t -p tcp 2222',
            },
            {
              icon: "🌐",
              title: "httpd Serving a Custom Directory",
              body: 'Apache serving a directory outside /var/www:\nsemanage fcontext -a -t httpd_sys_content_t "/data(/.*)?"\nrestorecon -Rv /data',
            },
          ]}
        />

        <CodeBlock lang="bash" label="Discover SELinux violations">
{`# See violations
ausearch -m avc -ts recent
# Or
grep "SELinux" /var/log/messages | tail -20

# Easiest method
sealert -a /var/log/audit/audit.log | tail -30

# Set SELinux to Permissive temporarily for diagnosis
setenforce 0
# If everything works → problem is SELinux
# Check logs and restore the correct rule`}
        </CodeBlock>

        <Callout variant="success">
          <strong>Interview Sentence:</strong> &quot;SELinux adds mandatory
          access controls on top of traditional Linux permissions. Even if a
          process runs as root, SELinux can restrict what it can do.&quot;
        </Callout>
      </Subsection>
    </Section>
  );
}
