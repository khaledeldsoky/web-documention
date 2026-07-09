"use client";

import { useEffect } from "react";
import { getStore, subscribe } from "@/lib/varStore";

export default function VarReplace() {
  useEffect(() => {
    const main = document.querySelector(".main") || document.body;

    function replace() {
      const vars = getStore();
      main.querySelectorAll("[data-var]").forEach((el) => {
        const name = el.getAttribute("data-var");
        if (!name) return;
        const value = vars[name];
        if (value && el.textContent !== value) {
          el.textContent = value;
        } else if (!value && el.textContent !== `<${name}>`) {
          el.textContent = `<${name}>`;
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
  }, []);

  return null;
}
