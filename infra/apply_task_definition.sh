#!/usr/bin/env bash

set -o errexit
set -o nounset

if [ $# -lt 1 ]; then
    echo "⚡ Usage: apply_task_definition.sh <CONTAINER_TAG>"
    exit 1
fi

CONTAINER_TAG=$1

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

pushd "$DIR/terraform/prod"
  rm -f "terraform.tfvars"
  echo "Getting variables from S3"
  aws s3 cp s3://wellcomecollection-infra/terraform.tfvars .

  echo "Terraforming"
  terraform init
  terraform get
  terraform apply -target=module.wellcomecollection.aws_ecs_task_definition.wellcomecollection \
                  -target=module.wellcomecollection.aws_ecs_service.wellcomecollection \
                  -var "container_tag=$CONTAINER_TAG"

  rm -f "terraform.tfvars"
popd

echo "Deployed $CONTAINER_TAG"
