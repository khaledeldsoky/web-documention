"use client";

import type { ReactNode } from "react";

type Props = {
  variant: "info" | "warn" | "danger" | "success";
  icon?: string;
  children: ReactNode;
};

const defaultIcons: Record<string, string> = {
  info: "ℹ️",
  warn: "⚠️",
  danger: "🚫",
  success: "✅",
};

export default function Callout({ variant, icon, children }: Props) {
  return (
    <div className={`callout ${variant}`}>
      <span className="callout-icon">{icon || defaultIcons[variant]}</span>
      <div>{children}</div>
    </div>
  );
}
