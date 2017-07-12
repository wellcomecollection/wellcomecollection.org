#!/usr/bin/env bash

set -o errexit
set -o nounset

if [ $# -lt 2 ]; then
    echo "⚡ Usage: deploy.sh <prod|dev> <CONTAINER_TAG>"
    exit 1
fi

DEPLOY_ENV=$1
CONTAINER_TAG=$2

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

pushd "$DIR/terraform/$DEPLOY_ENV"
  terraform init
  terraform get
  terraform apply -target=module.wellcomecollection.aws_ecs_task_definition.wellcomecollection \
                  -target=module.wellcomecollection.aws_ecs_service.wellcomecollection \
                  -target=module.wellcomecollection.aws_ecs_task_definition.thumbor \
                  -target=module.wellcomecollection.aws_ecs_service.thumbor \
                  -var "container_tag=$CONTAINER_TAG"
popd

