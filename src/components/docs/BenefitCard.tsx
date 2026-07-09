import type { ReactNode } from "react";

type Card = {
  icon: string;
  title: string;
  body: string;
  danger?: boolean;
};

type Props = {
  cards: Card[];
};

function BenefitCard({ icon, title, body, danger }: Card) {
  return (
    <div className={`benefit-card${danger ? " danger" : ""}`}>
      <span className="bc-icon">{icon}</span>
      <div className="bc-title">{title}</div>
      <div className="bc-body">{body}</div>
    </div>
  );
}

export default function BenefitGrid({ cards }: Props) {
  return (
    <div className="benefit-grid">
      {cards.map((card, i) => (
        <BenefitCard key={i} {...card} />
      ))}
    </div>
  );
}
