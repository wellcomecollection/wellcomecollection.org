#!/usr/bin/env bash

set -o errexit
set -o nounset

ENV_TAG="env.$BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT" .buildkite/scripts/update_ecr_image_tag.sh \
  uk.ac.wellcome/content_webapp \
  uk.ac.wellcome/identity_webapp

CLUSTER="experience-frontend-$BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT" .buildkite/scripts/deploy_ecs_services.sh \
  "content-17092020-$BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT" \
  "identity-18012021-$BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT"
