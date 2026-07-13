import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";
import VerifyBlock from "@/components/docs/VerifyBlock";
import BenefitGrid from "@/components/docs/BenefitCard";

export function Section13() {
  return (
    <Section id="storage" num={13} title="Storage — Disks, LVM & Filesystems">
      <Prose>
        This is one of the most asked things in Linux work and RHCSA/RHCE.
        Let&apos;s walk from when a new disk arrives until it becomes available
        to users.
      </Prose>

      {/* ── 1. XFS vs Ext4 Overview ── */}
      <Subsection title="XFS vs Ext4 — Filesystem Comparison">
        <BenefitGrid
          cards={[
            {
              icon: "🚀",
              title: "XFS — For Large Files and High Performance",
              body: "High-performance 64-bit filesystem. Excellent for very large files (multi-GB/TB). Supports up to 8 EB maximum. Suitable for large storage systems and databases. Supports online defragmentation (xfs_fsr). RHEL default filesystem.",
            },
            {
              icon: "💪",
              title: "Ext4 — Reliability and Compatibility",
              body: "Successor to Ext3, the most tested on various hardware. Supports up to 1 EB. Easy to repair (fsck). Suitable for medium and numerous files (many small files). Uses extents to reduce fragmentation. Ubuntu default filesystem.",
            },
          ]}
        />

        <InfoTable
          columns={[
            { header: "Feature", key: "feature" },
            { header: "XFS", key: "xfs" },
            { header: "Ext4", key: "ext4" },
          ]}
          rows={[
            {
              feature: "Max file size",
              xfs: "8 EB",
              ext4: "16 TB",
            },
            {
              feature: "Max filesystem size",
              xfs: "8 EB",
              ext4: "1 EB",
            },
            {
              feature: "Performance with large files",
              xfs: "Excellent (+1 GB)",
              ext4: "Good",
            },
            {
              feature: "Performance with small files",
              xfs: "Average",
              ext4: "Excellent",
            },
            {
              feature: "Grow",
              xfs: "Yes — without unmount",
              ext4: "Yes",
            },
            {
              feature: "Shrink",
              xfs: "No",
              ext4: "Yes",
            },
            {
              feature: "Online Defrag",
              xfs: "Yes (xfs_fsr)",
              ext4: "No (e4defrag experimental)",
            },
            {
              feature: "RHEL default",
              xfs: "✔️",
              ext4: "❌",
            },
            {
              feature: "Ubuntu default",
              xfs: "❌",
              ext4: "✔️",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Maintenance Tools — Repair & Check">
{`# XFS
xfs_repair /dev/sda1
xfs_fsr /dev/sda1   # defrag

# Ext4
fsck.ext4 -y /dev/sda1
tune2fs -l /dev/sda1 | grep -i "filesystem state"`}
        </CodeBlock>

        <VerifyBlock label="How to know the current filesystem type?">
          <p>
            <code>df -hT | head -10</code>
          </p>
          <p>
            # Filesystem Type Size Used Avail Use% Mounted on
            <br />
            # /dev/sda1 xfs 100G 40G 60G 40% /
          </p>
        </VerifyBlock>
      </Subsection>

      {/* ── 2. Disk Discovery ── */}
      <Subsection title="Disk Discovery — Did the system see it?">
        <CodeBlock lang="bash" label="lsblk — Show Disks">
{`# First thing — see connected disks
lsblk
# sda    100G
# ├─sda1   1G
# └─sda2  99G
# sdb     50G    ← New empty disk

# Or in detail:
fdisk -l`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Note:</strong> <code>sda</code> is the primary disk.{" "}
          <code>sdb</code> = a new disk appeared. If not visible, check the
          cable or RAID Controller.
        </Callout>
      </Subsection>

      {/* ── 3. Partitioning ── */}
      <Subsection title="Partitioning">
        <Prose>
          Before using the disk, you can partition it. There are two methods
          depending on disk size:
        </Prose>

        <InfoTable
          columns={[
            { header: "Method", key: "method" },
            { header: "Max Limit", key: "limit" },
            { header: "Partition Scheme", key: "scheme" },
            { header: "When to Use", key: "when" },
          ]}
          rows={[
            {
              method: "<code>fdisk</code>",
              limit: "2 TB",
              scheme: "MBR — 4 primary partitions",
              when: "Old or small disks",
            },
            {
              method: "<code>parted</code> / <code>gdisk</code>",
              limit: "9 ZB",
              scheme: "GPT — 128 partitions",
              when: "Modern disks (+2 TB)",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Partition a disk with fdisk">
{`# fdisk — Partition the disk
fdisk /dev/sdb
# n  → New Partition
# p  → Primary
# 1  → Partition number
# w  → Write & exit

# Result: /dev/sdb1`}
        </CodeBlock>

        <Callout variant="success">
          <strong>Note:</strong> In RHCSA you&apos;ll mostly find{" "}
          <code>fdisk</code> or <code>parted</code>. Modern disks (+2TB) require
          GPT with <code>parted</code> or <code>gdisk</code>.
        </Callout>
      </Subsection>

      {/* ── 4. MBR vs GPT ── */}
      <Subsection title="MBR vs GPT — Comprehensive Comparison">
        <Prose>
          Choosing the partition scheme depends on disk size and boot system
          (BIOS vs UEFI).
        </Prose>

        <InfoTable
          columns={[
            { header: "Feature", key: "feature" },
            { header: "MBR (BIOS)", key: "mbr" },
            { header: "GPT (UEFI)", key: "gpt" },
          ]}
          rows={[
            {
              feature: "Max disk capacity",
              mbr: "2 TB",
              gpt: "9 ZB (billions of TB)",
            },
            {
              feature: "Primary partitions",
              mbr: "4 max",
              gpt: "128 default",
            },
            {
              feature: "Boot Mode",
              mbr: "BIOS / Legacy",
              gpt: "UEFI (with Secure Boot)",
            },
            {
              feature: "Backups",
              mbr: "No — single partition table",
              gpt: "Yes — copy at end of disk",
            },
            {
              feature: "Windows compatibility",
              mbr: "✔️ Legacy",
              gpt: "✔️ Modern",
            },
            {
              feature: "Usage",
              mbr: "Small disks / old systems",
              gpt: "All modern disks (+2 TB)",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Create GPT partition table with parted">
{`# Convert disk to GPT
parted /dev/sdb mklabel gpt

# Create 20G partition
parted /dev/sdb mkpart primary xfs 0% 20G

# Or with gdisk
gdisk /dev/sdb
# n → New partition
# w → Write & exit`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>Remember:</strong> Changing MBR to GPT erases all data on the
          disk. Backup first.
        </Callout>
      </Subsection>

      {/* ── 5. LVM Pipeline ── */}
      <Subsection title="LVM — The Complete Pipeline">
        <Prose>
          LVM is the most popular storage method in servers. Instead of using
          the disk directly, you go through layers:
        </Prose>

        <CodeBlock lang="bash" label="LVM Pipeline: PV → VG → LV">
{`Disk / Partition
    ↓
Physical Volume (PV)    ← pvcreate /dev/sdb
    ↓
Volume Group (VG)        ← vgcreate data_vg /dev/sdb
    ↓
Logical Volume (LV)      ← lvcreate -L 20G -n app_lv data_vg
    ↓
Filesystem               ← mkfs.xfs /dev/data_vg/app_lv
    ↓
Mount Point              ← mount /dev/data_vg/app_lv /data`}
        </CodeBlock>

        <CodeBlock lang="bash" label="Full Example — LVM from Scratch">
{`# 1. Physical Volume
pvcreate /dev/sdb
pvs                           # Confirm

# 2. Volume Group
vgcreate data_vg /dev/sdb
vgs                           # Confirm

# 3. Logical Volume (20G)
lvcreate -L 20G -n app_lv data_vg
lvs                           # Confirm

# 4. Filesystem
mkfs.xfs /dev/data_vg/app_lv

# 5. Mount
mkdir /data
mount /dev/data_vg/app_lv /data
df -h                         # Confirm`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Simple Analogy:</strong> PV = money in wallets, VG = bank
          account where you collect money, LV = amounts you distribute to
          projects. That&apos;s why LVM is powerful — you can combine different
          disks into one VG and distribute space the way you like.
        </Callout>
      </Subsection>

      {/* ── 6. Create Filesystem ── */}
      <Subsection title="Create Filesystem">
        <Prose>
          After finishing with LVM or Partition, you need to create a Filesystem
          to use the space.
        </Prose>

        <CodeBlock lang="bash" label="mkfs — Create Filesystem">
{`# XFS (best for servers — RHEL default)
mkfs.xfs /dev/data_vg/app_lv

# Ext4 (compatible — can be shrunk)
mkfs.ext4 /dev/data_vg/app_lv

# Or directly on a Partition
mkfs.xfs /dev/sdb1`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>Remember:</strong> XFS only supports Grow — it cannot be
          shrunk. Ext4 supports Grow and Shrink.
        </Callout>
      </Subsection>

      {/* ── 7. Mount and /etc/fstab ── */}
      <Subsection title="Mount and /etc/fstab">
        <Prose>
          For users to use the space, you must mount it to a specific directory.
        </Prose>

        <CodeBlock lang="bash" label="Mount and fstab">
{`# Create directory for mount
mkdir /data

# Direct mount
mount /dev/data_vg/app_lv /data

# Confirm
df -h
# Filesystem               Size  Used Avail Use% Mounted on
# /dev/mapper/data_vg-app_lv  20G  1G   19G   5% /data

# ── For persistence after reboot ──

# Find the UUID
blkid /dev/data_vg/app_lv
# /dev/data_vg/app_lv: UUID="123-456" TYPE="xfs"

# Add this line to /etc/fstab
# UUID=123-456  /data  xfs  defaults  0  0

# Test before reboot
mount -a   # If no Error, it's good`}
        </CodeBlock>

        <VerifyBlock label="Final Verification">
          <p>
            <code>df -h | grep /data</code>
          </p>
          <p>
            # /dev/mapper/data_vg-app_lv 20G 1G 19G 5% /data
          </p>
        </VerifyBlock>
      </Subsection>

      {/* ── 8. Expanding Space ── */}
      <Subsection title="Expanding Space (LVM Extension)">
        <Prose>
          The real advantage of LVM — you can expand space without
          repartitioning or stopping services.
        </Prose>

        <CodeBlock lang="bash" label="lvextend — Extend LV">
{`# Extend LV +10G — the -r flag extends FS automatically
lvextend -r -L +10G /dev/data_vg/app_lv

# Or use all free space
lvextend -r -l +100%FREE /dev/data_vg/app_lv`}
        </CodeBlock>

        <Subsection title="Merge Multiple Disks into One VG">
          <Prose>
            The strongest feature of LVM — you can combine multiple disks of
            different sizes into one VG.
          </Prose>

          <CodeBlock lang="bash" label="Merging Multiple Disks">
{`# You have: sdb = 100G, sdc = 100G, sdd = 200G

# Convert them all to PV
pvcreate /dev/sdb /dev/sdc /dev/sdd

# One VG that combines them
vgcreate vg_data /dev/sdb /dev/sdc /dev/sdd

# Result: VG = 400G
vgs
# vg_data  3 PVs  400G

# After a year — if you get a new disk
pvcreate /dev/sde
vgextend vg_data /dev/sde
# VG = 500G without touching LVs or Applications`}
          </CodeBlock>

          <Callout variant="success">
            <strong>The Final Picture of LVM in Your Mind:</strong>{" "}
            <code>PV → VG → LV → FS → Mount</code>. This is the chain that if
            you understand it, 80% of LVM questions will be easy.
          </Callout>
        </Subsection>
      </Subsection>

      {/* ── 9. NTFS on Linux ── */}
      <Subsection title="NTFS on Linux">
        <Prose>
          Linux can handle NTFS but not completely native. It uses a driver
          called <code>ntfs-3g</code>.
        </Prose>

        <InfoTable
          columns={[
            { header: "Feature", key: "feature" },
            { header: "NTFS", key: "ntfs" },
            { header: "ext4 / XFS", key: "linux" },
          ]}
          rows={[
            {
              feature: "Linux native",
              ntfs: "❌",
              linux: "✔️",
            },
            {
              feature: "Windows native",
              ntfs: "✔️",
              linux: "❌",
            },
            {
              feature: "Performance on Linux",
              ntfs: "Average",
              linux: "High",
            },
            {
              feature: "Server usage",
              ntfs: "No",
              linux: "Yes",
            },
            {
              feature: "Dual boot / USB",
              ntfs: "Excellent",
              linux: "Not suitable",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Mounting NTFS Disk on Linux">
{`# Install support
dnf install ntfs-3g -y      # RHEL / CentOS
apt install ntfs-3g -y      # Ubuntu

# Mount NTFS disk
mount -t ntfs-3g /dev/sdb1 /mnt

# Or in modern distros — works automatically
mount /dev/sdb1 /mnt`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Summary:</strong> NTFS is suitable for external drives and
          Dual Boot. For servers and Production: use ext4 or XFS.
        </Callout>
      </Subsection>

      {/* ── 10. Interview Summary ── */}
      <Subsection title="Interview Summary — The Short Answer">
        <VerifyBlock label='Answer to the question: "You add new Storage to Linux, what do you do?"'>
          <p>
            I check disk visibility with lsblk, then create a Partition or add
            it to LVM (PV → VG → LV), then create a Filesystem like XFS or
            EXT4, then Mount to a suitable directory, and add it to /etc/fstab
            for automatic mounting after reboot.
          </p>
        </VerifyBlock>

        <Callout variant="success">
          <strong>The Complete Chain:</strong> Disk → PV → VG → LV → Filesystem
          → Mount Point. Keep it in your mind.
        </Callout>
      </Subsection>
    </Section>
  );
}
