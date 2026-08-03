import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import BenefitGrid from "@/components/docs/BenefitCard";

export function Section7() {
  return (
    <Section id="mistakes" num={7} title="Common Mistakes & Debugging">
      <Prose>
        The most common mistakes when learning GitHub Actions — and how to fix
        them.
      </Prose>

      <InfoTable
        columns={[
          { header: "Problem", key: "problem" },
          { header: "Cause", key: "cause" },
          { header: "Solution", key: "solution" },
        ]}
        rows={[
          {
            problem: "Workflow not showing in GitHub",
            cause: "File is not in the right path",
            solution: "Make sure it's in <code>.github/workflows/*.yml</code>",
          },
          {
            problem: "\"Invalid workflow file\"",
            cause: "Wrong YAML indentation",
            solution: "Use two spaces (not tabs)",
          },
          {
            problem: "\"Command not found\"",
            cause: "Forgot <code>actions/checkout</code>",
            solution: "Add <code>- uses: actions/checkout@v4</code> as first step",
          },
          {
            problem: "\"Permission denied\"",
            cause: "GITHUB_TOKEN doesn't have permissions",
            solution: "Add <code>permissions:</code> in the YAML",
          },
          {
            problem: "\"Secret not found\"",
            cause: "Secret not saved",
            solution: "Settings → Secrets and variables → Actions",
          },
          {
            problem: "Build is slow",
            cause: "No caching",
            solution: "Use <code>actions/cache@v4</code>",
          },
          {
            problem: "Job stuck in queue",
            cause: "GitHub concurrency limits",
            solution: "Use a self-hosted runner",
          },
        ]}
      />

      {/* ── Debugging Techniques ── */}
      <Subsection title="Debugging Techniques">
        <BenefitGrid
          cards={[
            {
              icon: "🔍",
              title: "Enable Debug Logging",
              body: "Add a secret named <code>ACTIONS_STEP_DEBUG=true</code> — GitHub will show detailed logs for every step.",
            },
            {
              icon: "⏩",
              title: "continue-on-error",
              body: "If a step fails, the whole workflow stops. Use <code>continue-on-error: true</code> to continue and see the rest.",
            },
            {
              icon: "⚠",
              title: "if: failure()",
              body: "Add a step at the end with <code>if: always()</code> to see failure logs or do cleanup.",
            },
            {
              icon: "📋",
              title: "Manual Dispatch",
              body: "Use <code>workflow_dispatch</code> to run the workflow manually whenever you want for testing.",
            },
          ]}
        />
      </Subsection>

      <Callout variant="warn">
        <strong>Most time-wasting mistake for beginners:</strong> YAML uses{" "}
        <strong>two spaces</strong> (spaces) not tabs. If you use a tab, GitHub
        will reject the file. Make your editor show whitespace.
      </Callout>
    </Section>
  );
}
