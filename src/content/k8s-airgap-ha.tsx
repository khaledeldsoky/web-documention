import Cover from "@/components/docs/Cover";
import type { NavGroup } from "@/components/layout/Sidebar";
import {
  Section0, Section1, Section2, Section3, Section4, Section5, Section6,
  Section7, Section8, Section9, Section10, Section11, Section12,
  Section13, Section14, Section15, Section16, Section17, Section18,
  Section19, Section20, Section21, Section22, Section23,
} from "@/content/k8s-airgap-ha/sections";

export const sidebarGroups: NavGroup[] = [
  {
    icon: "📋",
    label: "Start Here",
    items: [
      { id: "variables", label: " 0 — Variables" },
      { id: "overview", label: " 1 — Overview & IP Plan" },
    ],
  },
  {
    icon: "🔍",
    label: "Image Discovery",
    items: [
      { id: "image-discovery", label: " 2 — Discover Image Versions" },
    ],
  },
  {
    icon: "🌐",
    label: "Network Setup",
    items: [
      { id: "static-ip", label: " 3 — Static IP Configuration" },
      { id: "ics-temp-internet", label: " 4 — Temporary Internet (ICS)" },
    ],
  },
  {
    icon: "⚙️",
    label: "System Preparation",
    items: [
      { id: "system-prep", label: " 5 — System Preparation" },
      { id: "containerd", label: " 6 — Install containerd" },
      { id: "kubernetes-tools", label: " 7 — Install Kubernetes Tools" },
    ],
  },
  {
    icon: "🚀",
    label: "Cluster Initialization",
    items: [
      { id: "kube-vip", label: " 8 — kube-vip Setup" },
      { id: "init-cluster", label: " 9 — Initialize Cluster" },
      { id: "flannel-cni", label: " 10 — Install Flannel CNI" },
      { id: "join-masters", label: " 11 — Join Masters 2 & 3" },
      { id: "join-workers", label: " 12 — Join Workers" },
    ],
  },
  {
    icon: "🔧",
    label: "Networking & Load Balancing",
    items: [
      { id: "metallb", label: " 13 — Install MetalLB" },
      { id: "nginx-ingress", label: " 14 — Install NGINX Ingress" },
    ],
  },
  {
    icon: "🔒",
    label: "Air-Gap Hardening",
    items: [
      { id: "cluster-health", label: " 15 — Cluster Health Check" },
      { id: "pull-all-images", label: " 16 — Pull All Images" },
      { id: "master1-infra", label: " 17 — master1 Infra Node" },
      { id: "containerd-mirror", label: " 18 — Containerd Mirror Config" },
      { id: "point-nodes-master1", label: " 19 — Point Nodes at master1" },
      { id: "test-services", label: " 20 — Test DNS/NTP/Registry" },
      { id: "remove-internet", label: " 21 — Remove Internet Access" },
      { id: "final-validation", label: " 22 — Final Air-Gap Validation" },
    ],
  },
  {
    icon: "📊",
    label: "Reference",
    items: [
      { id: "troubleshooting", label: " 23 — Troubleshooting" },
    ],
  },
];

export default function K8sAirgapHaContent() {
  return (
    <>
      <Cover
        breadcrumb="kubernetes / airgap / ha"
        title="Kubernetes HA Air-Gapped Deployment"
        highlight="Kubernetes"
        sub="3 masters + 3 workers on RHEL 9. nerdctl (not Docker). Air-gapped with local registry, dnsmasq DNS, chrony NTP, and local yum repo on master1."
        chips={[
          { label: "Kubernetes", color: "blue" },
          { label: "Air-Gapped", color: "green" },
          { label: "HA 3+3", color: "amber" },
          { label: "nerdctl", color: "red" },
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
      <Section20 />
      <Section21 />
      <Section22 />
      <Section23 />
    </>
  );
}
