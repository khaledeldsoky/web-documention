"use client";

import { useVarStore } from "@/lib/useVarStore";

type Props = {
  course: string;
  name: string;
};

export default function Var({ course, name }: Props) {
  const vars = useVarStore(course);
  const value = vars[name];

  return (
    <span style={{ color: value ? "var(--accent-green)" : "var(--accent3)" }}>
      {value || `<${name}>`}
    </span>
  );
}
