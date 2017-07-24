#!/usr/bin/env bash

set -o errexit
set -o nounset

if [ $# -lt 2 ]; then
    echo "⚡ Usage: apply.sh <prod|dev> <CONTAINER_TAG>"
    exit 1
fi

DEPLOY_ENV=$1
CONTAINER_TAG=$2

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

pushd "$DIR/terraform/$DEPLOY_ENV"
  rm -f "terraform.tfvars"
  echo "Getting variables from S3"
  aws s3 cp s3://wellcomecollection-infra/terraform.tfvars .

  echo "Terraforming"
  terraform init
  terraform get
  terraform apply
  rm -f "terraform.tfvars"
popd

echo "Planned $CONTAINER_TAG"
