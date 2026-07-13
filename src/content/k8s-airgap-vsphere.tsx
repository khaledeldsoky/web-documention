import Cover from "@/components/docs/Cover";
import type { NavGroup } from "@/components/layout/Sidebar";
import {
  Section0, Section1, Section2, Section3, Section4, Section5, Section6,
  Section7, Section8, Section9, Section10, Section11, Section12,
  Section13, Section14, Section15, Section16, Section17, Section18, Section19,
} from "@/content/k8s-airgap-vsphere/sections";

export const sidebarGroups: NavGroup[] = [
  {
    icon: "📋",
    label: "Setup",
    items: [
      { id: "variables", label: "0 - Variables" },
      { id: "overview", label: "1 - Overview & Assumptions" },
    ],
  },
  {
    icon: "🖥️",
    label: "VM Creation",
    items: [
      { id: "create-vms", label: "2 - Create VMs with govc" },
      { id: "verify-network", label: "3 - Verify Network & Hostnames" },
    ],
  },
  {
    icon: "🌐",
    label: "Network & Infra",
    items: [
      { id: "offline-bundle", label: "4 - Build Offline Bundle" },
      { id: "master1-infra", label: "5 - master1 Infra Setup" },
      { id: "point-nodes", label: "6 - Point Nodes at master1" },
    ],
  },
  {
    icon: "⚙️",
    label: "System Prep",
    items: [
      { id: "system-prep", label: "7 - System Prep" },
      { id: "containerd", label: "8 - Install containerd" },
      { id: "kubeadm", label: "9 - Install kubeadm" },
    ],
  },
  {
    icon: "🚀",
    label: "Cluster Init",
    items: [
      { id: "kube-vip", label: "10 - kube-vip Setup" },
      { id: "init-cluster", label: "11 - Initialize Cluster" },
      { id: "flannel", label: "12 - Install Flannel" },
      { id: "join-masters", label: "13 - Join Masters 2 & 3" },
      { id: "join-workers", label: "14 - Join Workers" },
    ],
  },
  {
    icon: "🔧",
    label: "Networking",
    items: [
      { id: "metallb", label: "15 - Install MetalLB" },
      { id: "nginx-ingress", label: "16 - Install NGINX Ingress" },
    ],
  },
  {
    icon: "📊",
    label: "Operations",
    items: [
      { id: "verification", label: "17 - Verification" },
      { id: "troubleshooting", label: "18 - Troubleshooting" },
      { id: "backup", label: "19 - Backup & Recovery" },
    ],
  },
];

export default function K8sAirgapVsphereContent() {
  return (
    <>
      <Cover
        breadcrumb="kubernetes / airgap / vsphere"
        title="Kubernetes HA Air-Gapped Deployment — vSphere"
        highlight="Kubernetes"
        sub="3 masters + 3 workers on vSphere. No internet, no DHCP, no existing DNS. VMs cloned from RHEL template with govc."
        chips={[
          { label: "Kubernetes", color: "blue" },
          { label: "Air-Gapped", color: "green" },
          { label: "vSphere", color: "amber" },
          { label: "HA 3+3", color: "red" },
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
      <Section10 />
      <Section11 />
      <Section12 />
      <Section13 />
      <Section14 />
      <Section15 />
      <Section16 />
      <Section17 />
      <Section18 />
      <Section19 />
    </>
  );
}
