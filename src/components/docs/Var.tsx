"use client";

import { useState, useEffect } from "react";
import { getStore, subscribe, loadFromStorage } from "@/lib/varStore";

type Props = {
  course: string;
  name: string;
};

export default function Var({ course, name }: Props) {
  const [vars, setVars] = useState(() => getStore(course));

  useEffect(() => {
    loadFromStorage(course);
    setVars({ ...getStore(course) });
    return subscribe(() => setVars({ ...getStore(course) }));
  }, [course]);

  const value = vars[name];

  return (
    <span style={{ color: value ? "var(--accent-green)" : "var(--accent3)" }}>
      {value ? value : `<${name}>`}
    </span>
  );
}
