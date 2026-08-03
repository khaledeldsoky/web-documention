import Section from "@/components/docs/Section";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import BenefitGrid from "@/components/docs/BenefitCard";

export function Section9() {
  return (
    <Section id="security" num={9} title="Security in GitHub Actions">
      <BenefitGrid
        cards={[
          {
            icon: "🔐",
            title: "1. Least Privilege",
            body: "Always use <code>permissions: contents: read</code> — don't give more than the job needs.",
            danger: true,
          },
          {
            icon: "🔑",
            title: "2. OIDC Instead of Secrets",
            body: "OIDC lets the workflow get a temporary token from the cloud provider (AWS, Azure, GCP) without storing a long-lived secret.",
            danger: true,
          },
          {
            icon: "🛡️",
            title: "3. Avoid Script Injection",
            body: "Don't use <code>${{ }}</code> directly inside <code>run:</code> — a user could inject malicious code via a PR title for example. Use <code>env:</code> to pass the values.",
            danger: true,
          },
          {
            icon: "📌",
            title: "4. Pin Actions with SHA",
            body: "Instead of <code>@v4</code>, use <code>@full-sha-hash</code> to prevent unexpected changes in the action from affecting the workflow.",
            danger: true,
          },
        ]}
      />

      <CodeBlock lang="yaml" label="Script Injection — The Problem and Solution">
{`# ❌ Wrong — vulnerable
- run: echo "\${{ github.event.pull_request.title }}"

# ✅ Right — safe
- env:
    PR_TITLE: \${{ github.event.pull_request.title }}
  run: echo "$PR_TITLE"`}
      </CodeBlock>

      <Callout variant="info">
        <strong>Security summary:</strong> Least privilege → OIDC if possible →
        don&apos;t trust external input → pin action versions.
      </Callout>
    </Section>
  );
}
