type Props = {
  label: string;
  color: "green" | "blue" | "amber" | "red";
};

export default function Chip({ label, color }: Props) {
  return <span className={`chip chip-${color}`}>{label}</span>;
}

export function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="chip-row">{children}</div>;
}
