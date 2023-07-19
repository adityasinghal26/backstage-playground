#!/bin/bash

## The script is currently not usable. The below commands need to be corrected and finalised.

kubectl create ns backstage

helm package .
helm package deployment/kubernetes/postgres/helm/

helm upgrade --install postgres postgres-0.1.0.tgz

copy latest app-config.yaml to backstage101 folder and dockerfile to packages/backend folder

run yarn install --frozen-lockfile and yarn tsc from backstage101 folder

rum yarn build backend --config ../../app-config.yaml from packages/backend folder

docker image build . -f packages/backend/Dockerfile --tag backstage:0.1.0 from backstage101 folder
docker image build backstage-app/backstage101/ -f deployment/kubernetes/backstage/docker/Dockerfile --tag backstage:0.1.1

https://kind.sigs.k8s.io/docs/user/local-registry/
docker image tag backstage:0.1.0 localhost:5001/backstage:0.1.0
docker push localhost:5001/backstage:0.1.0

