import Section, { Subsection } from "@/components/docs/Section";
import Prose from "@/components/docs/Prose";
import CodeBlock from "@/components/docs/CodeBlock";
import Callout from "@/components/docs/Callout";
import VerifyBlock from "@/components/docs/VerifyBlock";

export function Section3() {
  return (
    <Section id="wsl-prep" num={3} title="WSL Setup">
      <Prose>Install the command-line tools you need on WSL — govc for vSphere, the OpenShift installer, and oc CLI.</Prose>
      <Callout variant="info">
        Running on native Linux? Skip the WSL setup and adapt package manager commands (<code>apt</code>/<code>dnf</code>). On macOS? Use <code>brew install govc</code> and adjust <code>sed</code> flags.
      </Callout>
      <Prose>All commands in this section run on <strong>WSL</strong> unless noted otherwise.</Prose>

      <Subsection title="Install govc">
        <CodeBlock lang="bash" label="WSL">
{`# Download and extract govc binary
curl -sL https://github.com/vmware/govmomi/releases/latest/download/govc_$(uname -s)_$(uname -m).tar.gz | tar -C /usr/local/bin -xz govc

# Make it executable and verify version
chmod +x /usr/local/bin/govc
govc version`}
        </CodeBlock>
      </Subsection>

      <Subsection title="Download OpenShift Installer & CLI">
        <CodeBlock lang="bash" label="WSL">
{`# Set working directory and create folder structure
export OCP4_DIR=<OCP4_DIR>
mkdir -p $OCP4_DIR
cd $OCP4_DIR
mkdir -p $OCP4_DIR/{config,rhcos,ignition,scripts}

# Download OpenShift client and installer tarballs
wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/4.14.0/openshift-client-linux.tar.gz
wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/4.14.0/openshift-install-linux.tar.gz

# Extract into /usr/local/bin
sudo tar xzf openshift-client-linux.tar.gz -C /usr/local/bin/
sudo tar xzf openshift-install-linux.tar.gz -C /usr/local/bin/
sudo chmod +x /usr/local/bin/{oc,kubectl,openshift-install}

# Verify versions
openshift-install version
oc version`}
        </CodeBlock>

        <VerifyBlock>
          <p><code>openshift-install version</code> shows <code>4.14.x</code></p>
          <p><code>oc version</code> shows client version.</p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Generate SSH Key">
        <CodeBlock lang="bash" label="WSL">
{`# Generate an SSH key pair (no passphrase)
ssh-keygen -t ed25519 -f ~/.ssh/openshift -N "" -C "khaled@ocp4"

# Display the public key for use in install-config.yaml
cat ~/.ssh/openshift.pub`}
        </CodeBlock>

        <VerifyBlock>
          <p>Files exist: <code>~/.ssh/openshift</code> and <code>~/.ssh/openshift.pub</code></p>
        </VerifyBlock>
      </Subsection>

      <Subsection title="Create setup-env.sh">
        <Prose>Copy the template from <code>src/content/scripts/setup-env.sh</code> and edit with your values.</Prose>
        <CodeBlock lang="bash" label="WSL — $OCP4_DIR/setup-env.sh">
{`#!/usr/bin/env bash
export GOVC_URL="<VCENTER_IP>"
export GOVC_USERNAME="<VCENTER_USER>"
export GOVC_PASSWORD="<VCENTER_PASSWORD>"
export GOVC_DATACENTER="<DATACENTER>"
export GOVC_CLUSTER="<CLUSTER>"
export GOVC_DATASTORE="<DATASTORE>"
export GOVC_NETWORK="<NETWORK>"
export GOVC_INSECURE="true"
export GOVC_FOLDER="<VM_FOLDER>"
export OCP4_DIR="<OCP4_DIR>"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/openshift`}
        </CodeBlock>

        <Callout variant="info">
          Always run <code>source $OCP4_DIR/setup-env.sh</code> at the start of each session.
        </Callout>
      </Subsection>
    </Section>
  );
}
