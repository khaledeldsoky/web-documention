import type { ReactNode } from "react";

type Step = {
  title: ReactNode;
  desc: ReactNode;
};

type Props = {
  steps: Step[];
};

export default function StepList({ steps }: Props) {
  return (
    <ol className="step-list">
      {steps.map((step, i) => (
        <li key={i}>
          <div>
            <strong>{step.title}</strong>
            <span className="desc">{step.desc}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
