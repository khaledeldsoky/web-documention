import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import BenefitGrid from "@/components/docs/BenefitCard";

export function Section1() {
  return (
    <Section id="what-is" num={1} title="What is GitHub Actions?">
      <Prose>
        GitHub Actions is a CI/CD (Continuous Integration / Continuous
        Deployment) system built into GitHub. Simply put: anything you do
        manually after a push — like running tests or deploying a site — can be
        automated by GitHub automatically.
      </Prose>

      <BenefitGrid
        cards={[
          {
            icon: "❌",
            title: "Before CI/CD — Manual",
            body: "Push → open terminal → run tests → build → upload to server. Wastes time, you forget steps, errors happen.",
          },
          {
            icon: "✅",
            title: "After CI/CD — Automated",
            body: "Push → GitHub runs tests → builds → deploys automatically. You just focus on the code.",
          },
        ]}
      />

      {/* ── GitHub Actions Architecture ── */}
      <Subsection title="GitHub Actions Architecture">
        <CodeBlock label="Workflow → Jobs → Steps">
{`Workflow — the whole file (.github/workflows/*.yml)
  Job 1 — build (runs on Ubuntu)
    Step 1: actions/checkout (fetch the code)
    Step 2: actions/setup-node (setup Node)
    Step 3: run: npm ci (install deps)
    Step 4: run: npm run build (build)
  Job 2 — deploy (needs Job 1 to finish)
    Step 1: download artifact (fetch the files)
    Step 2: deploy to server (deploy)`}
        </CodeBlock>
      </Subsection>

      {/* ── Core Concepts ── */}
      <Subsection title="Core Concepts">
        <InfoTable
          columns={[
            { header: "Term", key: "term" },
            { header: "Description", key: "desc" },
            { header: "Example", key: "example" },
          ]}
          rows={[
            {
              term: "Workflow",
              desc: "YAML file that defines the entire automation",
              example: "<code>.github/workflows/deploy.yml</code>",
            },
            {
              term: "Job",
              desc: "Group of steps running on the same runner",
              example: "<code>build</code>, <code>test</code>, <code>deploy</code>",
            },
            {
              term: "Step",
              desc: "One command or action inside a job",
              example: "<code>run: npm test</code>",
            },
            {
              term: "Action",
              desc: "Reusable unit from GitHub Marketplace",
              example: "<code>actions/checkout@v4</code>",
            },
            {
              term: "Runner",
              desc: "The server that runs the workflow",
              example: "<code>ubuntu-latest</code>, <code>self-hosted</code>",
            },
            {
              term: "Event",
              desc: "The event that triggers the workflow",
              example: "<code>push</code>, <code>pull_request</code>, <code>schedule</code>",
            },
          ]}
        />
      </Subsection>

      <Callout variant="info">
        <strong>Let&apos;s agree on one thing:</strong> The Workflow is the whole
        file. The Job is a specific task inside the file. The Step is one line
        within the task. Don&apos;t memorize this — understand the relationship and
        it&apos;ll stick in your mind.
      </Callout>
    </Section>
  );
}
