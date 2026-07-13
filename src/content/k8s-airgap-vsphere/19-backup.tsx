import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";

export function Section19() {
  return (
    <Section id="backup" num={19} title="Backup & Recovery">
      <Prose>
        Backup and recovery procedures are unchanged from the connected-network
        guide. etcd snapshotting, PKI backup, and restore procedures don&apos;t
        depend on internet access.
      </Prose>

      <Subsection title="etcd Snapshot Backup">
        <CodeBlock lang="bash" label="master1">
{`# Take an etcd snapshot
ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot-$(date +%Y%m%d).db \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# Verify the snapshot
ETCDCTL_API=3 etcdctl snapshot status /backup/etcd-snapshot-$(date +%Y%m%d).db --write-out=table`}
        </CodeBlock>
      </Subsection>

      <Subsection title="PKI Backup">
        <CodeBlock lang="bash" label="master1">
{`# Backup all Kubernetes PKI certificates
tar czf /backup/pki-backup-$(date +%Y%m%d).tar.gz /etc/kubernetes/pni/`}
        </CodeBlock>
      </Subsection>

      <Callout variant="warn">
        Make sure your backup destination (NFS share, external disk, etc.) is
        reachable on the air-gapped subnet, or physically transferred off-site.
      </Callout>
    </Section>
  );
}
