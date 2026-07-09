import OpenShiftContent, { sidebarGroups as openshiftSidebar } from "./openshift";
import type { NavGroup } from "@/components/layout/Sidebar";
import type { ReactNode } from "react";

type CourseModule = {
  Content: () => ReactNode;
  sidebarGroups: NavGroup[];
  title: string;
  eyebrow: string;
  footer: string;
};

const courses: Record<string, CourseModule> = {
  "openshift-upi-v414": {
    Content: OpenShiftContent,
    sidebarGroups: openshiftSidebar,
    title: "OpenShift 4.14 UPI on vSphere",
    eyebrow: "DevOps / OpenShift",
    footer: "OpenShift 4.14 UPI Guide v1.0",
  },
};

export function getCourse(slug: string): CourseModule | undefined {
  return courses[slug];
}

export function getAllCourseSlugs(): string[] {
  return Object.keys(courses);
}
