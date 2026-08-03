"use client";

import type { ReactNode } from "react";

type Props = {
  label?: ReactNode;
  children: ReactNode;
};

export default function VerifyBlock({ label = "verify", children }: Props) {
  return (
    <div className="verify">
      <div className="v-label">{label}</div>
      {children}
    </div>
  );
}
