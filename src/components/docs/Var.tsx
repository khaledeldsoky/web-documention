"use client";

import { useState, useEffect } from "react";
import { getStore, subscribe, loadFromStorage } from "@/lib/varStore";

type Props = {
  name: string;
};

export default function Var({ name }: Props) {
  const [vars, setVars] = useState(getStore);

  useEffect(() => {
    loadFromStorage();
    setVars({ ...getStore() });
    return subscribe(() => setVars({ ...getStore() }));
  }, []);

  const value = vars[name];

  return (
    <span style={{ color: value ? "var(--accent-green)" : "var(--accent3)" }}>
      {value ? value : `<${name}>`}
    </span>
  );
}
