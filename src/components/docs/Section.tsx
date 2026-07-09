import type { ReactNode } from "react";

type Props = {
  id: string;
  num: string | number;
  title: string;
  children: ReactNode;
  numColor?: string;
};

export default function Section({ id, num, title, children, numColor }: Props) {
  return (
    <section className="section" id={id}>
      <div className="section-header">
        <div
          className="section-num"
          style={numColor ? { background: numColor, color: "#000" } : undefined}
        >
          {num}
        </div>
        <h2 className="section-title">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function Subsection({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <div className="subsection" id={id}>
      <h3 className="sub-title">{title}</h3>
      {children}
    </div>
  );
}
