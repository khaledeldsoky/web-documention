import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import InfoTable from "@/components/docs/InfoTable";

export function Section1() {
  return (
    <Section id="filesystem" num={1} title="Linux Filesystem Hierarchy">
      <Prose>
        If someone asks you in an interview: &quot;Tell me about the Linux Filesystem&quot; — don&apos;t memorize
        many names, understand the concept. Linux considers <strong>everything a File</strong>: regular
        file, folder, hard disk, partition, USB, printer, process info. Everything is handled
        through a single file tree starting from <code>/</code>.
      </Prose>

      {/* ── 1. File Tree ── */}
      <Subsection title="1. File Tree — Filesystem Hierarchy">
        <InfoTable
          columns={[
            { header: "Directory", key: "dir" },
            { header: "Function", key: "fn" },
            { header: "Important Examples", key: "ex" },
          ]}
          rows={[
            { dir: "<code>/</code>", fn: "System root — start of the file tree", ex: "—" },
            { dir: "<code>/bin</code>", fn: "Essential commands for all users", ex: "<code>ls</code>, <code>cp</code>, <code>mv</code>" },
            { dir: "<code>/boot</code>", fn: "Boot files — used by the system at boot time", ex: "<code>vmlinuz</code>, <code>initramfs</code>, <code>grub/</code>" },
            { dir: "<code>/dev</code>", fn: "System devices appear as files", ex: "<code>/dev/sda</code>, <code>/dev/sdb</code>, <code>/dev/sr0</code>" },
            { dir: "<code>/etc</code>", fn: "System and service configuration", ex: "<code>passwd</code>, <code>fstab</code>, <code>ssh/sshd_config</code>" },
            { dir: "<code>/home</code>", fn: "Personal directories for regular users", ex: "<code>/home/ahmed</code>, <code>/home/khaled</code>" },
            { dir: "<code>/proc</code>", fn: "Virtual filesystem — info from Kernel directly", ex: "<code>/proc/cpuinfo</code>, <code>/proc/meminfo</code>" },
            { dir: "<code>/root</code>", fn: "Home directory for root user", ex: "<code>/root/.bashrc</code>" },
            { dir: "<code>/sys</code>", fn: "Hardware information (used for troubleshooting)", ex: "<code>/sys/block/</code>, <code>/sys/class/</code>" },
            { dir: "<code>/tmp</code>", fn: "Temporary files — any program uses them", ex: "<code>/tmp/install.sh</code>" },
            { dir: "<code>/usr</code>", fn: "System programs and commands", ex: "<code>/usr/bin</code>, <code>/usr/sbin</code>" },
            { dir: "<code>/var</code>", fn: "Variable data — logs, mail, databases", ex: "<code>/var/log/messages</code>, <code>/var/log/secure</code>" },
          ]}
        />

        <Callout variant="info">
          <code>/proc</code> and <code>/sys</code> do not actually exist on disk — they are virtual
          filesystems that the Kernel creates in RAM to easily access its information.
        </Callout>

        <Prose>
          You can explore these virtual filesystems directly. They are invaluable for troubleshooting
          and understanding what the kernel sees.
        </Prose>

        <CodeBlock lang="bash" label="/proc and /sys — Live Examples">
{`# CPU information — how many cores does this machine have?
grep -c processor /proc/cpuinfo
# 4

# Memory — total and available
grep -E '^(MemTotal|MemAvailable)' /proc/meminfo
# MemTotal:        7985408 kB
# MemAvailable:    5324800 kB

# Block devices — what disks are connected?
ls /sys/block/
# sda  sdb

# Device model — what kind of disk is sda?
cat /sys/block/sda/device/model
# VBOX HARDDISK`}
        </CodeBlock>
      </Subsection>

      {/* ── 2. File Types ── */}
      <Subsection title="2. File Types in Linux">
        <Prose>
          When you run <code>ls -l</code>, the first character determines the file type:
        </Prose>

        <InfoTable
          columns={[
            { header: "Character", key: "char" },
            { header: "Type", key: "type" },
            { header: "Example", key: "ex" },
          ]}
          rows={[
            { char: "<code>-</code>", type: "Regular File", ex: "<code>-rw-r--r-- file.txt</code>" },
            { char: "<code>d</code>", type: "Directory", ex: "<code>drwxr-xr-x dir/</code>" },
            { char: "<code>l</code>", type: "Symbolic Link — shortcut", ex: "<code>lrwxrwxrwx link → target</code>" },
            { char: "<code>c</code>", type: "Character Device (terminal)", ex: "<code>crw--w---- tty</code>" },
            { char: "<code>b</code>", type: "Block Device (hard disk)", ex: "<code>brw-rw---- sda</code>" },
          ]}
        />
      </Subsection>

      {/* ── 3. /bin vs /sbin ── */}
      <Subsection title="3. /bin vs /sbin — The Difference">
        <Prose>
          In the past there was a clear difference. But in modern systems they are just
          symlinks to <code>/usr/bin</code> and <code>/usr/sbin</code>.
        </Prose>

        <InfoTable
          columns={[
            { header: "Directory", key: "dir" },
            { header: "Past", key: "past" },
            { header: "Today", key: "today" },
          ]}
          rows={[
            {
              dir: "<code>/bin</code>",
              past: "Essential commands for all users (ls, cp, mv)",
              today: "<code>/usr/bin</code>",
            },
            {
              dir: "<code>/sbin</code>",
              past: "System administration commands (reboot, fdisk)",
              today: "<code>/usr/sbin</code>",
            },
          ]}
        />

        <CodeBlock lang="bash" label="/bin and /sbin in modern systems">
{`# If you run ls -ld on /bin and /sbin
ls -ld /bin /sbin
# lrwxrwxrwx 1 root root 7 ... /bin -> usr/bin
# lrwxrwxrwx 1 root root 8 ... /sbin -> usr/sbin`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Summary:</strong> They are all now in <code>/usr/bin</code> and <code>/usr/sbin</code>.
          The difference is now in usage: <code>/usr/bin</code> for all user commands, <code>/usr/sbin</code> for
          administration commands (usually need sudo).
        </Callout>
      </Subsection>

      {/* ── 4. Adding Scripts ── */}
      <Subsection title="4. Adding Your Own Scripts — /usr/local/bin">
        <Prose>
          Want to add a new command to the system? Put a script in
          <code>/usr/local/bin</code> and give it execute permission. This location
          is for local programs and projects.
        </Prose>

        <CodeBlock lang="bash" label="Add a Python Script as a Command">
{`# Create a script file
sudo tee /usr/local/bin/hello > /dev/null <<EOF
#!/usr/bin/env python3
print("Hello from Python")
EOF

# Execute permission
sudo chmod +x /usr/local/bin/hello

# Use it from anywhere
hello
# Hello from Python`}
        </CodeBlock>

        <Callout variant="success">
          <strong>Why /usr/local/bin?</strong> Because <code>/bin</code> and <code>/usr/bin</code> belong to the
          system itself. If you put your stuff in <code>/usr/local/bin</code>, it won&apos;t get mixed up
          with system updates.
        </Callout>
      </Subsection>

      {/* ── 5. PATH ── */}
      <Subsection title="5. PATH and Copy vs Symlink">
        <Prose>
          When you type a command in the terminal, the system searches for it in the locations
          listed in a variable called <code>$PATH</code>.
        </Prose>

        <CodeBlock lang="bash" label="PATH — Where does the system find commands?">
{`# Check PATH
echo $PATH
# /usr/local/bin:/usr/bin:/usr/sbin

# Find command location
which ls
# /usr/bin/ls

# Find location of a command from /sbin
which reboot
# /usr/sbin/reboot

# Add a path to PATH (temporary, lost after logout)
export PATH=$PATH:/opt/myapp/bin

# To make it permanent — add this line to ~/.bashrc
echo 'export PATH=$PATH:/opt/myapp/bin' >> ~/.bashrc`}
        </CodeBlock>

        <Subsection title="Copy vs Symlink — Why copying is not a good idea?">
          <Prose>
            Technically you can do <code>cp /sbin/ip /bin/ip</code>, but this is
            wrong. It&apos;s better to create a symlink:
          </Prose>

          <CodeBlock lang="bash" label="Symlink — Better than Copy">
{`# Copy (bad — two copies of the program)
sudo cp /usr/sbin/ip /usr/bin/ip
# Problem: Update will affect one copy but not the other → confusion

# Symlink (correct — single file only)
sudo ln -s /usr/sbin/ip /usr/local/bin/ip

# Or add /usr/sbin to PATH
echo 'export PATH=$PATH:/usr/sbin' >> ~/.bashrc`}
          </CodeBlock>

          <Callout variant="warn">
            <strong>Famous interview question:</strong> &quot;Can you move a program from /sbin to /bin?&quot;
            <br />
            The answer: Technically yes, but it&apos;s not recommended. Use PATH or a symbolic link
            instead to avoid maintenance and update issues.
          </Callout>
        </Subsection>
      </Subsection>

      {/* ── 6. tmpfiles.d (NEW) ── */}
      <Subsection title="6. /etc/tmpfiles.d — Temporary File Management">
        <Prose>
          Modern Linux uses <code>systemd-tmpfiles</code> to manage temporary files and directories.
          Instead of manually cleaning <code>/tmp</code>, you define rules in
          <code>/etc/tmpfiles.d/</code>. The system reads these at boot and periodically.
        </Prose>

        <CodeBlock lang="bash" label="tmpfiles.d — Configuration">
{`# /etc/tmpfiles.d/myapp.conf
# Type  Path        Mode  User  Group  Age  Argument
d       /tmp/myapp  0755  root  root   -    -
e       /tmp/myapp  -     -     -      7d   -

# d = create directory if it doesn't exist
# e = clean up files older than 7 days
# The format: type path mode user group age argument`}
        </CodeBlock>

        <CodeBlock lang="bash" label="tmpfiles.d — Common Types">
{`# Types you'll see most often:
# d  → create directory
# f  → create file
# e  → clean directory contents (age-based)
# x  → exclude from cleanup
# L  → create symlink

# Test your config without rebooting
systemd-tmpfiles --create /etc/tmpfiles.d/myapp.conf

# See what would be cleaned (dry run)
systemd-tmpfiles --clean --dry-run`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Note:</strong> The default <code>/etc/tmpfiles.d/</code> already has rules for
          <code>/tmp</code>, <code>/var/tmp</code>, and other system directories. You usually
          only add custom rules for your own applications.
        </Callout>
      </Subsection>

      {/* ── 7. Interview Summary ── */}
      <Subsection title="7. Interview Summary">
        <VerifyBlock label="Answer to the question: &quot;Tell me about the Linux Filesystem&quot;">
          <p>
            Linux filesystem starts from the root directory <code>/</code>. Important directories are{" "}
            <code>/boot</code> for boot files, <code>/etc</code> for configuration files,{" "}
            <code>/home</code> for user data, <code>/root</code> for the root user,{" "}
            <code>/var</code> for logs, <code>/tmp</code> for temporary files,{" "}
            <code>/usr</code> for applications and binaries, <code>/dev</code> for devices,{" "}
            and <code>/proc</code> for kernel and process information. Linux treats almost
            everything as a file — regular files, directories, devices, and even processes
            are represented as files in the filesystem tree.
          </p>
        </VerifyBlock>

        <Callout variant="info">
          <strong>Tip:</strong> This is the short answer that covers about 80% of Linux filesystem
          questions in interviews and exams.
        </Callout>

        <Callout variant="warn">
          <strong>Remember:</strong> If a boot failure occurs, the problem is usually in one of 3
          things: GRUB (bootloader), kernel parameters, or the filesystem (see{" "}
          <a href="#rescue-grub">Section 19 — Rescue Mode &amp; GRUB</a>).
        </Callout>
      </Subsection>
    </Section>
  );
}
