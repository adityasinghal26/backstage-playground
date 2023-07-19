#!/bin/bash
KIND_CLUSTER_NAME="backstage"

# Setup a Kubernetes cluster with kind
if [[ "$(kind get clusters)" = $KIND_CLUSTER_NAME ]]; then
  echo "Kind cluster $KIND_CLUSTER_NAME already exists."
else
  echo "Creating kind cluster $KIND_CLUSTER_NAME"
  kind create cluster --image kindest/node:v1.26.6 --wait 5m --name backstage --config ./scripts/kind-cluster-config.yaml
fi

# Check whether cluster context is configured or not
# if [[ "$(kubectl config get-contexts | grep kind-backstage | awk {'print $2'})" = "kind-$KIND_CLUSTER_NAME" ]]; then
#  echo "Cluster context already configured."
# else
#  mkdir -p $Home/.kube
#  sudo kind get kubeconfig -n backstage >> $HOME/.kube/config
#fi