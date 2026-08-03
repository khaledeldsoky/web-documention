import Section from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import InfoTable from "@/components/docs/InfoTable";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section11() {
  return (
    <Section id="quickref" num={11} title="Quick Reference">
      <Prose>
        A single comprehensive table of all keywords in GitHub Actions — refer
        to it whenever you need.
      </Prose>

      <InfoTable
        columns={[
          { header: "Keyword", key: "keyword" },
          { header: "Function", key: "function" },
          { header: "Example", key: "example" },
        ]}
        rows={[
          {
            keyword: "<code>name</code>",
            function: "Workflow name",
            example: "<code>name: CI/CD</code>",
          },
          {
            keyword: "<code>on</code>",
            function: "The event that triggers the workflow",
            example: "<code>on: [push, pull_request]</code>",
          },
          {
            keyword: "<code>env</code>",
            function: "Global variables",
            example: "<code>env: NODE_ENV: production</code>",
          },
          {
            keyword: "<code>jobs</code>",
            function: "Root for defining tasks",
            example: "<code>jobs: { build: ... }</code>",
          },
          {
            keyword: "<code>runs-on</code>",
            function: "Runner type",
            example: "<code>runs-on: ubuntu-latest</code>",
          },
          {
            keyword: "<code>needs</code>",
            function: "Job ordering",
            example: "<code>needs: [build, test]</code>",
          },
          {
            keyword: "<code>steps</code>",
            function: "Steps inside a job",
            example: "<code>steps: [uses, run]</code>",
          },
          {
            keyword: "<code>uses</code>",
            function: "Use an action",
            example: "<code>uses: actions/checkout@v4</code>",
          },
          {
            keyword: "<code>run</code>",
            function: "Run a shell command",
            example: "<code>run: npm test</code>",
          },
          {
            keyword: "<code>with</code>",
            function: "Inputs for the action",
            example: "<code>with: node-version: '20'</code>",
          },
          {
            keyword: "<code>if</code>",
            function: "Condition to run",
            example: "<code>if: github.ref == 'main'</code>",
          },
          {
            keyword: "<code>strategy.matrix</code>",
            function: "Repeat the job with values",
            example: "<code>matrix: { os: [ubuntu, windows] }</code>",
          },
          {
            keyword: "<code>permissions</code>",
            function: "GITHUB_TOKEN permissions",
            example: "<code>permissions: contents: read</code>",
          },
          {
            keyword: "<code>defaults</code>",
            function: "Default settings",
            example: "<code>defaults: run: shell: bash</code>",
          },
          {
            keyword: "<code>continue-on-error</code>",
            function: "Continue even on failure",
            example: "<code>continue-on-error: true</code>",
          },
          {
            keyword: "<code>timeout-minutes</code>",
            function: "Maximum time limit",
            example: "<code>timeout-minutes: 60</code>",
          },
          {
            keyword: "<code>services</code>",
            function: "Run a helper service",
            example: "<code>services: redis: image: redis</code>",
          },
        ]}
      />

      <VerifyBlock label="Top 4 Actions You Must Know">
        <p>
          actions/checkout@v4 · actions/setup-node@v4 · actions/cache@v4 ·
          actions/upload-artifact@v4
        </p>
      </VerifyBlock>
    </Section>
  );
}
