#!/usr/bin/env bash

if [ $# -lt 1 ]; then
    echo "⚡ Usage: deploy.sh <CONTAINER_TAG>"
    exit 1
fi

CONTAINER_TAG=$1

pushd terraform
    terraform get
    terraform remote pull

    REMOTE_PULL_CODE=$?

    if [ $REMOTE_PULL_CODE == 1 ]; then
        echo "ERROR: Please run ./setup.sh <BUILD_BUCKET> first before trying to deploy."
        echo "⚡ Top tip: You can get this from your .tfvars file."
        exit 1
    fi

    # Legacy graph is on here due to:
    # https://github.com/hashicorp/terraform/issues/8146
    terraform apply -target=module.wellcomecollection.aws_ecs_task_definition.wellcomecollection \
                    -target=module.wellcomecollection.aws_ecs_service.wellcomecollection \
                    -Xlegacy-graph \
                    -var "container_tag=$CONTAINER_TAG"

popd
