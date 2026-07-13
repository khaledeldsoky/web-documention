import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section19() {
  return (
    <Section id="rescue-grub" num={19} title="Rescue Mode & GRUB">
      <Prose>
        Sometimes the system won&apos;t boot — GRUB is broken, the kernel
        won&apos;t start, or you forgot the password. Rescue Mode and GRUB
        Recovery are your tools to save the day.
      </Prose>

      {/* ── 1. Rescue Mode ── */}
      <Subsection title="Rescue Mode / Single User Mode">
        <Prose>
          Rescue Mode gives you a shell as root without starting all services —
          to fix boot problems.
        </Prose>

        <CodeBlock lang="bash" label="Entering Rescue Mode — from GRUB">
{`# During boot: press Shift (BIOS) or Esc (UEFI) to show GRUB
#
# 1. Highlight the first kernel option
# 2. Press 'e' to edit boot entry
# 3. Look for the line starting with linux or linux16
# 4. Add this word at the end of the line:
init=/bin/bash

# Or if systemd:
systemd.unit=rescue.target

# 5. Press Ctrl + X or F10 to boot
# 6. You'll get a shell as root — fix what you need

# After fixing — reboot
exec /sbin/init
# Or
reboot -f`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>Note:</strong> If you used <code>init=/bin/bash</code>, the
          system mounts as read-only. To write changes:{" "}
          <code>mount -o remount,rw /</code>
        </Callout>
      </Subsection>

      {/* ── 2. GRUB Recovery ── */}
      <Subsection title="GRUB Recovery — Fixing the Bootloader">
        <Prose>
          If GRUB itself is broken or corrupted (e.g. after installing
          Windows), you need to reinstall it.
        </Prose>

        <CodeBlock lang="bash" label="Fixing GRUB — from Live CD/USB">
{`# 1. Boot from Live CD/USB
# 2. Open terminal

# 3. Find the partition names (e.g. /dev/sda1 = /boot, /dev/sda2 = /)
lsblk

# 4. Mount the system root
mount /dev/sda2 /mnt
mount /dev/sda1 /mnt/boot   # If /boot is on a separate partition

# 5. Chroot — enter the system
for dir in /dev /proc /sys /run; do mount --bind $dir /mnt$dir; done
chroot /mnt

# 6. Reinstall GRUB
grub2-install /dev/sda         # Or grub-install depending on distribution

# 7. Rebuild GRUB config
grub2-mkconfig -o /boot/grub2/grub.cfg   # CentOS/RHEL/Fedora
update-grub                                 # Ubuntu/Debian

# 8. Exit and reboot
exit
reboot`}
        </CodeBlock>

        <Callout variant="info">
          <strong>The Difference:</strong>{" "}
          <code>grub-install</code> writes GRUB to MBR or UEFI partition.{" "}
          <code>grub-mkconfig</code> (or <code>grub2-mkconfig</code>) builds
          the config file from the kernels installed in <code>/boot</code>.
        </Callout>
      </Subsection>

      {/* ── 3. Reset root Password ── */}
      <Subsection title="Resetting root Password">
        <CodeBlock lang="bash" label="Forgot root password — Reset it">
{`# Same steps as Rescue Mode:
# 1. From GRUB press 'e' on the kernel entry
# 2. Add init=/bin/bash at the end of the linux line
# 3. Ctrl + X to boot

# Remount as read-write
mount -o remount,rw /

# Change root password
passwd

# If SELinux is enabled
touch /.autorelabel

# Reboot
exec /sbin/init`}
        </CodeBlock>

        <VerifyBlock label="GRUB Recovery — Quick Summary">
          <p>
            Live CD → mount partitions → chroot → grub-install →
            grub-mkconfig → reboot
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
