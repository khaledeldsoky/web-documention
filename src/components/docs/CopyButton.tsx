"use client";

import { useState } from "react";

type Props = {
  code: string;
};

export default function CopyButton({ code }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const pre = e.currentTarget.closest(".code-block")?.querySelector("pre");
      const text = pre?.textContent || code;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <button
      className="cb-copy"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}
