import Cover from "@/components/docs/Cover";
import type { NavGroup } from "@/components/layout/Sidebar";
import {
  Section0, Section1, Section2, Section3, Section4, Section5, Section6,
  Section7, Section8, Section9, Section10, Section11, Section12,
  Section13, Section14, Section15, Section16, Section17, Section18,
} from "@/content/k8s-airgap-baremetal/sections";

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
    icon: "🌐",
    label: "Network & Infra",
    items: [
      { id: "static-ip", label: "2 - Static IP Configuration" },
      { id: "offline-bundle", label: "3 - Build Offline Bundle" },
      { id: "master1-infra", label: "4 - master1 Infra Setup" },
      { id: "point-nodes", label: "5 - Point Nodes at master1" },
    ],
  },
  {
    icon: "⚙️",
    label: "System Prep",
    items: [
      { id: "system-prep", label: "6 - System Prep" },
      { id: "containerd", label: "7 - Install containerd" },
      { id: "kubeadm", label: "8 - Install kubeadm" },
    ],
  },
  {
    icon: "🚀",
    label: "Cluster Init",
    items: [
      { id: "kube-vip", label: "9 - kube-vip Setup" },
      { id: "init-cluster", label: "10 - Initialize Cluster" },
      { id: "flannel", label: "11 - Install Flannel" },
      { id: "join-masters", label: "12 - Join Masters 2 & 3" },
      { id: "join-workers", label: "13 - Join Workers" },
    ],
  },
  {
    icon: "🔧",
    label: "Networking",
    items: [
      { id: "metallb", label: "14 - Install MetalLB" },
      { id: "nginx-ingress", label: "15 - Install NGINX Ingress" },
    ],
  },
  {
    icon: "📊",
    label: "Operations",
    items: [
      { id: "verification", label: "16 - Verification" },
      { id: "troubleshooting", label: "17 - Troubleshooting" },
      { id: "backup", label: "18 - Backup & Recovery" },
    ],
  },
];

export default function K8sAirgapBaremetalContent() {
  return (
    <>
      <Cover
        breadcrumb="kubernetes / airgap / baremetal"
        title="Kubernetes HA Air-Gapped Deployment — Baremetal"
        highlight="Kubernetes"
        sub="3 masters + 3 workers on RHEL 9. No internet, no DHCP, no existing DNS. Everything self-contained."
        chips={[
          { label: "Kubernetes", color: "blue" },
          { label: "Air-Gapped", color: "green" },
          { label: "Baremetal", color: "amber" },
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
    </>
  );
}
