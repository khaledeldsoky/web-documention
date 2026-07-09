import type { ReactNode, ReactElement } from "react";

type Props = {
  children: ReactNode;
};

export default function Prose({ children }: Props) {
  return <p className="prose">{children}</p>;
}

export function prose(children: ReactNode): ReactElement {
  return <p className="prose">{children}</p>;
}
