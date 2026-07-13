import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";

export function Section5() {
  return (
    <Section id="users" num={5} title="User & Group Management">
      <Prose>
        User and group management is the foundation of security in Linux. Every
        process in the system runs with a specific user&apos;s privileges, and
        understanding user management is essential for any System Admin.
      </Prose>

      {/* ── 1. Creating and Managing Users ── */}
      <Subsection title="Creating and Managing Users">
        <InfoTable
          columns={[
            { header: "Command", key: "cmd" },
            { header: "Description", key: "desc" },
            { header: "Example", key: "example" },
          ]}
          rows={[
            {
              cmd: "<code>useradd</code>",
              desc: "Create a new user",
              example: "<code>useradd -m -G wheel ahmed</code>",
            },
            {
              cmd: "<code>usermod</code>",
              desc: "Modify user data",
              example: "<code>usermod -aG docker ahmed</code>",
            },
            {
              cmd: "<code>userdel</code>",
              desc: "Delete a user",
              example: "<code>userdel -r ahmed</code>",
            },
            {
              cmd: "<code>passwd</code>",
              desc: "Change password",
              example: "<code>passwd ahmed</code>",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Create a user — Complete example">
{`# Create a user with home directory and wheel group
useradd -m -G wheel ahmed

# Set password
passwd ahmed

# Create a user with specific permissions
useradd -m -d /var/www/app -s /sbin/nologin appuser

# Delete user with home directory
userdel -r ahmed`}
        </CodeBlock>
      </Subsection>

      {/* ── 2. System Files ── */}
      <Subsection title="System Files — /etc/passwd, /etc/shadow, /etc/group">
        <InfoTable
          columns={[
            { header: "File", key: "file" },
            { header: "Function", key: "func" },
            { header: "Format", key: "format" },
          ]}
          rows={[
            {
              file: "<code>/etc/passwd</code>",
              func: "User information",
              format:
                "<code>username:x:UID:GID:comment:home:shell</code>",
            },
            {
              file: "<code>/etc/shadow</code>",
              func: "Encrypted passwords",
              format:
                "<code>username:$hash:last:min:max:warn:inact:exp</code>",
            },
            {
              file: "<code>/etc/group</code>",
              func: "Group definitions",
              format:
                "<code>groupname:x:GID:user1,user2</code>",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Contents of /etc/passwd">
{`# username : x (passwd) : UID : GID : comment : home : shell
root:x:0:0:root:/root:/bin/bash
ahmed:x:1002:1002::/home/ahmed:/bin/bash
appuser:x:1003:1003::/var/www/app:/sbin/nologin`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Note:</strong> UID 0 = root. UIDs 1-999 = system accounts.
          UIDs 1000+ = regular users.
        </Callout>
      </Subsection>

      {/* ── 3. Group Management ── */}
      <Subsection title="Group Management">
        <CodeBlock lang="bash" label="Groups — Create and add members">
{`# Create a new group
groupadd developers

# Add user to group (primary group)
usermod -g developers ahmed

# Add user to group (secondary group)
usermod -aG docker ahmed

# Add user to group with gpasswd
gpasswd -a ahmed wheel

# Remove user from group
gpasswd -d ahmed wheel

# Show user groups
groups ahmed
id ahmed`}
        </CodeBlock>
      </Subsection>

      {/* ── 4. Connected Users ── */}
      <Subsection title="Connected Users — who, w, last">
        <CodeBlock lang="bash" label="Monitor users">
{`# Who is connected now
who
# ahmed    pts/0    2025-01-15 10:30 (192.168.1.100)

# More details — who is doing what
w

# Login history
last
# ahmed    pts/0    192.168.1.100  Tue Jan 15 10:30  still logged in`}
        </CodeBlock>
      </Subsection>

      {/* ── 5. Sudo ── */}
      <Subsection title="Sudo — Administrative Privileges">
        <CodeBlock lang="bash" label="Edit /etc/sudoers">
{`# Always use visudo — not direct vi
visudo

# Give full permissions to the wheel group
%wheel ALL=(ALL) ALL

# Specific user — specific commands
ahmed ALL=(ALL) /usr/bin/systemctl, /usr/bin/dnf

# Without password
%wheel ALL=(ALL) NOPASSWD: ALL`}
        </CodeBlock>

        <Callout variant="danger">
          <strong>Warning:</strong> Always use <code>visudo</code> to edit
          sudoers. If you make a syntax error, you could lose sudo privileges
          forever.
        </Callout>
      </Subsection>
    </Section>
  );
}
