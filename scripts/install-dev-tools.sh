#!/bin/bash

# Run Crossplane setup script
./scripts/setup-backstage.sh

# Create local image registry
./scripts/docker/registry/createRegistry.sh