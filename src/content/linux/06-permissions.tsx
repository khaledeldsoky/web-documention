import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";

export function Section6() {
  return (
    <Section id="permissions" num={6} title="Permissions">
      <Prose>
        Permissions in Linux control who can read, write, or execute a file.
        The permissions system is one of the oldest and most important concepts
        in Linux.
      </Prose>

      {/* ── 1. chmod — Changing Permissions ── */}
      <Subsection title="chmod — Changing Permissions">
        <Prose>Two methods: symbolic and numeric.</Prose>

        <CodeBlock lang="bash" label="chmod — Symbolic Method">
{`# Add execute permission for owner
chmod u+x script.sh

# Remove write permission for group
chmod g-w file.txt

# Add read for everyone
chmod +r file.txt

# All permissions for owner, read/execute for others
chmod u=rwx,g=rx,o=rx script.sh`}
        </CodeBlock>

        <CodeBlock lang="bash" label="chmod — Numeric Method">
{`# rwx = 7, rw- = 6, r-x = 5, r-- = 4
chmod 755 script.sh    # rwxr-xr-x
chmod 644 file.txt     # rw-r--r--
chmod 700 private.sh   # rwx------
chmod 600 secret.txt   # rw-------
chmod 777 public.sh    # rwxrwxrwx — Dangerous!`}
        </CodeBlock>

        <Callout variant="danger">
          <strong>Warning:</strong> <code>chmod 777</code> lets any user modify
          and execute the file. Use it with extreme caution — it is usually a
          mistake.
        </Callout>
      </Subsection>

      {/* ── 2. chown, chgrp ── */}
      <Subsection title="chown, chgrp — Changing Owner and Group">
        <CodeBlock lang="bash" label="Change owner and group">
{`# Change owner
chown ahmed file.txt

# Change owner and group
chown ahmed:developers file.txt

# Change group only
chgrp developers file.txt

# Directory and all its contents
chown -R ahmed:developers /opt/myapp`}
        </CodeBlock>
      </Subsection>

      {/* ── 3. umask ── */}
      <Subsection title="umask — Default Permissions">
        <Prose>
          umask specifies the default permissions for new files and directories.
        </Prose>

        <InfoTable
          columns={[
            { header: "umask", key: "umask" },
            { header: "File", key: "file" },
            { header: "Directory", key: "dir" },
          ]}
          rows={[
            {
              umask: "022",
              file: "644 (rw-r--r--)",
              dir: "755 (rwxr-xr-x)",
            },
            {
              umask: "002",
              file: "664 (rw-rw-r--)",
              dir: "775 (rwxrwxr-x)",
            },
            {
              umask: "077",
              file: "600 (rw-------)",
              dir: "700 (rwx------)",
            },
          ]}
        />

        <CodeBlock lang="bash" label="umask — Examples">
{`# Show current umask
umask
# 0022

# Change umask (for current session)
umask 077

# Permanent change — add to ~/.bashrc
echo 'umask 002' >> ~/.bashrc`}
        </CodeBlock>
      </Subsection>

      {/* ── 4. SUID, SGID, Sticky Bit ── */}
      <Subsection title="SUID, SGID, Sticky Bit">
        <InfoTable
          columns={[
            { header: "Permission", key: "perm" },
            { header: "Symbol", key: "symbol" },
            { header: "Meaning", key: "meaning" },
            { header: "Example", key: "example" },
          ]}
          rows={[
            {
              perm: "<strong>SUID</strong>",
              symbol: "<code>rwsr-xr-x</code>",
              meaning: "Execute with owner's privileges",
              example: "<code>/usr/bin/passwd</code>",
            },
            {
              perm: "<strong>SGID</strong>",
              symbol: "<code>rwxrwsr-x</code>",
              meaning: "Execute with group's privileges",
              example: "<code>/usr/bin/write</code>",
            },
            {
              perm: "<strong>Sticky Bit</strong>",
              symbol: "<code>rwxrwxrwt</code>",
              meaning: "Prevents unauthorized deletion",
              example: "<code>/tmp</code>",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Setting SUID, SGID, Sticky Bit">
{`# SUID — s replaces owner's x
chmod u+s /usr/bin/myapp

# SGID — s replaces group's x
chmod g+s /shared/dir

# Sticky Bit — t replaces others' x
chmod +t /shared/dir

# Or by number (4=SUID, 2=SGID, 1=Sticky)
chmod 4755 script.sh  # rwsr-xr-x
chmod 2755 shared.sh  # rwxr-sr-x
chmod 1777 /tmp       # rwxrwxrwt`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>Security:</strong> SUID is a security risk if used incorrectly.
          Programs with SUID like <code>passwd</code> and <code>sudo</code> need
          it to interact with system files.
        </Callout>
      </Subsection>

      {/* ── 5. ACL ── */}
      <Subsection title="ACL — Access Control Lists">
        <Prose>
          Regular permissions give you 3 levels (owner, group, others). ACL
          allows finer-grained permissions for multiple users and groups.
        </Prose>

        <CodeBlock lang="bash" label="getfacl and setfacl">
{`# Display ACL
getfacl file.txt
# # file: file.txt
# # owner: ahmed
# # group: developers
# user::rw-
# group::r--
# other::r--

# Add permission for a specific user
setfacl -m u:khaled:rwx file.txt

# Add permission for a specific group
setfacl -m g:devops:rx file.txt

# Remove ACL
setfacl -x u:khaled file.txt

# ACL for directory — inherited by new files
setfacl -m d:u:khaled:rwx /shared/project`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Note:</strong> Having an ACL on a file shows a{" "}
          <code>+</code> sign at the end of <code>ls -l</code>.
        </Callout>
      </Subsection>
    </Section>
  );
}
