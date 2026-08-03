import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";

export function Section6() {
  return (
    <Section id="linking" num={6} title="Linking YAML Files">
      <Prose>
        As the project grows, you&apos;ll need to reuse the same steps across multiple
        workflows. GitHub Actions supports two ways to link:
      </Prose>

      {/* ── Method 1: Reusable Workflows ── */}
      <Subsection title="Method 1: Reusable Workflows">
        <Prose>
          A regular workflow but uses <code>workflow_call</code> instead of{" "}
          <code>push</code> — which lets other workflows call it.
        </Prose>

        <CodeBlock lang="yaml" label="reusable-build.yml — The Reusable Workflow">
{`name: Reusable Build

on:
  workflow_call:             # ⬅️ this is what makes it reusable
    inputs:
      node-version:
        required: true
        type: string

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ inputs.node-version }}
      - run: npm ci && npm run build`}
        </CodeBlock>

        <CodeBlock lang="yaml" label="main.yml — The Call">
{`jobs:
  call-reusable:
    uses: ./.github/workflows/reusable-build.yml
    with:
      node-version: '20'`}
        </CodeBlock>
      </Subsection>

      {/* ── Method 2: Composite Actions ── */}
      <Subsection title="Method 2: Composite Actions">
        <Prose>
          A small reusable Action — it bundles a group of steps in an{" "}
          <code>action.yml</code> file. The difference is it&apos;s not a full
          workflow, just ready-made steps you use inside any job.
        </Prose>

        <CodeBlock lang="yaml" label=".github/actions/my-setup/action.yml">
{`name: My Setup
description: Setup Node and install deps

runs:
  using: composite
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: npm ci
      shell: bash`}
        </CodeBlock>

        <CodeBlock lang="yaml" label="Using the composite action">
{`jobs:
  build:
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/my-setup  # ⬅️ invocation
      - run: npm run build`}
        </CodeBlock>

        <Callout variant="success">
          <strong>Difference:</strong> Reusable workflows = full workflows,
          Composite actions = ready-made steps for use inside any job.
        </Callout>
      </Subsection>

      {/* ── Example: 3 Linked Files ── */}
      <Subsection title="Example — 3 Linked Files">
        <CodeBlock label=".github/ file layout">
{`.github/
├── workflows/
│   ├── main.yml            # the main workflow
│   └── reusable-test.yml   # reusable workflow
└── actions/
    └── setup-node/         # composite action
        └── action.yml`}
        </CodeBlock>

        <CodeBlock lang="yaml" label="main.yml — calls reusable-test and composite action">
{`name: Main CI/CD
on: [push]

jobs:
  build:
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup-node
      - run: npm run build

  call-tests:
    needs: build
    uses: ./.github/workflows/reusable-test.yml

  deploy:
    needs: [build, call-tests]
    steps:
      - run: echo "Deploying..."`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
