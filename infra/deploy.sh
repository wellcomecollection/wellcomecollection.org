#!/usr/bin/env bash

if [ $# -lt 1 ]; then
    echo "⚡ Usage: deploy <CONTAINER_TAG>"
    exit 1
fi

CONTAINER_TAG=$1

pushd terraform
terraform get
terraform remote pull
terraform apply \
    -var "container_tag=$CONTAINER_TAG"

popd
