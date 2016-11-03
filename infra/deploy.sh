#!/usr/bin/env bash

if [ $# -lt 2 ]; then
    echo "⚡ Usage: deploy <BUCKET> <BUILD_NUMBER>"
    exit 1
fi

BUCKET=$1
BUILD_NUMBER=$2

pushd terraform

terraform remote config \
    -backend=s3 \
    -backend-config="bucket=$BUCKET" \
    -backend-config="key=build-state/terraform.tfstate" \
    -backend-config="region=eu-west-1"

terraform get
terraform apply \
    -var "build_bucket=$BUCKET" \
    -var "build_number='$BUILD_NUMBER'" \
    -var "build_branch=master"

popd
