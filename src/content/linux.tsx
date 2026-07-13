import Cover from "@/components/docs/Cover";
import type { NavGroup } from "@/components/layout/Sidebar";
import {
  Section0, Section1, Section2, Section3, Section4, Section5, Section6,
  Section7, Section8, Section9, Section10, Section11, Section12,
  Section13, Section14, Section15, Section16, Section17, Section18,
  Section19, Section20, Section21, Section22,
} from "@/content/linux/sections";

export const sidebarGroups: NavGroup[] = [
  {
    icon: "🖥️",
    label: "System",
    items: [
      { id: "boot-process", label: "0 - Boot Process" },
      { id: "filesystem", label: "1 - Filesystem Hierarchy" },
      { id: "navigation", label: "2 - Navigation" },
      { id: "links", label: "3 - Hard & Symbolic Links" },
      { id: "ssh", label: "4 - SSH" },
      { id: "users", label: "5 - Users & Groups" },
      { id: "permissions", label: "6 - Permissions" },
      { id: "packages", label: "7 - Package Management" },
      { id: "selinux", label: "8 - SELinux" },
      { id: "kernel", label: "9 - Kernel & Modules" },
      { id: "logging", label: "10 - Logging" },
    ],
  },
  {
    icon: "🌐",
    label: "Network",
    items: [
      { id: "firewall-ports", label: "11 - Firewall & Ports" },
      { id: "networking", label: "12 - Networking Config" },
    ],
  },
  {
    icon: "💾",
    label: "Storage",
    items: [
      { id: "storage", label: "13 - Disks, LVM & Filesystems" },
    ],
  },
  {
    icon: "⚙️",
    label: "Services",
    items: [
      { id: "systemd", label: "14 - Systemd Deep Dive" },
      { id: "cron", label: "15 - Cron & At" },
    ],
  },
  {
    icon: "📊",
    label: "Performance",
    items: [
      { id: "performance", label: "16 - Performance Diagnostics" },
      { id: "processes", label: "17 - Process Management" },
    ],
  },
  {
    icon: "🛠️",
    label: "Troubleshooting",
    items: [
      { id: "troubleshooting", label: "18 - Troubleshooting" },
      { id: "rescue-grub", label: "19 - Rescue Mode & GRUB" },
    ],
  },
  {
    icon: "🔧",
    label: "Reference",
    items: [
      { id: "commands", label: "20 - Essential Commands" },
      { id: "nginx-apache", label: "21 - Nginx vs Apache" },
      { id: "http-errors", label: "22 - HTTP 400 vs 500" },
    ],
  },
];

export default function LinuxContent() {
  return (
    <>
      <Cover
        breadcrumb="linux / administration / guide"
        title="Linux System Administration"
        highlight="Linux"
        sub="From terminal commands to server management — everything a sysadmin needs in one guide."
        chips={[
          { label: "Linux", color: "green" },
          { label: "SSH · Security", color: "blue" },
          { label: "Systemd · Firewall", color: "amber" },
          { label: "Storage · Networking", color: "red" },
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
    </>
  );
}
