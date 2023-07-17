#!/bin/bash

# Setup a Kubernetes cluster with kind
kind create cluster --image kindest/node:v1.26.6 --wait 5m --name backstage