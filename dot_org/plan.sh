#!/usr/bin/env bash

set -o errexit
set -o nounset

if [ $# -lt 1 ]; then
    echo "⚡ Usage: plan.sh <CONTAINER_TAG>"
    exit 1
fi

CONTAINER_TAG=$1

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

pushd "$DIR/terraform"
  rm -f "terraform.tfvars"
  rm -f "terraform.plan"

  echo "Getting variables from S3"
  aws s3 cp s3://wellcomecollection-infra/terraform.tfvars .

  echo "Creating plan ... Terraforming"

  terraform init
  terraform get
  terraform plan -var "container_tag=$CONTAINER_TAG" -out terraform.plan
  rm -f "terraform.tfvars"
popd

echo "Planned $CONTAINER_TAG"
