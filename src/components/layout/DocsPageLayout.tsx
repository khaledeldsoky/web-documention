"use client";

import { useState, type ReactNode } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import MobileDrawer from "./MobileDrawer";
import type { NavGroup } from "./Sidebar";

type Props = {
  children: ReactNode;
  title: string;
  eyebrow?: string;
  footer?: string;
  sidebarGroups: NavGroup[];
};

export default function DocsPageLayout({
  children,
  title,
  eyebrow,
  footer,
  sidebarGroups,
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Topbar
        title={title}
        backHref="../../"
        onToggleDrawer={() => setDrawerOpen((p) => !p)}
      />
      <MobileDrawer
        groups={sidebarGroups}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <Sidebar
        groups={sidebarGroups}
        title={title}
        eyebrow={eyebrow}
        footer={footer}
      />
      <main className="main">{children}</main>
    </>
  );
}
