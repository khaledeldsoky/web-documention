import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section15() {
  return (
    <Section id="cron" num={15} title="Cron & At">
      <Prose>
        cron is for scheduling recurring tasks, <code>at</code> is for executing
        a task once at a specific time. Both are essential tools for any system
        administrator.
      </Prose>

      {/* ── 1. Cron — Recurring Tasks ── */}
      <Subsection title="Cron — Recurring Tasks">
        <Prose>Cron files are located in several places:</Prose>

        <InfoTable
          columns={[
            { header: "File/Folder", key: "file" },
            { header: "Description", key: "desc" },
          ]}
          rows={[
            {
              file: "<code>/etc/crontab</code>",
              desc: "Main file — has an extra user field",
            },
            {
              file: "<code>/etc/cron.d/</code>",
              desc: "Directory for additional cron files (same crontab syntax)",
            },
            {
              file: "<code>/etc/cron.hourly/</code>",
              desc: "Scripts that run every hour",
            },
            {
              file: "<code>/etc/cron.daily/</code>",
              desc: "Scripts that run daily",
            },
            {
              file: "<code>/etc/cron.weekly/</code>",
              desc: "Scripts that run weekly",
            },
            {
              file: "<code>/etc/cron.monthly/</code>",
              desc: "Scripts that run monthly",
            },
            {
              file: "<code>crontab -e</code>",
              desc: "Cron for the current user",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Crontab Syntax">
{`# ┌───────────── minute (0–59)
# │ ┌───────────── hour (0–23)
# │ │ ┌───────────── day of month (1–31)
# │ │ │ ┌───────────── month (1–12)
# │ │ │ │ ┌───────────── day of week (0–7, 0 = Sunday)
# * * * * * command

# Examples:

# Every day at 2:30 AM
30 2 * * * /usr/bin/backup.sh

# Every 5 minutes
*/5 * * * * /usr/bin/check.sh

# First day of every month at 12 PM
0 12 1 * * /usr/bin/monthly-report.sh

# Every Friday at 6 PM (5 = Friday)
0 18 * * 5 /usr/bin/weekly-cleanup.sh`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Reminder:</strong> After modifying the crontab, you don&apos;t
          need to restart any service — cron reads the files directly. Use{" "}
          <code>crontab -l</code> to view current tasks. Make sure{" "}
          <code>crond</code> is running with{" "}
          <code>systemctl status crond</code>.
        </Callout>
      </Subsection>

      {/* ── 2. At — One-time Execution ── */}
      <Subsection title="At — One-time Execution">
        <Prose>
          If you want a script to run once only at a specific time (e.g.: an
          update at 3 AM), use <code>at</code>.
        </Prose>

        <CodeBlock lang="bash" label="at Command Examples">
{`# Execute command at 10 PM today
echo "systemctl restart nginx" | at 22:00

# Or using interactive mode
at 22:00
at> systemctl restart nginx
at> # Press Ctrl + D

# Time format examples:
at now + 5 minutes     # After 5 minutes
at 14:30 tomorrow       # Tomorrow at 2:30
at 3:00 AM              # At 3 AM
at 10:00 next week      # Next week at 10
at midnight             # Midnight
at teatime              # 4:00 PM

# Show scheduled tasks
atq
# Cancel a task
atrm 2   # 2 = job number from atq`}
        </CodeBlock>

        <VerifyBlock label="Difference between cron and at">
          <p>
            <strong>Cron</strong> — Recurring tasks (every day, week, etc)
          </p>
          <p>
            <strong>At</strong> — One-time task only
          </p>
        </VerifyBlock>

        <Callout variant="success">
          <strong>Real Example:</strong> You want to restart a service at 3 AM
          for maintenance:{" "}
          <code>echo &quot;systemctl restart httpd&quot; | at 3:00 AM</code>
        </Callout>
      </Subsection>
    </Section>
  );
}
