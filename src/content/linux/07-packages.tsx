import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import InfoTable from "@/components/docs/InfoTable";

export function Section7() {
  return (
    <Section id="packages" num={7} title="Package Management">
      <Prose>
        Package management is the official way to install and update software in
        Linux. Each distribution has its own package system.
      </Prose>

      {/* ── 1. DNF / YUM ── */}
      <Subsection title="DNF / YUM — RHEL/CentOS/Fedora">
        <InfoTable
          columns={[
            { header: "Command", key: "cmd" },
            { header: "Description", key: "desc" },
          ]}
          rows={[
            {
              cmd: "<code>dnf install httpd</code>",
              desc: "Install a package",
            },
            {
              cmd: "<code>dnf remove httpd</code>",
              desc: "Remove a package",
            },
            {
              cmd: "<code>dnf update</code>",
              desc: "Update all packages",
            },
            {
              cmd: "<code>dnf search httpd</code>",
              desc: "Search for a package",
            },
            {
              cmd: "<code>dnf info httpd</code>",
              desc: "Package information",
            },
            {
              cmd: "<code>dnf history</code>",
              desc: "Operation history",
            },
            {
              cmd: '<code>dnf groupinstall "Web Server"</code>',
              desc: "Install a package group",
            },
          ]}
        />

        <CodeBlock lang="bash" label="DNF Examples">
{`# Install a package
dnf install nginx -y

# Remove a package
dnf remove nginx

# Search
dnf search php

# Detailed information
dnf info python3

# List installed packages
dnf list installed | head -20

# Find which package provides a specific command
dnf provides /usr/bin/nginx

# Rollback to an older version
dnf history
dnf history undo 5`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Note:</strong> In RHEL 8+, <code>yum</code> is just an alias
          for <code>dnf</code>. They are almost the same command.
        </Callout>
      </Subsection>

      {/* ── 2. RPM ── */}
      <Subsection title="RPM — The Basic Package Manager">
        <CodeBlock lang="bash" label="RPM Commands">
{`# Install a direct RPM
rpm -ivh package.rpm

# Remove
rpm -e package

# List all packages
rpm -qa | grep nginx

# Query a file — which package owns it?
rpm -qf /etc/nginx/nginx.conf

# Package info
rpm -qi nginx

# List package files
rpm -ql nginx`}
        </CodeBlock>

        <Callout variant="warn">
          <strong>RPM vs DNF:</strong> RPM does not resolve dependencies
          automatically. Always use DNF/YUM instead of direct RPM.
        </Callout>
      </Subsection>

      {/* ── 3. Repositories ── */}
      <Subsection title="Repositories — /etc/yum.repos.d/">
        <CodeBlock lang="bash" label="Contents of a repo file">
{`# /etc/yum.repos.d/epel.repo
[epel]
name=Extra Packages for Enterprise Linux
baseurl=https://download.example/pub/epel/$releasever/$basearch/
enabled=1
gpgcheck=1
gpgkey=https://download.example/pub/epel/RPM-GPG-KEY-EPEL

# Enable and disable repo
dnf config-manager --set-enabled epel
dnf config-manager --set-disabled epel`}
        </CodeBlock>
      </Subsection>

      {/* ── 4. APT ── */}
      <Subsection title="APT — Debian/Ubuntu">
        <InfoTable
          columns={[
            { header: "DNF", key: "dnf" },
            { header: "APT", key: "apt" },
          ]}
          rows={[
            {
              dnf: "<code>dnf install nginx</code>",
              apt: "<code>apt install nginx</code>",
            },
            {
              dnf: "<code>dnf remove nginx</code>",
              apt: "<code>apt remove nginx</code>",
            },
            {
              dnf: "<code>dnf update</code>",
              apt: "<code>apt update && apt upgrade</code>",
            },
            {
              dnf: "<code>dnf search nginx</code>",
              apt: "<code>apt search nginx</code>",
            },
            {
              dnf: "<code>dnf info nginx</code>",
              apt: "<code>apt show nginx</code>",
            },
          ]}
        />

        <CodeBlock lang="bash" label="Basic APT Commands">
{`# Update package list
apt update

# Upgrade all packages
apt upgrade -y

# Install a package
apt install nginx -y

# Remove a package
apt remove nginx

# Remove unused packages
apt autoremove`}
        </CodeBlock>
      </Subsection>

      {/* ── 5. EPEL ── */}
      <Subsection title="EPEL — Additional Packages">
        <Prose>
          EPEL = Extra Packages for Enterprise Linux. It contains packages not
          available in the official RHEL repos.
        </Prose>

        <CodeBlock lang="bash" label="Install EPEL">
{`# Install EPEL
dnf install epel-release -y

# After that you can install packages like
dnf install htop ncdu jq -y`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
