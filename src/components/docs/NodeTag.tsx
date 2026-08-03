import type { ReactNode } from "react";

type Props = {
  label: ReactNode;
  variant: "all" | "h1" | "h2" | "h3" | "arr" | "m1";
};

export default function NodeTag({ label, variant }: Props) {
  return <span className={`node-tag tag-${variant}`}>{label}</span>;
}
