import OpenShiftContent, { sidebarGroups as openshiftSidebar } from "./openshift";
import LinuxContent, { sidebarGroups as linuxSidebar } from "./linux";
import K8sAirgapHaContent, { sidebarGroups as k8sAirgapHaSidebar } from "./k8s-airgap-ha";
import StorageIscsi3lunContent, { sidebarGroups as storageSidebar } from "./storage-iscsi-3lun";
import GitHubActionsContent, { sidebarGroups as githubActionsSidebar } from "./github-actions";
import BashBasicsContent, { sidebarGroups as bashBasicsSidebar } from "./bash-basics";
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
  "k8s-airgap-ha": {
    Content: K8sAirgapHaContent,
    sidebarGroups: k8sAirgapHaSidebar,
    title: "Kubernetes HA Air-Gapped Deployment",
    eyebrow: "Kubernetes / Air-Gapped / HA",
    footer: "K8s Air-Gap HA Guide v1.0",
  },
  "storage-iscsi-3lun": {
    Content: StorageIscsi3lunContent,
    sidebarGroups: storageSidebar,
    title: "3-LUN iSCSI Storage Configuration",
    eyebrow: "Storage / iSCSI / Dell EMC",
    footer: "3-LUN iSCSI Storage Guide v1.0",
  },
  "github-actions": {
    Content: GitHubActionsContent,
    sidebarGroups: githubActionsSidebar,
    title: "GitHub Actions Guide",
    eyebrow: "DevOps / CI-CD",
    footer: "GitHub Actions Guide v2.0",
  },
  "bash-basics": {
    Content: BashBasicsContent,
    sidebarGroups: bashBasicsSidebar,
    title: "Bash Scripting Basics",
    eyebrow: "Scripting / Bash",
    footer: "Bash Scripting Basics v1.0",
  },
};

export function getCourse(slug: string): CourseModule | undefined {
  return courses[slug];
}

export function getAllCourseSlugs(): string[] {
  return Object.keys(courses);
}
