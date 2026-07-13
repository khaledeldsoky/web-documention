import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import InfoTable from "@/components/docs/InfoTable";
import StepList from "@/components/docs/StepList";

export function Section0() {
  return (
    <Section id="boot-process" num={0} title="Linux Boot Process">
      <Prose>
        Instead of memorizing the topic as rigid steps, try to imagine it as a
        story from the moment you press the Power button. Each step prepares the
        next one, and the Boot Process is the series that happens every time you
        turn on the server.
      </Prose>

      {/* ── 1. Complete Sequence from Power On to Login ── */}
      <Subsection title="Complete Sequence from Power On to Login">
        <StepList
          steps={[
            {
              title: "Power On:",
              desc: "When you first turn on the server, the CPU starts looking for the first code to execute — it goes to the Firmware (BIOS or UEFI).",
            },
            {
              title: "BIOS / UEFI — POST",
              desc: "Checks the hardware: ensures RAM is working, the processor is working, and the disk is present. Then it searches for the Boot Device according to the Boot Order (USB, SSD, DVD).",
            },
            {
              title: "Loading the Bootloader (GRUB)",
              desc: "BIOS/UEFI does not know how to directly boot the Linux Kernel. So it loads GRUB — the boot manager. Its job: shows the list of operating systems (if you have Dual Boot), selects the Kernel, and passes Parameters.",
            },
            {
              title: "GRUB loads the Kernel",
              desc: "GRUB loads two important files: /boot/vmlinuz (Linux Kernel) and /boot/initramfs.img (initramfs).",
            },
            {
              title: "Kernel starts working",
              desc: "The Kernel is the heart of the system. When it first starts: it manages RAM, manages the CPU, and loads Drivers. But there is a problem — the Root Filesystem is not yet connected.",
            },
            {
              title: "initramfs",
              desc: "This is a very small Mini Linux. Its job: load Drivers, discover disks, activate LVM, and decrypt the disk if encrypted. Once it finds the real system location, it does mount / and discards itself.",
            },
            {
              title: "Mount Root Filesystem",
              desc: "It does mount / to the real system (e.g. /dev/mapper/rhel-root) and discards initramfs.",
            },
            {
              title: "Starting PID 1 — systemd",
              desc: "The first Process in the system. In modern systems it is systemd. Its number is always PID = 1.",
            },
            {
              title: "systemd starts services",
              desc: "Starts Network, SSH, Cron, Docker, and all required services.",
            },
            {
              title: "Login Screen",
              desc: "Finally: Login Prompt (Server) or GUI (Desktop).",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Boot Flow Diagram">
{`Power On
    ↓
BIOS / UEFI  ← POST, Boot Order
    ↓
GRUB         ← OS List, Kernel Parameters
    ↓
Kernel       ← /boot/vmlinuz
    ↓
initramfs    ← /boot/initramfs.img — Drivers, LVM
    ↓
Root Filesystem  ← mount /
    ↓
systemd (PID 1) ← First Process
    ↓
Services       ← Network, SSH, Cron, Docker, ...
    ↓
Login`}
        </CodeBlock>
      </Subsection>

      {/* ── 2. BIOS vs UEFI ── */}
      <Subsection title="BIOS vs UEFI — The Difference">
        <InfoTable
          columns={[
            { header: "Feature", key: "feature" },
            { header: "BIOS (Legacy)", key: "bios" },
            { header: "UEFI (Modern)", key: "uefi" },
          ]}
          rows={[
            {
              feature: "Interface",
              bios: "Text-based — F2, F10, Del keys",
              uefi: "Graphical — mouse support",
            },
            {
              feature: "Boot storage capacity",
              bios: "MBR — up to 2 TB",
              uefi: "GPT — up to 9 ZB",
            },
            {
              feature: "Boot speed",
              bios: "Slower",
              uefi: "Faster (parallel loading)",
            },
            {
              feature: "Disk partitioning",
              bios: "MBR — 4 primary partitions",
              uefi: "GPT — 128 partitions",
            },
            {
              feature: "Security",
              bios: "---",
              uefi: "Secure Boot — prevents Bootkits",
            },
          ]}
        />
      </Subsection>

      {/* ── 3. Verify that systemd is PID 1 ── */}
      <Subsection title="Verify that systemd is PID 1">
        <CodeBlock lang="bash" label="Check PID 1">
{`# First Process in the system
ps -p 1
#   PID TTY          TIME CMD
#     1 ?        00:00:02 systemd`}
        </CodeBlock>
      </Subsection>

      {/* ── 4. Summary — Short Answer for Exams ── */}
      <Subsection title="Summary — Short Answer for Exams">
        <VerifyBlock label="Model Answer for RHCSA / RHCE">
          <p>
            BIOS/UEFI loads GRUB, GRUB loads the Linux kernel and initramfs,
            the kernel mounts the root filesystem, starts systemd as PID 1,
            and then systemd starts all system services.
          </p>
        </VerifyBlock>

        <Callout variant="info">
          <strong>Tip:</strong> This is the short answer that covers about 80%
          of Linux boot process questions in interviews and exams.
        </Callout>

        <Callout variant="warn">
          <strong>Remember:</strong> If a Boot Failure occurs, the problem is
          usually in one of 3 things: GRUB (Bootloader), Kernel Parameters, or
          the Filesystem (see{" "}
          <a href="#rescue-grub">Section 19 — Rescue Mode &amp; GRUB</a>).
        </Callout>
      </Subsection>
    </Section>
  );
}
