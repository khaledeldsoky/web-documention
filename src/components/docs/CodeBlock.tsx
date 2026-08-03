import type { ReactNode } from "react";
import { highlight } from "@/lib/shiki";
import CopyButton from "./CopyButton";

type Props = {
  label?: ReactNode;
  children: ReactNode;
  variant?: "h1" | "h2" | "h3";
  lang?: string;
};

export default async function CodeBlock({
  label,
  children,
  variant,
  lang,
}: Props) {
  const raw = typeof children === "string" ? children : String(children);
  let code = raw;

  const varMarkers: string[] = [];
  code = code.replace(/<([A-Z][A-Z_0-9]+)>/g, (_m, name) => {
    const key = `\x00${varMarkers.length}\x00`;
    varMarkers.push(name);
    return key;
  });

  const highlighted = lang ? await highlight(code, lang) : null;

  const restoreVars = (html: string) =>
    html.replace(/\x00(\d+)\x00/g, (_m, i) => {
      const name = varMarkers[+i];
      if (name) return `<span class="placeholder" data-var="${name}">&lt;${name}&gt;</span>`;
      return _m;
    });

  return (
    <div className={`code-block${variant ? ` ${variant}` : ""}`}>
      <div className="cb-head">
        {label && <span className="cb-label">{label}</span>}
        <CopyButton code={raw} />
        <div className="cb-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
      {highlighted ? (
        <pre
          dangerouslySetInnerHTML={{ __html: restoreVars(highlighted) }}
        />
      ) : (
        <pre>{raw}</pre>
      )}
    </div>
  );
}
