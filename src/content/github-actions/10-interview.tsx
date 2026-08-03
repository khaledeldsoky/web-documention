import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";

export function Section10() {
  return (
    <Section id="interview" num={10} title="Interview Questions">
      <Prose>
        The most common questions in GitHub Actions interviews — with ideal
        answers.
      </Prose>

      {/* ── Basic Questions ── */}
      <Subsection title="Basic Questions">
        <Callout variant="info" icon="Q">
          <strong>Explain GitHub Actions briefly.</strong>
          <br />• It&apos;s a CI/CD system from GitHub. You write YAML files in{" "}
          <code>.github/workflows/</code> that define Events (like push) that
          trigger Jobs (tasks) with Steps (steps) on Runners (servers).
        </Callout>

        <Callout variant="info" icon="Q">
          <strong>What&apos;s the difference between push and pull_request events?</strong>
          <br />• <code>push</code> runs when you push to a branch.{" "}
          <code>pull_request</code> runs when you create a PR (open,
          synchronize, closed).
        </Callout>

        <Callout variant="info" icon="Q">
          <strong>What&apos;s the difference between needs and strategy.matrix?</strong>
          <br />• <code>needs</code> makes a job wait for another job
          (sequential execution). <code>matrix</code> lets you repeat the same
          job with different values (parallel execution).
        </Callout>

        <Callout variant="info" icon="Q">
          <strong>How do you deploy after tests pass?</strong>
          <br />• Use <code>needs: test</code> in the deploy job — it won&apos;t run
          unless test succeeds. And also{" "}
          <code>if: github.ref == &apos;refs/heads/main&apos;</code> for main only.
        </Callout>
      </Subsection>

      {/* ── Practical Scenarios in Interviews ── */}
      <Subsection title="Practical Scenarios in Interviews">
        <Callout variant="warn" icon="Q">
          <strong>
            You have a workflow that runs on push to main, and you want a
            manual trigger to choose the environment.
          </strong>
          <br />• Use <code>workflow_dispatch</code> with an input for the
          environment.
        </Callout>

        <CodeBlock lang="yaml" label="Manual Trigger">
{`on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'staging'`}
        </CodeBlock>

        <Callout variant="warn" icon="Q">
          <strong>How do you speed up the workflow with caching?</strong>
          <br />• Use <code>actions/cache@v4</code> to save{" "}
          <code>node_modules</code> or <code>~/.npm</code> and restore them next
          time instead of downloading from scratch.
        </Callout>

        <CodeBlock lang="yaml" label="Caching node_modules">
{`- name: Cache node_modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      \${{ runner.os }}-node-`}
        </CodeBlock>

        <Callout variant="success" icon="🎯">
          <strong>Interview tip:</strong> Start with the basics (Workflow ← Job
          ← Step). Mention <code>actions/checkout</code> and{" "}
          <code>actions/setup-node</code> as examples. Talk about caching and
          secrets as best practices. If asked about scale: mention reusable
          workflows and self-hosted runners.
        </Callout>
      </Subsection>
    </Section>
  );
}
