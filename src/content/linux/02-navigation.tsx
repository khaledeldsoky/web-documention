import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";

export function Section2() {
  return (
    <Section id="navigation" num={2} title="Navigating the Filesystem">
      <Prose>
        Before managing services or configuring servers, you need to be comfortable moving
        around the terminal. This section covers the essential navigation commands every
        Linux user needs.
      </Prose>

      {/* ── pwd ── */}
      <Subsection title="pwd — Where Am I?">
        <Prose>
          <code>pwd</code> (Print Working Directory) shows your current location in the filesystem.
        </Prose>

        <CodeBlock lang="bash" label="pwd">
{`# Show current directory
pwd
# /home/ahmed

# Every shell prompt shows this implicitly — but pwd is
# reliable inside scripts where the prompt doesn't help`}
        </CodeBlock>
      </Subsection>

      {/* ── cd ── */}
      <Subsection title="cd — Moving Around">
        <Prose>
          <code>cd</code> (Change Directory) is how you move between directories.
          It&apos;s the most frequently used navigation command.
        </Prose>

        <CodeBlock lang="bash" label="cd — Essential Patterns">
{`# Go to a specific directory
cd /var/log

# Go to your home directory (any of these work)
cd
cd ~
cd $HOME

# Go up one level
cd ..

# Go up two levels
cd ../..

# Go to the previous directory (toggle between two)
cd -

# Go to the root directory
cd /`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Tip:</strong> <code>cd -</code> is a hidden gem — it toggles between your current
          and previous directory. Extremely useful when you need to quickly jump back and forth.
        </Callout>
      </Subsection>

      {/* ── ls ── */}
      <Subsection title="ls — Listing Files">
        <Prose>
          <code>ls</code> lists the contents of a directory. The flags control what you see and how
          it&apos;s formatted.
        </Prose>

        <CodeBlock lang="bash" label="ls — Most Useful Flags">
{`# Basic listing
ls
# file1.txt  file2.txt  mydir

# Long format — shows permissions, owner, size, date
ls -l
# -rw-r--r-- 1 ahmed ahmed  1024 Jan 15 10:30 file1.txt
# drwxr-xr-x 2 ahmed ahmed  4096 Jan 15 10:35 mydir

# Show hidden files (dotfiles)
ls -la
# includes .bashrc, .ssh, .git, etc.

# Human-readable sizes (KB, MB, GB)
ls -lh
# -rw-r--r-- 1 ahmed ahmed  4.0K Jan 15 10:30 config.yml

# Sort by modification time (newest last)
ls -ltr
# useful for watching log files — newest at the bottom

# Show directory contents without entering it
ls -d */`}
        </CodeBlock>

        <InfoTable
          columns={[
            { header: "Flag", key: "flag" },
            { header: "Meaning", key: "meaning" },
            { header: "When to Use", key: "when" },
          ]}
          rows={[
            { flag: "<code>-l</code>", meaning: "Long format", when: "See permissions, owner, size" },
            { flag: "<code>-a</code>", meaning: "Show hidden files", when: "Check dotfiles (.bashrc, .ssh)" },
            { flag: "<code>-h</code>", meaning: "Human-readable sizes", when: "Disk usage, large files" },
            { flag: "<code>-t</code>", meaning: "Sort by time", when: "Find recently modified files" },
            { flag: "<code>-r</code>", meaning: "Reverse order", when: "Combine with -t for newest last" },
            { flag: "<code>-d</code>", meaning: "List directories themselves", when: "See directory names only" },
          ]}
        />
      </Subsection>

      {/* ── tree ── */}
      <Subsection title="tree — Visual Hierarchy">
        <Prose>
          <code>tree</code> displays directory contents as a tree — perfect for understanding
          project structure or verifying that directories were created correctly.
        </Prose>

        <CodeBlock lang="bash" label="tree — Common Usage">
{`# Show directory tree (2 levels deep)
tree -L 2
# .
# ├── etc
# │   ├── nginx
# │   │   └── nginx.conf
# │   └── ssh
# │       └── sshd_config
# └── var
#     ├── log
#     └── www

# Show only directories (no files)
tree -d -L 1
# .
# ├── etc
# ├── home
# ├── var
# └── usr

# Show tree for a specific directory
tree /etc/nginx -L 2`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Note:</strong> <code>tree</code> may not be installed by default on minimal
          systems. Install it with <code>dnf install tree -y</code> (RHEL) or{" "}
          <code>apt install tree -y</code> (Ubuntu).
        </Callout>
      </Subsection>

      {/* ── find ── */}
      <Subsection title="find — Locating Files">
        <Prose>
          <code>find</code> is the most powerful file search tool in Linux. It can search by name,
          type, size, date, permissions, and more. Unlike <code>which</code> (which only finds
          commands), <code>find</code> searches the entire filesystem.
        </Prose>

        <CodeBlock lang="bash" label="find — Most Common Patterns">
{`# Find files by name
find /etc -name "sshd_config"
# /etc/ssh/sshd_config

# Case-insensitive search
find /var -iname "*.LOG"

# Find only files (not directories)
find /tmp -type f -name "*.tmp"

# Find only directories
find /home -type d -name ".ssh"

# Find files larger than 100MB
find / -type f -size +100M 2>/dev/null

# Find files modified in the last 7 days
find /var/log -type f -mtime -7

# Find and take action on results
find /tmp -type f -name "*.log" -exec rm {} +
# Deletes all .log files in /tmp`}
        </CodeBlock>

        <InfoTable
          columns={[
            { header: "Flag", key: "flag" },
            { header: "Meaning", key: "meaning" },
            { header: "Example", key: "ex" },
          ]}
          rows={[
            { flag: "<code>-name</code>", meaning: "Search by name", ex: '<code>-name "*.conf"</code>' },
            { flag: "<code>-iname</code>", meaning: "Case-insensitive name", ex: '<code>-iname "*.LOG"</code>' },
            { flag: "<code>-type</code>", meaning: "f=file, d=directory", ex: '<code>-type f</code>' },
            { flag: "<code>-size</code>", meaning: "By size (+over, -under)", ex: '<code>-size +100M</code>' },
            { flag: "<code>-mtime</code>", meaning: "Modified N days ago", ex: '<code>-mtime -7</code>' },
            { flag: "<code>-exec</code>", meaning: "Run command on results", ex: '<code>-exec rm {} +</code>' },
          ]}
        />
      </Subsection>

      {/* ── Tab Completion ── */}
      <Subsection title="Tab Completion — Your Best Friend">
        <Prose>
          Tab completion is the single most useful keyboard feature in the terminal.
          Press <code>Tab</code> to auto-complete file names, directories, and commands.
          Press <code>Tab</code> twice to see all possibilities.
        </Prose>

        <CodeBlock lang="bash" label="Tab Completion in Action">
{`# Type this and press Tab once:
cat /etc/ssh/ssh
# → auto-completes to: cat /etc/ssh/sshd_config

# If there are multiple matches, press Tab twice:
ls /etc/sys
# network/   sysctl.conf   systemd/   ...
# Shows all possibilities starting with "sys"

# Works for commands too:
sys<Tab>
# → systemctl  sysctl  systemd-analyze  ...

# Works for usernames:
ssh ahm<Tab>
# → ahmed (if that's the only match)`}
        </CodeBlock>

        <Callout variant="success">
          <strong>Practice this:</strong> Try navigating to <code>/etc/ssh/</code> using only Tab
          completion — type <code>cd /e&lt;Tab&gt;/ss&lt;Tab&gt;</code> and watch it fill in.
          Once you get used to it, you&apos;ll never type full paths again.
        </Callout>
      </Subsection>

      {/* ── Keyboard Shortcuts ── */}
      <Subsection title="Essential Keyboard Shortcuts">
        <Prose>
          These shortcuts work in Bash and most terminals. They save time and reduce
          strain when working long hours in the terminal.
        </Prose>

        <InfoTable
          columns={[
            { header: "Shortcut", key: "key" },
            { header: "Action", key: "action" },
            { header: "Example Use Case", key: "use" },
          ]}
          rows={[
            { key: "<code>Ctrl + C</code>", action: "Kill running command", use: "Stop a stuck process or script" },
            { key: "<code>Ctrl + Z</code>", action: "Suspend (pause) process", use: "Pause something, resume later with fg/bg" },
            { key: "<code>Ctrl + R</code>", action: "Reverse search history", use: "Find a command you ran earlier" },
            { key: "<code>Ctrl + A</code>", action: "Move cursor to start of line", use: "Edit the beginning of a long command" },
            { key: "<code>Ctrl + E</code>", action: "Move cursor to end of line", use: "Jump to the end to append something" },
            { key: "<code>Ctrl + L</code>", action: "Clear screen", use: "Same as running 'clear'" },
            { key: "<code>Ctrl + W</code>", action: "Delete word before cursor", use: "Quick edit — remove the last word typed" },
            { key: "<code>Ctrl + U</code>", action: "Delete entire line before cursor", use: "Start over — clear what you typed" },
          ]}
        />

        <CodeBlock lang="bash" label="Ctrl+R — Reverse Search Example">
{`# Press Ctrl+R, then type part of a command you ran before:
(reverse-i-search)\`ssh': ssh -i ~/.ssh/openshift root@192.168.1.20
# Found it! Press Enter to run, or ← → to edit first`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>Don&apos;t confuse:</strong> <code>Ctrl + Z</code> suspends (pauses) a process,
          it does NOT kill it. Use <code>fg</code> to bring it back, <code>bg</code> to run it
          in the background, or <code>kill</code> to terminate it. See{" "}
          <a href="#processes">Section 17 — Process Management</a> for details.
        </Callout>
      </Subsection>
    </Section>
  );
}
