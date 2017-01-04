#!/usr/bin/env bash

if [ $# -lt 1 ]; then
    echo "⚡ Usage: setup.sh <BUILD_BUCKET>"
    exit 1
fi

# TODO: grab this from tfvars?
BUILD_BUCKET=$1

pushd terraform
    terraform remote config \
        -backend=s3 \
        -backend-config="bucket=$BUILD_BUCKET" \
        -backend-config="key=build-state/terraform.tfstate" \
        -backend-config="region=eu-west-1"
popd