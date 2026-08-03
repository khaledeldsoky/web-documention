import Section from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";

export function Section8() {
  return (
    <Section id="context" num={8} title="Context Objects — Built-in Variables">
      <Prose>
        GitHub Actions has Context Objects — built-in variables you can use in
        YAML to get info about the repo, the event, the runner, and more. You
        use them with <code>{"${{ context.key }}"}</code>.
      </Prose>

      <InfoTable
        columns={[
          { header: "Variable", key: "variable" },
          { header: "Description", key: "desc" },
          { header: "Examples", key: "example" },
        ]}
        rows={[
          {
            variable: "<code>${{ github.ref }}</code>",
            desc: "Current branch or tag",
            example: "<code>refs/heads/main</code>",
          },
          {
            variable: "<code>${{ github.event_name }}</code>",
            desc: "The event that triggered the workflow",
            example: "<code>push</code>, <code>pull_request</code>",
          },
          {
            variable: "<code>${{ github.actor }}</code>",
            desc: "The user who triggered the event",
            example: "<code>khaled</code>",
          },
          {
            variable: "<code>${{ github.repository }}</code>",
            desc: "The current repo",
            example: "<code>owner/repo-name</code>",
          },
          {
            variable: "<code>${{ github.sha }}</code>",
            desc: "The commit hash",
            example: "<code>abc123def456...</code>",
          },
          {
            variable: "<code>${{ env.VAR_NAME }}</code>",
            desc: "Variable from env",
            example: "<code>${{ env.NODE_ENV }}</code>",
          },
          {
            variable: "<code>${{ secrets.SECRET_NAME }}</code>",
            desc: "Secret from Settings",
            example: "<code>${{ secrets.API_KEY }}</code>",
          },
          {
            variable: "<code>${{ matrix.os }}</code>",
            desc: "Value from matrix",
            example: "<code>ubuntu-latest</code>",
          },
          {
            variable: "<code>${{ runner.os }}</code>",
            desc: "Runner OS",
            example: "<code>Linux</code>, <code>Windows</code>, <code>macOS</code>",
          },
        ]}
      />

      <CodeBlock lang="yaml" label="Context Usage Examples">
{`jobs:
  info:
    steps:
      - run: echo "Branch: \${{ github.ref }}"
      - run: echo "Event: \${{ github.event_name }}"
      - run: echo "Actor: \${{ github.actor }}"
      - run: echo "OS: \${{ runner.os }}"
      - env:
          MY_SECRET: \${{ secrets.API_KEY }}
        run: echo "Key length: \${#MY_SECRET}"`}
      </CodeBlock>

      <Callout variant="danger">
        <strong>Security warning:</strong> Don&apos;t print secrets in the logs! If
        you write <code>echo {"${{ secrets.API_KEY }}"}</code>, GitHub
        automatically masks it as <code>***</code>. Still — don&apos;t print them.
      </Callout>
    </Section>
  );
}
