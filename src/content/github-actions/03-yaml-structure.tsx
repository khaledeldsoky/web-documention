import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";

export function Section3() {
  return (
    <Section id="yaml-structure" num={3} title="YAML Structure — Keyword Breakdown">
      <Prose>
        Let&apos;s take each keyword in YAML and understand it individually. Every
        word has a specific role in the workflow. You don&apos;t need to memorize —
        understand the role and you&apos;ll know how to use it.
      </Prose>

      {/* ── 3.1 on ── */}
      <Subsection id="yaml-on" title="on — When to Run the Workflow?">
        <Prose>
          This is the first keyword in the workflow. It defines the{" "}
          <strong>event</strong> that triggers the file. It can be push,{" "}
          pull_request, schedule (timer), or manual (workflow_dispatch).
        </Prose>

        <CodeBlock lang="yaml" label="on Examples">
{`# on every push
on: push

# on push to main or dev only
on:
  push:
    branches: [main, dev]

# on pull_request to main
on:
  pull_request:
    branches: [main]

# schedule — daily at 12 midnight UTC
on:
  schedule:
    - cron: '0 0 * * *'

# manual — a button in GitHub
on:
  workflow_dispatch:
    inputs:
      env:
        description: 'Environment'
        required: true
        default: 'staging'`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Info:</strong> You can combine multiple events in the same
          workflow. For example, run on push <strong>and</strong> pull_request
          at the same time.
        </Callout>
      </Subsection>

      {/* ── 3.2 jobs ── */}
      <Subsection id="yaml-jobs" title="jobs — Tasks">
        <Prose>
          Every workflow has one or more jobs. Each job runs on a separate{" "}
          <strong>runner</strong> (independent server). You name the job
          whatever fits — no spaces.
        </Prose>

        <CodeBlock lang="yaml" label="jobs — basic">
{`jobs:
  build:           # ⬅️ any name you choose
    runs-on: ubuntu-latest
    steps: [ ... ]

  deploy:          # ⬅️ another job
    runs-on: ubuntu-latest
    steps: [ ... ]`}
        </CodeBlock>

        <InfoTable
          columns={[
            { header: "Property", key: "prop" },
            { header: "Description", key: "desc" },
            { header: "Example", key: "example" },
          ]}
          rows={[
            {
              prop: "<code>runs-on</code>",
              desc: "Runner type",
              example: "<code>ubuntu-latest</code>, <code>windows-latest</code>",
            },
            {
              prop: "<code>needs</code>",
              desc: "The job that must finish first",
              example: "<code>needs: build</code>",
            },
            {
              prop: "<code>if</code>",
              desc: "Condition to run",
              example: "<code>if: github.ref == 'refs/heads/main'</code>",
            },
            {
              prop: "<code>strategy</code>",
              desc: "Repeat the job with different values",
              example: "<code>matrix</code>",
            },
            {
              prop: "<code>env</code>",
              desc: "Variables for the whole job",
              example: "<code>env: NODE_ENV: test</code>",
            },
            {
              prop: "<code>permissions</code>",
              desc: "Job permissions",
              example: "<code>permissions: contents: read</code>",
            },
          ]}
        />
      </Subsection>

      {/* ── 3.3 steps ── */}
      <Subsection id="yaml-steps" title="steps — Steps">
        <Prose>
          Every job has steps that run <strong>in order</strong> (one after
          another). If a step fails, the rest won&apos;t run (unless you set{" "}
          <code>continue-on-error: true</code>).
        </Prose>

        <CodeBlock lang="yaml" label="Step Types">
{`steps:
  # use — use a prebuilt action from GitHub
  - uses: actions/checkout@v4

  # run — direct shell command
  - name: Install dependencies
    run: npm ci

  # with — parameters for the action
  - uses: actions/setup-node@v4
    with:
      node-version: '20'

  # run with multi-line
  - name: Build and test
    run: |
      npm run build
      npm test

  # if — condition for the step
  - if: failure()
    run: echo "Something failed!"`}
        </CodeBlock>
      </Subsection>

      {/* ── 3.4 runs-on ── */}
      <Subsection id="yaml-runs-on" title="runs-on — What does the Job run on?">
        <Prose>
          Every job needs a server to run on. You choose the type of server.
          GitHub-hosted are GitHub&apos;s servers, and Self-hosted are your own.
        </Prose>

        <CodeBlock lang="yaml" label="runs-on — options">
{`jobs:
  linux:
    runs-on: ubuntu-latest   # or ubuntu-22.04

  windows:
    runs-on: windows-latest  # or windows-2022

  mac:
    runs-on: macos-latest    # or macos-14

  private:
    runs-on: self-hosted     # on your own machine`}
        </CodeBlock>
      </Subsection>

      {/* ── 3.5 needs ── */}
      <Subsection id="yaml-needs" title="needs — Job Ordering">
        <Prose>
          By default, all jobs run <strong>in parallel</strong> (each job on its
          own runner at the same time). <code>needs</code> makes a job wait for
          another job to finish first.
        </Prose>

        <CodeBlock lang="yaml" label="needs — dependencies">
{`jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building..."

  test:
    needs: build            # ⬅️ waits for build to finish
    runs-on: ubuntu-latest
    steps:
      - run: echo "Testing..."

  deploy:
    needs: [build, test]    # ⬅️ waits for build and test
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying..."`}
        </CodeBlock>

        <Callout variant="success">
          <strong>Flow:</strong> <code>build</code> ← <code>test</code> ←{" "}
          <code>deploy</code>. If build fails, test won&apos;t run at all.
        </Callout>
      </Subsection>

      {/* ── 3.6 matrix ── */}
      <Subsection id="yaml-matrix" title="strategy.matrix — Multi-run">
        <Prose>
          The matrix lets you repeat the same job with different values (e.g.,
          test on 3 operating systems and 3 Node versions simultaneously).
        </Prose>

        <CodeBlock lang="yaml" label="Matrix — OS × Node">
{`jobs:
  test:
    strategy:
      fail-fast: false    # if one fails, the rest continue
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20, 22]

    runs-on: \${{ matrix.os }}

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
      - run: npm ci && npm test`}
        </CodeBlock>

        <Prose>
          This code produces <strong>9 runs</strong> (3 OS × 3 Node versions) —
          all running in parallel. You can add <code>include</code> or{" "}
          <code>exclude</code> to control the combinations.
        </Prose>
      </Subsection>

      {/* ── 3.7 env ── */}
      <Subsection id="yaml-env" title="env — Variables">
        <Prose>
          You can define variables at 3 levels: for the entire workflow
          (global), for a job, or for a single step.
        </Prose>

        <CodeBlock lang="yaml" label="env — 3 levels">
{`# Global — for the entire workflow
env:
  APP_NAME: my-app
  NODE_ENV: production

jobs:
  build:
    # Job level — for this job only
    env:
      BUILD_DIR: ./dist

    steps:
      - name: Build
        # Step level — for this step only
        env:
          API_URL: https://api.example.com
        run: echo $APP_NAME $BUILD_DIR $API_URL`}
        </CodeBlock>
      </Subsection>

      {/* ── 3.8 permissions ── */}
      <Subsection id="yaml-permissions" title="permissions — Permissions">
        <Prose>
          It defines the permissions of the GITHUB_TOKEN (the token GitHub gives
          the workflow). Best practice is to reduce permissions as much as
          possible.
        </Prose>

        <CodeBlock lang="yaml" label="permissions — examples">
{`# Least privilege — read-only (best)
permissions:
  contents: read

# For a single job
jobs:
  deploy:
    permissions:
      contents: read
      pages: write      # for deploying to GitHub Pages
      id-token: write`}
        </CodeBlock>
      </Subsection>

      {/* ── 3.9 if ── */}
      <Subsection id="yaml-if" title="if — Conditions">
        <Prose>
          You use <code>if</code> to control a job or step — it only runs if the
          condition is met. You can use <code>github</code> variables (like{" "}
          <code>github.ref</code>) or functions like <code>failure()</code> and{" "}
          <code>always()</code>.
        </Prose>

        <CodeBlock lang="yaml" label="if — conditions">
{`# Job condition — only on main
jobs:
  deploy:
    if: github.ref == 'refs/heads/main'

    steps:
      # Step condition
      - if: failure()       # only if it failed
        run: echo "Failed!"

      - if: always()        # always — even on failure
        run: echo "Cleanup..."

      - if: success()       # on success — this is the default
        run: echo "All good!"`}
        </CodeBlock>

        <InfoTable
          columns={[
            { header: "Variable", key: "variable" },
            { header: "Example Value", key: "example" },
            { header: "Description", key: "desc" },
          ]}
          rows={[
            {
              variable: "<code>github.ref</code>",
              example: "<code>refs/heads/main</code>",
              desc: "Current branch or tag",
            },
            {
              variable: "<code>github.event_name</code>",
              example: "<code>push</code>, <code>pull_request</code>",
              desc: "The event that triggered the workflow",
            },
            {
              variable: "<code>github.actor</code>",
              example: "<code>khaled</code>",
              desc: "The user who triggered the event",
            },
            {
              variable: "<code>github.repository</code>",
              example: "<code>owner/repo</code>",
              desc: "Current repo",
            },
            {
              variable: "<code>github.sha</code>",
              example: "<code>abc123...</code>",
              desc: "The commit hash",
            },
          ]}
        />
      </Subsection>

      {/* ── 3.10 defaults ── */}
      <Subsection id="yaml-defaults" title="defaults — Default Settings">
        <Prose>
          It sets default settings for all <code>run</code> steps — like shell
          or working directory. Instead of repeating the same settings in every
          step.
        </Prose>

        <CodeBlock lang="yaml" label="defaults">
{`defaults:
  run:
    shell: bash
    working-directory: ./app

jobs:
  build:
    steps:
      - run: pwd  # will be in ./app
      - run: ls   # will be in ./app`}
        </CodeBlock>
      </Subsection>

      {/* ── YAML Summary ── */}
      <Subsection title="Quick YAML Summary">
        <CodeBlock variant="h1" lang="yaml" label="Full Workflow Template">
{`name: Workflow Name      # workflow name

on: [push]                # when to run?

env:                      # global variables
  KEY: value

jobs:                     # tasks
  job-name:               # job name (any name)
    runs-on: ubuntu-latest # runner type
    needs: [job1]         # dependencies
    if: github.ref == '...' # condition
    permissions: {}       # permissions

    steps:                # steps
      - uses: actions/checkout@v4
      - name: Description
        run: command
        env:              # step variables
          KEY: value
        if: condition`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
