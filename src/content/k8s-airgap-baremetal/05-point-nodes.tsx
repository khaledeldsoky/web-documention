import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section5() {
  return (
    <Section id="point-nodes" num={5} title="Point Nodes at master1">
      <Prose>
        Run on master2, master3, worker1, worker2, worker3 (master1 already
        configured in <a href="#master1-infra">Section 4</a>).
      </Prose>

      <Subsection title="DNS">
        <CodeBlock lang="bash" label="ALL nodes except master1">
{`# Point DNS at master1
nmcli con mod ens192 ipv4.dns "<MASTER_0_IP>"
nmcli con mod ens192 ipv4.dns-search "<DOMAIN>"
nmcli con up ens192

# Verify
cat /etc/resolv.conf     # should show nameserver <MASTER_0_IP>`}
        </CodeBlock>
      </Subsection>

      <Subsection title="NTP — point chrony at master1">
        <CodeBlock lang="bash" label="ALL nodes except master1">
{`# Install chrony from local repo
dnf install -y chrony

# Remove public NTP servers, point at master1
sed -i '/^pool\\|^server/d' /etc/chrony.conf
echo "server <MASTER_0_IP> iburst" >> /etc/chrony.conf
systemctl enable --now chronyd

# Verify
chronyc sources          # confirm syncing to <MASTER_0_IP>`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Local Yum Repo">
        <CodeBlock lang="bash" label="ALL nodes except master1">
{`# Copy repo file from master1
scp root@<MASTER_0_IP>:/root/airgap-bundle/local-airgap.repo /etc/yum.repos.d/

# Verify
dnf clean all && dnf makecache`}
        </CodeBlock>
      </Subsection>

      <Subsection title="/etc/hosts — belt-and-suspenders">
        <CodeBlock lang="bash" label="ALL nodes">
{`cat >> /etc/hosts <<'EOF'
<MASTER_0_IP>   master1 master1.<DOMAIN>
<MASTER_1_IP>   master2 master2.<DOMAIN>
<MASTER_2_IP>   master3 master3.<DOMAIN>
<WORKER_0_IP>  worker1 worker1.<DOMAIN>
<WORKER_1_IP>  worker2 worker2.<DOMAIN>
<WORKER_2_IP>  worker3 worker3.<DOMAIN>
<VIP>           k8s-api.<DOMAIN>
EOF`}
        </CodeBlock>

        <VerifyBlock label="Verify DNS resolution">
          <p>
            <code>ping master1</code> resolves to <code>&lt;MASTER_0_IP&gt;</code>.
          </p>
          <p>
            <code>ping k8s-api.&lt;DOMAIN&gt;</code> resolves to{" "}
            <code>&lt;VIP&gt;</code>.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
