import Cover from "@/components/docs/Cover";
import type { NavGroup } from "@/components/layout/Sidebar";
import {
  Section0, Section1, Section2, Section3, Section4,
  Section5, Section6, Section7, Section8, Section9,
} from "@/content/storage-iscsi-3lun/sections";

export const sidebarGroups: NavGroup[] = [
  {
    icon: "📋",
    label: "Start Here",
    items: [
      { id: "variables", label: " 0 — Variables" },
      { id: "overview", label: " 1 — What You Will Build" },
    ],
  },
  {
    icon: "🔧",
    label: "Phase A — Array",
    items: [
      { id: "phase-a", label: " 2 — ME4024 Array Configuration" },
    ],
  },
  {
    icon: "⚙️",
    label: "Phase B — OS",
    items: [
      { id: "phase-b-packages", label: " 3 — Packages & Kernel Tuning" },
      { id: "phase-b-network", label: " 4 — Network, IQN & CHAP" },
      { id: "phase-b-iscsi", label: " 5 — iSCSI Discovery & Multipath" },
      { id: "phase-b-lvm", label: " 6 — LVM, XFS & Mount" },
      { id: "phase-b-io", label: " 7 — I/O Scheduler & Permissions" },
    ],
  },
  {
    icon: "🚀",
    label: "Phase C — Kubernetes",
    items: [
      { id: "phase-c", label: " 8 — Labels, Provisioner & Test" },
    ],
  },
  {
    icon: "📊",
    label: "Reference",
    items: [
      { id: "reference", label: " 9 — DR Procedure & Checklist" },
    ],
  },
];

export default function StorageIscsi3lunContent() {
  return (
    <>
      <Cover
        breadcrumb="storage / iscsi / 3-lun"
        title="3-LUN iSCSI Storage Configuration"
        highlight="iSCSI"
        sub="Complete guide for the storage team to configure a Dell EMC ME4024 array and three RHEL 9 worker nodes from scratch. Array setup, OS storage stack, and Kubernetes integration."
        chips={[
          { label: "Dell EMC ME4024", color: "amber" },
          { label: "iSCSI · MPIO · LVM · XFS", color: "blue" },
          { label: "3 × 20 TB LUNs", color: "green" },
          { label: "No Shared Filesystem", color: "red" },
          { label: "local-path-provisioner", color: "green" },
        ]}
      />
      <Section0 />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Section8 />
      <Section9 />
    </>
  );
}
