#!/usr/bin/env bash

set -x
set -e
set -o errexit
set -o nounset

if [ $# -lt 1 ]; then
    echo "⚡ Usage: deploy.sh <CONTAINER_TAG>"
    exit 1
fi

CONTAINER_TAG=$1

pushd terraform
  terraform init
  terraform get
  terraform apply -target=module.wellcomecollection.aws_ecs_task_definition.wellcomecollection \
                  -target=module.wellcomecollection.aws_ecs_service.wellcomecollection \
                  -var "container_tag=$CONTAINER_TAG"
popd

