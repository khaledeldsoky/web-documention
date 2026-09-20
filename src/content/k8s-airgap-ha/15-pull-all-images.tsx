import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";

export function Section15() {
  return (
    <Section id="pull-all-images" num={15} title="Pull All Images for Mirror">
      <Prose>
        Pull every image the cluster uses so they are cached in containerd on master1.
        These get re-tagged and pushed to the local Nexus registry next — the other
        nodes never touch the internet and will pull everything below from Nexus when
        they join in Sections 18–19.
      </Prose>

      <Subsection title="Pull Core kubeadm Images">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — pull core kubeadm images" variant="h1">
{`kubeadm config images pull --kubernetes-version <K8S_VERSION>`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Pull Add-on Images">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — pull add-on images" variant="h1">
{`nerdctl pull ghcr.io/kube-vip/kube-vip:<KUBEVIP_VERSION>
nerdctl pull docker.io/flannel/flannel:<FLANNEL_VERSION>
nerdctl pull docker.io/flannel/flannel-cni-plugin:<FLANNEL_CNI_PLUGIN_VERSION>
nerdctl pull quay.io/metallb/controller:<METALLB_VERSION>
nerdctl pull quay.io/metallb/speaker:<METALLB_VERSION>
nerdctl pull registry.k8s.io/ingress-nginx/controller:<INGRESS_NGINX_VERSION>
nerdctl pull registry.k8s.io/ingress-nginx/kube-webhook-certgen:<INGRESS_WEBHOOK_CERTGEN_VERSION>
nerdctl pull docker.io/sonatype/nexus3:<NEXUS_VERSION>`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Verify All Images">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — verify all images are pulled" variant="h1">
{`nerdctl images | grep -E 'kube-|pause|etcd|coredns|flannel|metallb|ingress|kube-vip'`}
        </CodeBlock>

        <VerifyBlock label="Verify all images present">
          <p>All expected images appear in <code>nerdctl images</code> output.</p>
        </VerifyBlock>
      </Subsection>
    </Section>
  );
}
