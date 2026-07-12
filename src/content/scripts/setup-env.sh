#!/usr/bin/env bash
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
ssh-add ~/.ssh/openshift
