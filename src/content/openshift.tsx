import Cover from "@/components/docs/Cover";
import type { NavGroup } from "@/components/layout/Sidebar";
import {
  Section1, Section2, Section3, Section4, Section5, Section6,
  Section7, Section8, Section9, Section10, Section11, Section12,
} from "@/content/openshift/sections";

export const sidebarGroups: NavGroup[] = [
  {
    icon: "📋",
    label: "Getting Started",
    items: [
      { id: "variables", label: "1. Variables" },
      { id: "prerequisites", label: "2. Prerequisites" },
      { id: "wsl-prep", label: "3. WSL Setup" },
    ],
  },
  {
    icon: "🔌",
    label: "vSphere",
    items: [
      { id: "vsphere-prep", label: "4. vSphere Environment" },
      { id: "nfs-haproxy", label: "5. HAProxy + NFS VM" },
      { id: "ocp-vms", label: "6. OpenShift VMs" },
    ],
  },
  {
    icon: "🚀",
    label: "Installation",
    items: [
      { id: "ignition", label: "7. Generate Ignition Configs" },
      { id: "cluster-install", label: "8. Cluster Install" },
      { id: "postinstall", label: "9. Post-Install" },
    ],
  },
  {
    icon: "⚙️",
    label: "Operations",
    items: [
      { id: "cleanup", label: "10. Cleanup" },
      { id: "troubleshooting", label: "11. Troubleshooting" },
      { id: "tests", label: "12. Verification Tests" },
    ],
  },
];

export default function OpenShiftContent() {
  return (
    <>
      <Cover
        breadcrumb="devops / openshift / upi"
        title="OpenShift 4.14 UPI on vSphere"
        highlight="UPI"
        sub="User Provisioned Infrastructure — HAProxy, NFS, RHCOS on vSphere"
        chips={[
          { label: "OpenShift 4.14", color: "blue" },
          { label: "vSphere UPI", color: "green" },
          { label: "HAProxy + NFS", color: "amber" },
          { label: "govc", color: "red" },
        ]}
      />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Section8 />
      <Section9 />
      <Section10 />
      <Section11 />
      <Section12 />
    </>
  );
}
