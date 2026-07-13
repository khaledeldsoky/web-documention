import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section17() {
  return (
    <Section id="processes" num={17} title="Process Management">
      <Prose>
        A process is any program running in the system. Linux handles processes
        via PID (Process ID). Process management includes: viewing, terminating,
        changing priority, and monitoring.
      </Prose>

      {/* ── 1. Viewing Processes ── */}
      <Subsection title="Viewing Processes — ps, top, htop, pstree">
        <InfoTable
          columns={[
            { header: "Command", key: "cmd" },
            { header: "Description", key: "desc" },
          ]}
          rows={[
            {
              cmd: "<code>ps aux</code>",
              desc: "All processes — full details",
            },
            {
              cmd: "<code>ps -ef</code>",
              desc: "All processes — Standard format",
            },
            {
              cmd: "<code>pstree</code>",
              desc: "Process tree — parent/child",
            },
            {
              cmd: "<code>top</code>",
              desc: "Interactive screen — sorted by CPU",
            },
            {
              cmd: "<code>htop</code>",
              desc: "Enhanced top — colors, scroll, built-in kill",
            },
            {
              cmd: "<code>pgrep</code>",
              desc: "Search for PID by process name",
            },
            {
              cmd: "<code>pidof</code>",
              desc: "Gets PID from process name",
            },
          ]}
        />

        <CodeBlock lang="bash" label="ps Examples — In Detail">
{`# All processes — detailed information
ps aux
# USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
# root         1  0.0  0.5 169648 10768 ?        Ss   Jan01   0:15 /sbin/init

# Show specific process
ps -p 1234 -o pid,ppid,cmd,%cpu,%mem

# Show process tree
ps auxf

# Show threads inside a process
ps -eLf | grep nginx

# Search for PID
pgrep -u nginx
pidof nginx

# Sort by CPU or Memory
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10`}
        </CodeBlock>
      </Subsection>

      {/* ── 2. Process States ── */}
      <Subsection title="Process States">
        <InfoTable
          columns={[
            { header: "State", key: "state" },
            { header: "Meaning", key: "meaning" },
            { header: "Symbol in ps", key: "symbol" },
          ]}
          rows={[
            {
              state: "Running",
              meaning: "Running on CPU or ready",
              symbol: "<code>R</code>",
            },
            {
              state: "Sleeping",
              meaning: "Sleeping — waiting for something",
              symbol:
                "<code>S</code> (interruptible), <code>D</code> (uninterruptible)",
            },
            {
              state: "Zombie",
              meaning: "Dead but still in the table",
              symbol: "<code>Z</code>",
            },
            {
              state: "Stopped",
              meaning: "Stopped — SIGSTOP/SIGTSTP",
              symbol: "<code>T</code>",
            },
          ]}
        />

        <Callout variant="warn">
          <strong>Zombie process:</strong> A process that ended but the
          parent hasn&apos;t read its exit status (<code>wait()</code>).
          Doesn&apos;t consume resources (CPU/memory) but consumes a PID — if
          too many, the table fills up and can&apos;t start new processes. If
          the parent dies, the zombie is reaped by init (systemd).
        </Callout>
      </Subsection>

      {/* ── 3. Signals ── */}
      <Subsection title="Signals — Control Signals">
        <Prose>The Signal is Linux&apos;s way of communicating with processes:</Prose>

        <InfoTable
          columns={[
            { header: "Signal", key: "signal" },
            { header: "Number", key: "num" },
            { header: "Function", key: "func" },
          ]}
          rows={[
            {
              signal: "<code>SIGHUP</code>",
              num: "1",
              func: "Reload config (reload)",
            },
            {
              signal: "<code>SIGINT</code>",
              num: "2",
              func: "Interrupt — Ctrl + C",
            },
            {
              signal: "<code>SIGKILL</code>",
              num: "9",
              func: "Immediate kill — cannot be caught",
            },
            {
              signal: "<code>SIGTERM</code>",
              num: "15",
              func: "Clean termination request (default)",
            },
            {
              signal: "<code>SIGSTOP</code>",
              num: "19",
              func: "Stop — cannot be caught",
            },
            {
              signal: "<code>SIGCONT</code>",
              num: "18",
              func: "Resume after SIGSTOP",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Sending Signals — kill, pkill, killall">
{`# Kill PID 1234 — default SIGTERM (15)
kill 1234

# Send SIGKILL — forceful, not gentle (use only when necessary)
kill -9 1234

# Reload config (SIGHUP)
kill -HUP 1234

# Kill all processes with a given name
pkill nginx
killall nginx

# Stop and resume
kill -STOP 1234   # Stop
kill -CONT 1234   # Resume

# Kill all processes for a specific user
pkill -u username

# Check process signals
kill -l   # List all signals`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>SIGKILL vs SIGTERM:</strong> Always use{" "}
          <code>kill</code> (without number) — SIGTERM — first. SIGTERM allows
          the process to clean up resources (close files, release memory). Use
          SIGKILL <code>kill -9</code> only if the process is not responding.
        </Callout>
      </Subsection>

      {/* ── 4. Priority ── */}
      <Subsection title="Priority — nice and renice">
        <Prose>
          Priority controls how much CPU time a process gets. The range is from{" "}
          <code>-20</code> (highest priority) to <code>+19</code> (lowest
          priority). Higher values = lower priority = nicer to other processes.
        </Prose>

        <CodeBlock lang="bash" label="Changing Priority">
{`# Start process with high priority (nice value)
nice -n -5 ./backup.sh

# Change priority of a running process
renice -n 10 -p 1234

# Show current priority
ps -o pid,ni,cmd -p 1234
# NI = nice value

# Example: make the backup process lower priority
renice -n 19 -p $(pgrep backup)`}
        </CodeBlock>
      </Subsection>

      {/* ── 5. Background & Foreground ── */}
      <Subsection title="Background & Foreground">
        <CodeBlock lang="bash" label="Background Process Management">
{`# Run command in background
long_running_task &

# Show background jobs
jobs

# Bring job to foreground
fg %1

# Send running command to background: Ctrl + Z then bg
# 1. Ctrl + Z ← pauses the process temporarily
# 2. bg ← returns it running in background
# 3. disown ← detaches it from terminal so it lives if you close the shell

# Keep process running after logout
nohup long_running_task &

# Or use screen/tmux
screen -S mysession
tmux new -s mysession`}
        </CodeBlock>

        <VerifyBlock label="Process termination order — best to worst">
          <p>
            1. Try <code>kill [PID]</code> (SIGTERM)
          </p>
          <p>
            2. If it doesn&apos;t respond: <code>kill -HUP [PID]</code>{" "}
            (SIGHUP)
          </p>
          <p>
            3. Finally: <code>kill -9 [PID]</code> (SIGKILL)
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
