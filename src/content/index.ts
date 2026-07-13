import OpenShiftContent, { sidebarGroups as openshiftSidebar } from "./openshift";
import LinuxContent, { sidebarGroups as linuxSidebar } from "./linux";
import K8sAirgapBaremetalContent, { sidebarGroups as k8sAirgapBaremetalSidebar } from "./k8s-airgap-baremetal";
import K8sAirgapVsphereContent, { sidebarGroups as k8sAirgapVsphereSidebar } from "./k8s-airgap-vsphere";
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
  "linux-admin": {
    Content: LinuxContent,
    sidebarGroups: linuxSidebar,
    title: "Linux System Administration",
    eyebrow: "Linux / Administration",
    footer: "Linux Administration Guide v2.0",
  },
  "k8s-airgap-baremetal": {
    Content: K8sAirgapBaremetalContent,
    sidebarGroups: k8sAirgapBaremetalSidebar,
    title: "Kubernetes HA Air-Gapped — Baremetal",
    eyebrow: "Kubernetes / Air-Gapped",
    footer: "K8s Air-Gap Baremetal Guide v1.0",
  },
  "k8s-airgap-vsphere": {
    Content: K8sAirgapVsphereContent,
    sidebarGroups: k8sAirgapVsphereSidebar,
    title: "Kubernetes HA Air-Gapped — vSphere",
    eyebrow: "Kubernetes / Air-Gapped",
    footer: "K8s Air-Gap vSphere Guide v1.0",
  },
};

export function getCourse(slug: string): CourseModule | undefined {
  return courses[slug];
}

export function getAllCourseSlugs(): string[] {
  return Object.keys(courses);
}
