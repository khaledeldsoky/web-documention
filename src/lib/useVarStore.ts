"use client";

import { useState, useEffect } from "react";
import { getStore, subscribe, loadFromStorage } from "@/lib/varStore";

export function useVarStore(course: string) {
  const [vars, setVars] = useState(() => getStore(course));

  useEffect(() => {
    loadFromStorage(course);
    setVars({ ...getStore(course) });
    return subscribe(course, () => setVars({ ...getStore(course) }));
  }, [course]);

  return vars;
}
