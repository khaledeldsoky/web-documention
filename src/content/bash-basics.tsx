import Cover from "@/components/docs/Cover";
import type { NavGroup } from "@/components/layout/Sidebar";
import {
  Section1, Section2, Section3, Section4, Section5, Section6,
  Section7, Section8, Section9, Section10, Section11,
} from "@/content/bash-basics/sections";

export const sidebarGroups: NavGroup[] = [
  {
    icon: "🔀",
    label: "Conditionals — IF",
    items: [
      { id: "if-file", label: "1 - Check File Exists" },
      { id: "if-number", label: "2 - Compare Numbers" },
      { id: "if-string", label: "3 - Compare Strings" },
      { id: "if-empty-dir", label: "4 - Check Empty Directory" },
    ],
  },
  {
    icon: "🔄",
    label: "Loops — For & While",
    items: [
      { id: "for-list", label: "5 - For Loop — List" },
      { id: "for-files", label: "6 - For Loop — Files" },
      { id: "for-range", label: "7 - For Loop — Range" },
      { id: "while-count", label: "8 - While Loop — Count" },
      { id: "while-read", label: "9 - While Loop — Read File" },
      { id: "while-infinite", label: "10 - While Loop — Infinite" },
    ],
  },
  {
    icon: "📦",
    label: "Functions — Functions",
    items: [{ id: "functions", label: "11 - Functions" }],
  },
];

export default function BashBasicsContent() {
  return (
    <>
      <Cover
        breadcrumb="scripting / bash / basics"
        title="Bash Scripting Basics"
        highlight="Bash Scripting Basics"
        sub="A quick reference for the most common Bash scripting patterns — conditionals, loops, and functions."
        chips={[
          { label: "Bash", color: "green" },
          { label: "Scripting", color: "blue" },
          { label: "Beginner", color: "amber" },
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
