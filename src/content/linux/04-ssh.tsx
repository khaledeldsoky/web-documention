import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section4() {
  return (
    <Section id="ssh" num={4} title="SSH — Remote Access">
      <Prose>
        SSH (Secure Shell) is the most widely used protocol for remote server
        management. Securing SSH settings is the first step after installing any
        Linux server.
      </Prose>

      {/* ── 1. Locking the root user ── */}
      <Subsection title="Locking the root user (Preventing direct login)">
        <Prose>
          Logging in directly with the root account via SSH is considered an
          insecure practice. It is better to log in with a regular account and
          then use <code>sudo</code> or <code>su</code>.
        </Prose>

        <CodeBlock lang="bash" label="/etc/ssh/sshd_config — Deny root">
{`# Modify this line in /etc/ssh/sshd_config
# Prevent direct root login
PermitRootLogin no

# Or use 'prohibit-password' to allow SSH keys only
PermitRootLogin prohibit-password`}
        </CodeBlock>

        <VerifyBlock label="Verify the change">
          <p>
            <code>grep "^PermitRootLogin" /etc/ssh/sshd_config</code>
          </p>
        </VerifyBlock>
      </Subsection>

      {/* ── 2. Changing the SSH Port ── */}
      <Subsection title="Changing the SSH Port">
        <Prose>
          Changing the default port (22) reduces automated scanning attacks.
          Choose a high port (1024–65535).
        </Prose>

        <CodeBlock lang="bash" label="Change the port in sshd_config">
{`# In file /etc/ssh/sshd_config
Port 2222

# You can specify multiple ports
Port 2222
Port 443`}
        </CodeBlock>

        <Callout variant="danger">
          <strong>Warning:</strong> Before reloading SSH, make sure the new port
          is open in the Firewall. Otherwise you will lock yourself out!
        </Callout>
      </Subsection>

      {/* ── 3. Using SSH Keys ── */}
      <Subsection title="Using SSH Keys">
        <Prose>
          Keys are more secure than passwords. Use <code>ssh-keygen</code> to
          create a key, then copy it to the server.
        </Prose>

        <CodeBlock lang="bash" label="Create and copy an SSH key">
{`# Create a key (on your local machine)
ssh-keygen -t ed25519 -C "user@host"

# Copy the key to the server
ssh-copy-id -p 2222 user@server-ip

# Or manually: add the content to ~/.ssh/authorized_keys
cat ~/.ssh/id_ed25519.pub
# Then paste the content into ~/.ssh/authorized_keys on the server`}
        </CodeBlock>

        <Callout variant="info">
          <strong>Note:</strong> After changes, reload the service with{" "}
          <code>systemctl reload sshd</code>. <code>reload</code> is better
          than <code>restart</code> because it doesn't disconnect current
          sessions.
        </Callout>
      </Subsection>
    </Section>
  );
}
