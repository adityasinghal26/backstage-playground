# Passing build tag as the first argument
BUILD_TAG=$1
IMAGE_REG="localhost:5001"
IMAGE_REP="jhipster"

# Build docker image with the latest build backend artefacts
cd $CODESPACE_VSCODE_FOLDER
docker image build jhipster-online/ -f jhipster-online/Dockerfile --tag $IMAGE_REG/$IMAGE_REP:$BUILD_TAG

# Push the latest docker image to local image registry
docker push $IMAGE_REG/$IMAGE_REP:$BUILD_TAG

# Create jhipster namespace in local cluster
# Added as part of helm arguments, hence not required
# kubectl create ns jhipster

# Package jhipster helm chart and install the same in jhipster namespace
helm package deployment/kubernetes/jhipster/helm/ --version $BUILD_TAG
helm -n jhipster upgrade --install jhipster jhipster-$BUILD_TAG.tgz --set image.tag=$BUILD_TAG --create-namespace --wait

# Setup a port-forward from jhipster:80 to localhost:8000
# kubectl -n jhipster port-forward svc/jhipster 8000:80
