import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import StepList from "@/components/docs/StepList";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section2() {
  return (
    <Section id="first-workflow" num={2} title="Your First Workflow">
      <Prose>
        Let&apos;s start with the smallest possible workflow — it prints a message
        when you push. All you need is one file in the right place.
      </Prose>

      {/* ── Where to Create the File ── */}
      <Subsection title="Where to Create the File?">
        <CodeBlock lang="bash" label="Mandatory Path">
{`# Create this folder in your repo root
mkdir -p .github/workflows/

# Then create .github/workflows/first.yml
touch .github/workflows/first.yml`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>Very important:</strong> The file must be inside{" "}
          <code>.github/workflows/</code> exactly. If you put it anywhere else,
          GitHub won&apos;t read it. The extension must be <code>.yml</code> or{" "}
          <code>.yaml</code>.
        </Callout>
      </Subsection>

      {/* ── Minimal Workflow ── */}
      <Subsection title="Minimal Workflow">
        <CodeBlock lang="yaml" label="first.yml — Hello World">
{`# Workflow name (shows in GitHub)
name: Hello World

# When to run?
on:
  push:                      # any push on any branch

# Tasks
jobs:
  hello:                     # job name (any name)
    runs-on: ubuntu-latest   # the server it runs on
    steps:
      - run: echo "Hello from GitHub Actions!"`}
        </CodeBlock>

        <Prose>
          After you push this file, go to GitHub → the <strong>Actions</strong>{" "}
          tab → you&apos;ll see the Workflow running. Click on it and check the
          logs.
        </Prose>
      </Subsection>

      {/* ── How to See the Result ── */}
      <Subsection title="How to See the Result?">
        <StepList
          steps={[
            {
              title: "Push the file",
              desc: "Put the file in <code>.github/workflows/first.yml</code> and commit + push.",
            },
            {
              title: "Open GitHub (your repo)",
              desc: "You'll find a tab called <strong>Actions</strong> at the top of the page — click it.",
            },
            {
              title: "Watch the Workflow run",
              desc: "You'll find \"Hello World\" in the list — click it and watch the logs live.",
            },
            {
              title: "When you see a green check ✅ — congratulations!",
              desc: "Your first workflow is running! It printed \"Hello from GitHub Actions!\" in the log.",
            },
          ]}
        />
      </Subsection>

      <VerifyBlock label="Summary">
        <p>
          Workflow = YAML file in <code>.github/workflows/</code>, triggered by
          an Event, runs Jobs with Steps on a Runner.
        </p>
      </VerifyBlock>
    </Section>
  );
}
