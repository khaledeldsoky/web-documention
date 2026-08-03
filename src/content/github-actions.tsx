import Cover from "@/components/docs/Cover";
import type { NavGroup } from "@/components/layout/Sidebar";
import {
  Section1, Section2, Section3, Section4, Section5, Section6,
  Section7, Section8, Section9, Section10, Section11,
} from "@/content/github-actions/sections";

export const sidebarGroups: NavGroup[] = [
  {
    icon: "📘",
    label: "Fundamentals — Concepts",
    items: [
      { id: "what-is", label: "1 - What is GitHub Actions" },
      { id: "first-workflow", label: "2 - Your First Workflow" },
    ],
  },
  {
    icon: "📐",
    label: "Structure — YAML",
    items: [
      { id: "yaml-structure", label: "3 - YAML Structure" },
      { id: "yaml-on", label: "on — When to Run", level: 2 },
      { id: "yaml-jobs", label: "jobs — Tasks", level: 2 },
      { id: "yaml-steps", label: "steps — Steps", level: 2 },
      { id: "yaml-runs-on", label: "runs-on — Runner Type", level: 2 },
      { id: "yaml-needs", label: "needs — Job Ordering", level: 2 },
      { id: "yaml-matrix", label: "matrix — Multi-run", level: 2 },
      { id: "yaml-env", label: "env — Variables", level: 2 },
      { id: "yaml-permissions", label: "permissions — Permissions", level: 2 },
      { id: "yaml-if", label: "if — Conditions", level: 2 },
      { id: "yaml-defaults", label: "defaults — Defaults", level: 2 },
    ],
  },
  {
    icon: "🔧",
    label: "Practice — Practical",
    items: [
      { id: "theory-to-practice", label: "4 - From Theory to Practice" },
      { id: "runners", label: "5 - GitHub-hosted vs Self-hosted" },
      { id: "linking", label: "6 - Linking YAML Files" },
    ],
  },
  {
    icon: "🧠",
    label: "Expert — Advanced",
    items: [
      { id: "mistakes", label: "7 - Common Mistakes & Debugging" },
      { id: "context", label: "8 - Context Objects" },
      { id: "security", label: "9 - Security in GitHub Actions" },
    ],
  },
  {
    icon: "❓",
    label: "Questions — Interview",
    items: [
      { id: "interview", label: "10 - Interview Questions" },
      { id: "quickref", label: "11 - Quick Reference" },
    ],
  },
];

export default function GitHubActionsContent() {
  return (
    <>
      <Cover
        breadcrumb="devops / ci-cd / github-actions"
        title="GitHub Actions Guide"
        highlight="From Zero to CI/CD"
        sub="GitHub Actions is a CI/CD system built into GitHub — build, test, and deploy your code automatically."
        chips={[
          { label: "CI/CD", color: "green" },
          { label: "GitHub Actions", color: "blue" },
          { label: "YAML", color: "amber" },
          { label: "DevOps", color: "red" },
        ]}
      />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Section8 />
      <Section9 />
      <Section10 />
      <Section11 />
    </>
  );
}
