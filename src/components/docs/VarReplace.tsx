"use client";

import { useEffect } from "react";
import { getStore, setVar, subscribe, loadFromStorage } from "@/lib/varStore";

type Props = {
  course: string;
};

export default function VarReplace({ course }: Props) {
  useEffect(() => {
    loadFromStorage(course);
    const main = (document.querySelector(".main") || document.body) as HTMLElement;

    function replace() {
      const vars = getStore(course);
      main.querySelectorAll("span[data-var]").forEach((el) => {
        const name = el.getAttribute("data-var");
        if (!name) return;
        const value = vars[name];
        if (value) {
          if (el.textContent !== value) el.textContent = value;
        } else if (value === "") {
          if (el.textContent !== "") el.textContent = "";
        } else {
          const placeholder = `<${name}>`;
          if (el.textContent !== placeholder) el.textContent = placeholder;
        }
      });
    }

    replace();

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName !== "SPAN") return;
      const varName = target.getAttribute("data-var");
      if (!varName) return;

      const origClass = target.className;
      const input = document.createElement("input");
      input.className = "cb-var-input";
      input.value = target.textContent || "";

      const cs = getComputedStyle(target);
      input.style.fontFamily = cs.fontFamily;
      input.style.fontSize = cs.fontSize;
      input.style.lineHeight = cs.lineHeight;
      input.style.width = `${Math.max(target.offsetWidth, 60)}px`;

      input.addEventListener("input", () => {
        input.style.width = `${Math.max(input.value.length * 0.7 + 1, 3)}em`;
      });

      const finish = (save: boolean) => {
        if (save) setVar(course, varName, input.value);
        const span = document.createElement("span");
        span.className = origClass;
        span.setAttribute("data-var", varName);
        const val = getStore(course)[varName];
        if (val) {
          span.textContent = val;
        } else if (val === "") {
          span.textContent = "";
        } else {
          span.textContent = `<${varName}>`;
        }
        input.replaceWith(span);
      };

      target.replaceWith(input);
      input.focus();
      input.select();

      input.addEventListener("blur", () => finish(true));
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); input.blur(); }
        if (e.key === "Escape") { e.preventDefault(); finish(false); }
      });
    }

    main.addEventListener("click", handleClick);

    const observer = new MutationObserver(replace);
    observer.observe(main, { childList: true, subtree: true });

    const unsub = subscribe(course, replace);

    return () => {
      unsub();
      observer.disconnect();
      main.removeEventListener("click", handleClick);
    };
  }, [course]);

  return null;
}
