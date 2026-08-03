import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";

export function Section5() {
  return (
    <Section id="runners" num={5} title="GitHub-hosted vs Self-hosted">
      <Prose>
        The Runner is the server that runs the workflow. Two types: GitHub-hosted
        (provided by GitHub) and Self-hosted (you provide on your machine or
        server).
      </Prose>

      <InfoTable
        columns={[
          { header: "Property", key: "prop" },
          { header: "GitHub-hosted", key: "github" },
          { header: "Self-hosted", key: "self" },
        ]}
        rows={[
          {
            prop: "Server",
            github: "GitHub's servers",
            self: "Your machine, VM, or server",
          },
          {
            prop: "Cost",
            github: "2000 minutes/month free (Public repos)",
            self: "Free — but server cost is on you",
          },
          {
            prop: "Setup",
            github: "Ready — nothing needed",
            self: "Need to download and run GitHub Actions Runner",
          },
          {
            prop: "Network access",
            github: "Public — can't reach private network",
            self: "Can reach your internal network — VPN, VPC, etc.",
          },
          {
            prop: "Maintenance",
            github: "GitHub is responsible",
            self: "On you — security, updates, availability",
          },
          {
            prop: "Use case",
            github: "99% of cases — sufficient",
            self: "When you need special hardware or a private network",
          },
        ]}
      />

      {/* ── Setting up a Self-hosted Runner ── */}
      <Subsection title="Setting up a Self-hosted Runner">
        <CodeBlock lang="bash" label="Installing Runner on Ubuntu">
{`# 1. Go to repo → Settings → Actions → Runners → Add runner
# 2. GitHub will give you commands like these:

mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.xxx.tar.gz -L https://github.com/actions/runner/releases/download/v2.xxx/actions-runner-linux-x64-2.xxx.tar.gz
tar xzf actions-runner-linux-x64-2.xxx.tar.gz
./config.sh --url https://github.com/YOUR-ORG/YOUR-REPO --token ABC123
./run.sh`}
        </CodeBlock>

        <CodeBlock lang="yaml" label="Using self-hosted in YAML">
{`jobs:
  deploy:
    runs-on: self-hosted   # runs on your machine
    steps:
      - run: echo "Running on my own server!"`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>Security warning:</strong> With a self-hosted runner, anyone
          with access to the repo can run code on your machine. Use with caution
          — especially in public repos. Better to use GitHub-hosted if you can.
        </Callout>
      </Subsection>
    </Section>
  );
}
