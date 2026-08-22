import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section8() {
  return (
    <Section id="kube-vip" num={8} title="kube-vip Setup">
      <Prose>
        <strong>kube-vip</strong> is a small container that runs as a static pod on
        every control-plane node. One instance becomes leader via ARP election and
        broadcasts a gratuitous ARP for the VIP. If that master goes down, another takes
        over within seconds — no external load balancer needed.
      </Prose>

      <Callout variant="info">
        <strong>Only on MASTER 1 first.</strong> The static pod manifest must exist{" "}
        <em>before</em> kubeadm init runs. Masters 2 and 3 get it manually before they
        join.
      </Callout>

      <Subsection title="Pull kube-vip Image">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — pull kube-vip image" variant="h1">
{`VIP="<VIP>"
INTERFACE="<INTERFACE_NAME>"

KVVERSION=$(curl -sL https://api.github.com/repos/kube-vip/kube-vip/releases | jq -r ".[0].name")

alias kube-vip="ctr image pull ghcr.io/kube-vip/kube-vip:$KVVERSION; ctr run --rm --net-host ghcr.io/kube-vip/kube-vip:$KVVERSION vip /kube-vip"`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Generate Static Pod Manifest">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — generate kube-vip manifest" variant="h1">
{`mkdir -p /etc/kubernetes/manifests

nerdctl run --rm --net-host \\
  ghcr.io/kube-vip/kube-vip:\${KUBEVIP_VERSION} vip \\
  /kube-vip manifest pod \\
    --interface $INTERFACE \\
    --address $VIP \\
    --controlplane \\
    --arp \\
    --leaderElection \\
  | tee /etc/kubernetes/manifests/kube-vip.yaml

cat /etc/kubernetes/manifests/kube-vip.yaml | grep -E 'address|interface|image'`}
        </CodeBlock>

        <VerifyBlock label="Verify manifest">
          <p>
            <code>grep -E &apos;address|interface&apos;</code> shows <code><Var course="k8s-airgap-ha" name="VIP" /></code>{" "}
            and your interface name.
          </p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
