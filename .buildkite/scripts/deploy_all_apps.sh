#!/usr/bin/env bash

set -o errexit
set -o nounset

# Retag from the deployment sha, not latest, so the environment runs exactly
# the commit GitHub was told about even if newer images have been pushed since.
ENV_TAG="env.$BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT" LATEST_TAG="ref.$BUILDKITE_COMMIT" .buildkite/scripts/update_ecr_image_tag.sh \
  uk.ac.wellcome/content_webapp \
  uk.ac.wellcome/identity_webapp

CLUSTER="experience-frontend-$BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT" .buildkite/scripts/deploy_ecs_services.sh \
  "content-17092020-$BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT" \
  "identity-18012021-$BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT"
