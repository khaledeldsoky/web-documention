"use client";

import type { ReactNode } from "react";
import DocsPageLayout from "@/components/layout/DocsPageLayout";
import type { NavGroup } from "@/components/layout/Sidebar";
import VarReplace from "@/components/docs/VarReplace";

type Props = {
  children: ReactNode;
  title: string;
  eyebrow?: string;
  footer?: string;
  sidebarGroups: NavGroup[];
};

export default function CoursePageClient({
  children,
  title,
  eyebrow,
  footer,
  sidebarGroups,
}: Props) {
  return (
    <DocsPageLayout
      title={title}
      eyebrow={eyebrow}
      footer={footer}
      sidebarGroups={sidebarGroups}
    >
      {children}
      <VarReplace />
    </DocsPageLayout>
  );
}
