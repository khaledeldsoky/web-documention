import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export default function Collapsible({ title, children, defaultOpen }: Props) {
  return (
    <details className="collapsible" open={defaultOpen}>
      <summary className="collapsible-summary">{title}</summary>
      <div className="collapsible-body">{children}</div>
    </details>
  );
}
