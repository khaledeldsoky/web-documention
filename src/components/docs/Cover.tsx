import type { ReactNode } from "react";

type Props = {
  breadcrumb: string;
  title: string;
  highlight?: string;
  sub: string;
  chips?: { label: string; color: "green" | "blue" | "amber" | "red" }[];
};

export default function Cover({ breadcrumb, title, highlight, sub, chips }: Props) {
  return (
    <div className="cover">
      <div className="breadcrumb">{breadcrumb}</div>
      <h1>
        {highlight ? (
          <>
            {title.split(highlight)[0]}
            <span className="hl">{highlight}</span>
            {title.split(highlight)[1]}
          </>
        ) : (
          title
        )}
      </h1>
      <p className="sub">{sub}</p>
      {chips && chips.length > 0 && (
        <div className="chip-row">
          {chips.map((chip, i) => (
            <span key={i} className={`chip chip-${chip.color}`}>
              {chip.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
