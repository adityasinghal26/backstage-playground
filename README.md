# backstage-playground
Playground for Backstage

## Getting Ready for Backstage
To begin with, we have setup the devcontainer with below technologies to get started. In addition to that, the postStartCommand has been configured to create a Kind cluster and setup a local image registry. You can either use Visual Studio Code to get everything running in almost no-time (actually, a few minutes), else you can spend better part of your day installing all the listed technologies.

- NodeJS, for running Backstage app
- Docker, for well - dockerizing
- Kind, for creating local kubernetes cluster
- Helm, for creating charts and easy to update YAMLs
- Kustomize, for customizing YAMLs (just-in-case)
- Minikube, if kind doesn't help

## Create Backstage app

Since, the backstage is built on top of React, we can easily create-app using the npx command with backstage plugin. We have use below command to setup backstage101 folder and create all the required files.

```
npx @backstage/create-app@latest
```

## Running the Backstage

You can use yarn commands to install all the dependencies and run the dev version of the application. If like me, you prefer to run things on containers, refer next section.

This section will take you only this far. Hope you had fun running Backstage react app in your local. 

```
yarn install

yarn dev
```

## Few changes before the show

We have committed a few changes in app-config.yaml and Dockerfile to make sure we are all set for the Backstage. You can find them in this commit [link](https://github.com/adityasinghal26/backstage-playground/commit/43b0a20d9166ef30cef596c99c832aa6feabeb1a). We have changed the node version, database to postgres, added few examples and a Github token.

P.S. Don't ever commit your github token like it's done here. Thankfully, I deleted mine after that.

## Let's Roll: Build and Deploy Backstage

Lucky for you, we have went to great extent just to put everything in script (using bash) and make it ready to build and run. We will need to setup postgres database which will store our backstage information.

The below command will deploy a postgres database in postgres namespace. This will create a deployment, service, persistent volume (and claim), and secret with postgres credentials.

```
./deployment/kubernetes/postgres/deploy-postgres.sh
```

Once, done installing postgres, next step is to build the backstage app. Running the below script with install all the dependencies and build the application backend for deployment.

```
./deployment/kubernetes/backstage/build-backstage.sh
```

After building the application, let's deploy it into our local Kubernetes cluster in 'backstage' namespace. The argument to this script is the app version which is used for tagging docker image, versioning the helm chart and updating backstage helm chart with latest docker image tag.

```
./deployment/kubernetes/backstage/deploy-backstage.sh 0.1.0
```

At the end of this, we are going to expose the application on our local 8000 port from container port 80, using below command.

```
kubectl -n backstage port-forward svc/backstage 8000:80
```

If you were able to completed all the above steps, I am pretty sure it should work for you. If it didn't, hit me up on Github or Linkedin.