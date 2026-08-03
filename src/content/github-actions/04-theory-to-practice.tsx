import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import StepList from "@/components/docs/StepList";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section4() {
  return (
    <Section id="theory-to-practice" num={4} title="From Theory to Practice">
      <Prose>
        Let&apos;s apply what we&apos;ve learned to a real scenario: a React site (or Vue
        or any SPA) we want to build and deploy to GitHub Pages — every time
        you push to main.
      </Prose>

      {/* ── Scenario ── */}
      <Subsection title="Scenario — 7 Steps">
        <Callout variant="info" icon="📖">
          <strong>Story:</strong> You&apos;re a developer with a React site. You
          write code, push, and want the site to deploy automatically without
          opening a terminal or clicking any buttons.
        </Callout>

        <StepList
          steps={[
            {
              title: "You do: git push origin main",
              desc: "GitHub receives the push and knows an event happened on main.",
            },
            {
              title: "GitHub looks for Workflow files",
              desc: "Goes to <code>.github/workflows/</code> and finds <code>deploy.yml</code> — starts reading it.",
            },
            {
              title: "GitHub provisions a Runner",
              desc: "Prepares an <code>ubuntu-latest</code> server with Git and Node.js ready to go.",
            },
            {
              title: "Job 1: Build",
              desc: "Checkout ← Setup Node ← npm ci ← npm run build → produces a <code>build/</code> folder.",
            },
            {
              title: "Upload Artifact",
              desc: "Saves the <code>build/</code> folder for the next job to use.",
            },
            {
              title: "Job 2: Deploy (needs: build)",
              desc: "Waits for build to finish ← downloads artifact ← deploys to GitHub Pages.",
            },
            {
              title: "Site LIVE! 🚀",
              desc: "The new site is live at <code>https://user.github.io/repo/</code>.",
            },
          ]}
        />
      </Subsection>

      {/* ── Complete Diagram ── */}
      <Subsection title="Complete Diagram">
        <CodeBlock label="Build → Deploy Pipeline">
{`Job 1: BUILD
runs-on: ubuntu-latest

├─ actions/checkout@v4      ← "fetched the code ✅"
├─ actions/setup-node@v4    ← "setup Node.js 20 ✅"
├─ run: npm ci              ← "installed dependencies ✅"
├─ run: npm run build       ← "built → build/ ✅"
└─ upload-artifact          ← "saved build/ ✅"

          ↓
    needs: build
    "waiting for build to finish..."
          ↓

Job 2: DEPLOY
needs: build
if: github.ref == 'refs/heads/main'

├─ download-artifact        ← "fetched build/ ✅"
└─ deploy-pages             ← "deployed to Pages ✅"
                            ← "Site LIVE! 🚀"`}
        </CodeBlock>
      </Subsection>

      {/* ── Full YAML ── */}
      <Subsection title="Full YAML">
        <CodeBlock variant="h1" lang="yaml" label="deploy.yml — React to GitHub Pages">
{`name: Build & Deploy React App

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: production-files
          path: ./build/

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: production-files
          path: ./build/
      - uses: actions/deploy-pages@v4
        id: deployment`}
        </CodeBlock>
      </Subsection>

      {/* ── Comparison ── */}
      <Subsection title="Comparison — Theory vs Practice">
        <InfoTable
          columns={[
            { header: "Theory", key: "theory" },
            { header: "Practice (YAML)", key: "practice" },
          ]}
          rows={[
            {
              theory: "\"run on push to main\"",
              practice: "<code>on: push: branches: [main]</code>",
            },
            { theory: "\"on Ubuntu\"", practice: "<code>runs-on: ubuntu-latest</code>" },
            {
              theory: "\"fetch the code\"",
              practice: "<code>uses: actions/checkout@v4</code>",
            },
            {
              theory: "\"setup Node\"",
              practice: "<code>uses: actions/setup-node@v4</code>",
            },
            {
              theory: "\"install deps\"",
              practice: "<code>run: npm ci</code>",
            },
            {
              theory: "\"build the site\"",
              practice: "<code>run: npm run build</code>",
            },
            {
              theory: "\"save the files\"",
              practice: "<code>uses: actions/upload-artifact@v4</code>",
            },
            {
              theory: "\"wait for build to finish\"",
              practice: "<code>needs: build</code>",
            },
            {
              theory: "\"fetch the files\"",
              practice: "<code>uses: actions/download-artifact@v4</code>",
            },
            {
              theory: "\"deploy\"",
              practice: "<code>uses: actions/deploy-pages@v4</code>",
            },
          ]}
        />
      </Subsection>

      <VerifyBlock label="Summary">
        <p>
          You don&apos;t need to memorize YAML syntax. Understand the flow: Event →
          Job → Step. The syntax is just a way to describe that flow in a file.
        </p>
      </VerifyBlock>
    </Section>
  );
}
