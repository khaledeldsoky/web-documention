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
  open: boolean;
  onClose: () => void;
};

export default function MobileDrawer({ groups, open, onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <div
      className={`topbar-drawer${open ? " open" : ""}`}
      id="topbar-drawer"
    >
      {groups.map((group, gi) => (
        <div key={gi}>
          <div className="nav-group">
            <span className="gi">{group.icon}</span>
            {group.label}
          </div>
          {group.items.map((item) => (
            <a
              key={item.id}
              className={`nav-item l${item.level || 1}`}
              href={`#${item.id}`}
              onClick={onClose}
            >
              {item.label}
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
