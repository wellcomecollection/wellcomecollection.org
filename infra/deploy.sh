#!/usr/bin/env bash

set -x
set -e
set -o errexit
set -o nounset

if [ $# -lt 2 ]; then
    echo "⚡ Usage: deploy.sh <prod|dev> <CONTAINER_TAG>"
    exit 1
fi

DEPLOY_ENV=$1
CONTAINER_TAG=$2

pushd terraform/$DEPLOY_ENV
  terraform init
  terraform get
  terraform apply -target=module.wellcomecollection.aws_ecs_task_definition.wellcomecollection \
                  -target=module.wellcomecollection.aws_ecs_service.wellcomecollection \
                  -var "container_tag=$CONTAINER_TAG"
popd

