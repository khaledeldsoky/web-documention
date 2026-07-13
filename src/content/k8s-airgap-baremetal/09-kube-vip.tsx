import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section9() {
  return (
    <Section id="kube-vip" num={9} title="kube-vip Setup">
      <Prose>
        kube-vip provides a floating VIP for the Kubernetes API server. Run
        this on <strong>master1</strong> first, then copy the manifest to other
        masters.
      </Prose>

      <Subsection title="Pull kube-vip from Local Registry">
        <CodeBlock lang="bash" label="master1">
{`# Pull kube-vip from the LOCAL registry
ctr image pull --plain-http <MASTER_0_IP>:<REGISTRY_PORT>/kube-vip/kube-vip:<KUBE_VIP_VERSION>

# Generate the static pod manifest
mkdir -p /etc/kubernetes/manifests

ctr run --rm --net-host \\
  <MASTER_0_IP>:<REGISTRY_PORT>/kube-vip/kube-vip:<KUBE_VIP_VERSION> vip \\
  /kube-vip manifest pod \\
    --interface ens192 \\
    --address <VIP> \\
    --controlplane \\
    --arp \\
    --leaderElection \\
  | tee /etc/kubernetes/manifests/kube-vip.yaml

# Rewrite the image reference to point at local registry
sed -i 's|ghcr.io/kube-vip/kube-vip:.*|<MASTER_0_IP>:<REGISTRY_PORT>/kube-vip/kube-vip:<KUBE_VIP_VERSION>|' \\
  /etc/kubernetes/manifests/kube-vip.yaml`}
        </CodeBlock>

        <VerifyBlock label="Verify manifest">
          <p>
            <code>grep -E 'address|interface|image' /etc/kubernetes/manifests/kube-vip.yaml</code>{" "}
            shows <code>&lt;VIP&gt;</code>, <code>ens192</code>, and the local
            registry image path.
          </p>
        </VerifyBlock>
      </Subsection>

      <Callout variant="info">
        The static pod manifest references <code>ghcr.io</code> by default —
        the <code>sed</code> command above rewrites it to pull from your local
        registry instead.
      </Callout>
    </Section>
  );
}
