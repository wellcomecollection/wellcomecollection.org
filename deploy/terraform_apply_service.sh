#!/usr/bin/env bash

set -o errexit
set -o nounset

if [ $# -lt 2 ]; then
    echo "⚡ Usage: apply_task_definition.sh <SERVICE_NAME> <CONTAINER_TAG>"
    exit 1
fi

SERVICE_NAME=$1
CONTAINER_TAG=$2


DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

pushd "$DIR/../$SERVICE_NAME/terraform"
  echo "Terraforming"
  terraform apply -var "container_tag=$CONTAINER_TAG"
popd

echo "Deployed $CONTAINER_TAG"
