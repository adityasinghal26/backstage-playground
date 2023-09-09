#!/bin/bash

# Create mysql namespace in local cluster
# Added as helm argument, hence not required here
# kubectl create ns mysql

# Package mysql helm chart and install the same in mysql namespace
helm package deployment/kubernetes/mysql/helm/
helm -n mysql upgrade --install mysql mysql-0.1.0.tgz --create-namespace