"use client";

import { useEffect } from "react";
import { getStore, subscribe, loadFromStorage } from "@/lib/varStore";

type Props = {
  course: string;
};

export default function VarReplace({ course }: Props) {
  useEffect(() => {
    loadFromStorage(course);
    const main = document.querySelector(".main") || document.body;

    function replace() {
      const vars = getStore(course);
      main.querySelectorAll("[data-var]").forEach((el) => {
        const name = el.getAttribute("data-var");
        if (!name) return;
        const value = vars[name];
        if (value && el.textContent !== value) {
          el.textContent = value;
        } else if (value === "" && el.textContent !== "") {
          el.textContent = "";
        }
      });
    }

    replace();

    const observer = new MutationObserver(replace);
    observer.observe(main, {
      childList: true,
      subtree: true,
    });

    const unsub = subscribe(replace);

    return () => {
      unsub();
      observer.disconnect();
    };
  }, [course]);

  return null;
}
