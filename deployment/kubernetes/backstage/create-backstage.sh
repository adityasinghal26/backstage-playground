#!/bin/bash

## The script is currently not usable. The below commands need to be corrected and finalised.

# Create backstage namespace in local cluster
kubectl create ns backstage

# Package postgres helm chart and install the same in backstage namespace
helm package deployment/kubernetes/postgres/helm/
helm -n backstage upgrade --install postgres postgres-0.1.0.tgz

# Copy latest app-config.yaml to backstage101 folder and dockerfile to packages/backend folder
# This step was already completed.

# Install backend app dependencies using yarn
cd $CODESPACE_VSCODE_FOLDER/backstage-app/backstage101
yarn install --frozen-lockfile
yarn tsc

# Build backstage backend app with the latest app-config.yaml file
cd $CODESPACE_VSCODE_FOLDER/backstage-app/backstage101/packages/backend
yarn build backend --config ../../app-config.yaml

# Build docker image with the latest build backend artefacts
cd $CODESPACE_VSCODE_FOLDER
# docker image build . -f packages/backend/Dockerfile --tag backstage:0.1.0 from backstage101 folder
docker image build backstage-app/backstage101/ -f deployment/kubernetes/backstage/docker/Dockerfile --tag localhost:5001/backstage:0.1.0

# Push the latest docker image to local image registry
docker push localhost:5001/backstage:0.1.0

# Package backstage helm chart and install the same in backstage namespace
helm package deployment/kubernetes/backstage/helm/
helm -n backstage upgrade --install backstage backstage-0.1.0.tgz

# Setup a port-forward from backstage:80 to localhost:8000
kubectl -n backstage port-forward svc/backstage 8000:80

