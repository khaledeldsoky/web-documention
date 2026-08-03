"use client";

import { useEffect, useState } from "react";

type NavItem = {
  id: string;
  label: string;
  level?: 1 | 2;
};

type NavGroup = {
  icon: string;
  label: string;
  items: NavItem[];
};

type Props = {
  groups: NavGroup[];
  title?: string;
  eyebrow?: string;
  footer?: string;
};

export default function Sidebar({ groups, title, eyebrow, footer }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<boolean[]>(() => groups.map(() => true));
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    const shouldCollapse = saved === "true";
    if (shouldCollapse !== collapsed) {
      setCollapsed(shouldCollapse);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
  };

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".section[id]");
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(".sidebar .nav-item");

    if (!sections.length || !navLinks.length) return;

    const navMap: Record<string, HTMLAnchorElement> = {};
    navLinks.forEach((a) => {
      const id = a.getAttribute("href")?.replace("#", "");
      if (id) navMap[id] = a;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        let best = "";
        let bestRatio = 0;
        entries.forEach((e) => {
          if (e.intersectionRatio > bestRatio) {
            best = e.target.id;
            bestRatio = e.intersectionRatio;
          }
        });
        navLinks.forEach((a) => {
          a.classList.remove("active");
          a.removeAttribute("aria-current");
        });
        if (best && navMap[best]) {
          navMap[best].classList.add("active");
          navMap[best].setAttribute("aria-current", "location");
          setActiveId(best);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <aside
      className={`sidebar${collapsed ? " collapsed" : ""}`}
      id="sidebar"
      role="complementary"
      aria-label="Course navigation"
    >
      <div className="sidebar-head">
        <button
          className="sidebar-toggle"
          id="sidebar-toggle"
          onClick={toggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          aria-controls="sidebar"
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>
      <div className="sidebar-scroll">
        {(title || eyebrow) && (
          <div className="sidebar-logo">
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            {title && <h2>{title}</h2>}
          </div>
        )}
        <nav aria-label="Section navigation">
          {groups.map((group, gi) => (
            <div key={gi}>
              <div
                className={`nav-group${expanded[gi] ? " open" : ""}`}
                role="button"
                tabIndex={0}
                aria-expanded={expanded[gi]}
                onClick={() =>
                  setExpanded((prev) => {
                    const next = [...prev];
                    next[gi] = !next[gi];
                    return next;
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpanded((prev) => {
                      const next = [...prev];
                      next[gi] = !next[gi];
                      return next;
                    });
                  }
                }}
              >
                <span className="gi" aria-hidden="true">{group.icon}</span>
                {group.label}
                <span className="nav-chevron" aria-hidden="true" />
              </div>
              {expanded[gi] && (
                <ul className="nav-list" role="list">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <a
                        className={`nav-item l${item.level || 1}`}
                        href={`#${item.id}`}
                        aria-current={activeId === item.id ? "location" : undefined}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
      {footer && <div className="sidebar-footer">{footer}</div>}
    </aside>
  );
}

export type { NavGroup, NavItem };
