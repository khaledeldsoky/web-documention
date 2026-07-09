type Props = {
  label: string;
  variant: "all" | "h1" | "h2" | "h3";
};

export default function NodeTag({ label, variant }: Props) {
  return <span className={`node-tag tag-${variant}`}>{label}</span>;
}
