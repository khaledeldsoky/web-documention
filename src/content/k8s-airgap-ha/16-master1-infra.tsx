import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";
import NodeTag from "@/components/docs/NodeTag";
import Var from "@/components/docs/Var";

export function Section16() {
  return (
    <Section id="master1-infra" num={16} title="master1 Infra Node">
      <Prose>
        Set up master1 as the infrastructure node: the container registry (Sonatype
        Nexus 3, running in-cluster and scheduled on master1), a local yum repo, DNS
        (dnsmasq), and NTP (chrony). All other nodes will point at master1 for these
        services, and Nexus also serves future air-gapped workloads.
      </Prose>

      <Subsection title="15.1 Deploy Nexus Registry">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <Prose>
          Nexus runs as a pod on master1 with its data on a local PV backed by{" "}
          <code>/data/nexus-data</code> (Retain policy — images survive restarts). The
          three Docker repositories are exposed through NGINX Ingress hostnames under{" "}
          <code>apps.</code>
          <Var course="k8s-airgap-ha" name="DOMAIN" />.
        </Prose>
        <CodeBlock lang="bash" label="master1 — prepare data dir" variant="h1">
{`mkdir -p /data/nexus-data
chown -R 200:200 /data/nexus-data`}
        </CodeBlock>

        <CodeBlock lang="bash" label="master1 — create nexus.yaml and apply it" variant="h1">
{`cat > /root/nexus.yaml <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: nexus
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nexus-pv
spec:
  capacity:
    storage: 50Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: local-storage
  local:
    path: /data/nexus-data
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: kubernetes.io/hostname
              operator: In
              values:
                - <NEXUS_VM>
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nexus-pvc
  namespace: nexus
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-storage
  resources:
    requests:
      storage: 50Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nexus3
  namespace: nexus
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nexus3
  template:
    metadata:
      labels:
        app: nexus3
    spec:
      nodeSelector:
        kubernetes.io/hostname: <NEXUS_VM>
      tolerations:
        - key: "node-role.kubernetes.io/control-plane"
          operator: "Exists"
          effect: "NoSchedule"
        - key: "node-role.kubernetes.io/master"
          operator: "Exists"
          effect: "NoSchedule"
      containers:
        - name: nexus3
          image: sonatype/nexus3:<NEXUS_VERSION>
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8081
              name: nexus-ui
            - containerPort: 8082
              name: docker-hosted
            - containerPort: 8083
              name: ghcr-hosted
            - containerPort: 8084
              name: k8s-hosted
          resources:
            limits:
              memory: "6Gi"
              cpu: "2"
            requests:
              memory: "2Gi"
              cpu: "1"
          volumeMounts:
            - name: nexus-storage
              mountPath: /nexus-data
      volumes:
        - name: nexus-storage
          persistentVolumeClaim:
            claimName: nexus-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: nexus-service
  namespace: nexus
spec:
  type: ClusterIP
  selector:
    app: nexus3
  ports:
    - name: nexus-web
      port: 8081
      targetPort: 8081
    - name: docker-hosted
      port: 8082
      targetPort: 8082
    - name: ghcr-hosted
      port: 8083
      targetPort: 8083
    - name: k8s-hosted
      port: 8084
      targetPort: 8084
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nexus-ingress
  namespace: nexus
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "0"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "600"
spec:
  ingressClassName: nginx
  rules:
    # 1. Nexus UI
    - host: nexus.apps.<DOMAIN>
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nexus-service
                port:
                  number: 8081

    # 2. Docker Hub repo (docker.io + quay.io images)
    - host: docker.apps.<DOMAIN>
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nexus-service
                port:
                  number: 8082

    # 3. GHCR repo
    - host: ghcr.apps.<DOMAIN>
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nexus-service
                port:
                  number: 8083

    # 4. Kubernetes registry repo
    - host: k8s.apps.<DOMAIN>
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nexus-service
                port:
                  number: 8084
EOF

# Substitute <NEXUS_VERSION> from the reference file
sed -i "s|<NEXUS_VERSION>|$(grep '^NEXUS_VERSION=' /tmp/image-versions.txt | cut -d= -f2)|" /root/nexus.yaml

kubectl apply -f /root/nexus.yaml`}
        </CodeBlock>

        <Callout variant="warn">
          First start takes <strong>3–5 minutes</strong> — Nexus initializes its blob
          store and embedded DB. The image was already pulled in Section 17, so no
          internet is needed. Wait for HTTP 200 before continuing.
        </Callout>

        <CodeBlock lang="bash" label="master1 — wait for Nexus readiness" variant="h1">
{`kubectl -n nexus get pods -w
# Ctrl-C once the pod is Running

until curl -sf http://nexus.apps.<DOMAIN>/service/rest/v1/status >/dev/null; do
  sleep 10
done
echo "Nexus is ready"`}
        </CodeBlock>

        <VerifyBlock label="Verify Nexus deployment">
          <p>
            <code>kubectl -n nexus get pods</code> shows the pod Running.<br />
            <code>kubectl get pv nexus-pv</code> shows <code>Bound</code>.<br />
            <code>curl -I http://nexus.apps.<Var course="k8s-airgap-ha" name="DOMAIN" /></code>{" "}
            returns an HTTP response from the Nexus UI.
          </p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="15.2 Create Repositories &amp; Enable Anonymous Pulls">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <Prose>
          Grab the initial admin password from inside the pod, activate the{" "}
          <strong>Docker Bearer Token Realm</strong> (without it, anonymous{" "}
          <code>/v2/</code> pulls are rejected), then create one hosted repository per
          connector port. Anonymous access is enabled by default on a fresh install.
        </Prose>
        <CodeBlock lang="bash" label="master1 — configure Nexus via REST API" variant="h1">
{`PASS=\$(kubectl -n nexus exec deploy/nexus3 -- cat /nexus-data/admin.password)
echo "\$PASS"   # save this somewhere safe

# Activate the Docker Bearer Token Realm (required for anonymous pulls)
curl -sf -X PUT -u admin:"\$PASS" -H 'Content-Type: application/json' \\
  -d '["NexusAuthenticatingRealm", "DockerToken"]' \\
  http://nexus.apps.<DOMAIN>/service/rest/v1/security/realms/active

# Create one hosted repo per upstream group: name:port
create_repo() {
  curl -sf -X POST -u admin:"\$PASS" -H 'Content-Type: application/json' \\
    -d @- http://nexus.apps.<DOMAIN>/service/rest/v1/repositories/docker/hosted <<EOF
{
  "name": "\$1",
  "online": true,
  "storage": {"writePolicy": "allow", "blobStoreName": "default", "strictContentTypeValidation": true},
  "docker": {"httpPort": \$2, "v1Enabled": false}
}
EOF
}

create_repo docker-hosted 8082   # docker.io + quay.io images
create_repo ghcr-hosted 8083     # ghcr.io images
create_repo k8s-hosted 8084      # registry.k8s.io images`}
        </CodeBlock>

        <Callout variant="info">
          Mapping used throughout this guide: <code>registry.k8s.io/*</code> →{" "}
          <code>k8s.apps.<Var course="k8s-airgap-ha" name="DOMAIN" /></code>,{" "}
          <code>ghcr.io/*</code> →{" "}
          <code>ghcr.apps.<Var course="k8s-airgap-ha" name="DOMAIN" /></code>,{" "}
          <code>docker.io/*</code> and <code>quay.io/*</code> →{" "}
          <code>docker.apps.<Var course="k8s-airgap-ha" name="DOMAIN" /></code>.
        </Callout>

        <VerifyBlock label="Verify repositories exist">
          <p>
            Each catalog endpoint returns JSON (empty lists are expected until the push
            step):<br />
            <code>curl -s http://k8s.apps.<Var course="k8s-airgap-ha" name="DOMAIN" />/v2/_catalog</code><br />
            <code>curl -s http://ghcr.apps.<Var course="k8s-airgap-ha" name="DOMAIN" />/v2/_catalog</code><br />
            <code>curl -s http://docker.apps.<Var course="k8s-airgap-ha" name="DOMAIN" />/v2/_catalog</code>
          </p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="15.3 Re-tag and Push All Images to Nexus">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <Prose>
          Map every cached image to its Nexus repository by upstream prefix, keeping the
          original path after the registry host. Containerd mirrors preserve that path,
          so pulls keep working unchanged after internet removal.
        </Prose>
        <CodeBlock lang="bash" label="master1 — re-tag and push all images" variant="h1">
{`nerdctl images --format '{{.Repository}}:{{.Tag}}' | while read img; do
  [ "\$img" = "<none>:<none>" ] && continue
  case "\$img" in
    registry.k8s.io/*)     newhost="k8s.apps.<DOMAIN>" ;;
    ghcr.io/*)             newhost="ghcr.apps.<DOMAIN>" ;;
    docker.io/*|quay.io/*) newhost="docker.apps.<DOMAIN>" ;;
    *) continue ;;
  esac
  newimg="\$newhost/\${img#*/}"
  echo "Tagging \$img -> \$newimg"
  nerdctl tag "\$img" "\$newimg"
  nerdctl push --insecure-registry "\$newimg"
done

# Verify each repository received its images
curl -s http://k8s.apps.<DOMAIN>/v2/_catalog
curl -s http://ghcr.apps.<DOMAIN>/v2/_catalog
curl -s http://docker.apps.<DOMAIN>/v2/_catalog`}
        </CodeBlock>

        <VerifyBlock label="Verify all images pushed">
          <p>
            The catalogs list the cluster images: kube-apiserver, pause, etcd, coredns
            under <code>k8s.apps.</code>; kube-vip under <code>ghcr.apps.</code>;
            flannel, metallb, ingress-nginx and nexus3 under{" "}
            <code>docker.apps.<Var course="k8s-airgap-ha" name="DOMAIN" /></code>.
          </p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="15.4 Cold Backup of Images (Optional)">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <Prose>
          Nexus lives inside the cluster it serves. Its PV survives restarts, but if you
          ever wipe every node&apos;s containerd cache while air-gapped, export the
          images once as tarballs so they can be re-loaded without internet.
        </Prose>
        <CodeBlock lang="bash" label="master1 — export all cluster images to /srv/image-backup" variant="h1">
{`mkdir -p /srv/image-backup

nerdctl images --format '{{.Repository}}:{{.Tag}}' | grep -E \\
  'kube-|pause|etcd|coredns|flannel|metallb|ingress|kube-vip|nexus3' |
while read img; do
  fname=\$(echo "\$img" | tr '/:' '__')
  nerdctl save -o "/srv/image-backup/\$fname.tar" "\$img"
done

ls -lh /srv/image-backup/
# Restore later with: nerdctl load -i /srv/image-backup/<file>.tar`}
        </CodeBlock>
      </Subsection>

      <Subsection title="15.5 Local Yum Repo">
        <NodeTag label="MASTER 1 ONLY" variant="h1" />
        <CodeBlock lang="bash" label="master1 — set up local yum repo via httpd" variant="h1">
{`mkdir -p /srv/repo

# Copy cached RPMs
find /var/cache/dnf -name '*.rpm' -exec cp {} /srv/repo/ \\;

createrepo_c /srv/repo

systemctl enable --now httpd
ln -s /srv/repo /var/www/html/repo

# Verify
curl http://<MASTER_0_IP>/repo/repodata/repomd.xml`}
        </CodeBlock>
      </Subsection>
    </Section>
  );
}
