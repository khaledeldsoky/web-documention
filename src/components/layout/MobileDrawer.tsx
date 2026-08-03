"use client";

import { useEffect, useRef } from "react";

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
  open: boolean;
  onClose: () => void;
};

export default function MobileDrawer({ groups, open, onClose }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const firstLink = drawerRef.current?.querySelector<HTMLElement>("a");
      firstLink?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div
      ref={drawerRef}
      className={`topbar-drawer${open ? " open" : ""}`}
      id="topbar-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      aria-hidden={!open}
    >
      <nav aria-label="Mobile navigation">
        {groups.map((group, gi) => (
          <div key={gi}>
            <div className="nav-group" role="heading" aria-level={3}>
              <span className="gi" aria-hidden="true">{group.icon}</span>
              {group.label}
            </div>
            <ul className="nav-list" role="list">
              {group.items.map((item) => (
                <li key={item.id}>
                  <a
                    className={`nav-item l${item.level || 1}`}
                    href={`#${item.id}`}
                    onClick={onClose}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
