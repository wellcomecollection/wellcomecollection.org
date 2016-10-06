#!/usr/bin/env bash

if [ $# -lt 1 ]; then
    echo "⚡ Usage: deploy <STATE_BUCKET>"
    exit 1
fi

STATE_BUCKET=$1

pushd terraform

terraform remote config \
    -backend=s3 \
    -backend-config="bucket=$STATE_BUCKET" \
    -backend-config="key=build-state/terraform.tfstate" \
    -backend-config="region=eu-west-1"

terraform get
terraform apply
# potentially terraform apply \
#   --target=wellcomecollection.aws_autoscaling_group.wellcomecollection_asg
#   --target=wellcomecollection.aws_launch_configuration.wellcomecollection

popd
