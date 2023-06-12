#!/usr/bin/env bash

set -o errexit
set -o nounset

ENV_TAG=content-env.e2e \
  LATEST_TAG="wc-dot-org-build-plus-test-content-build-${BUILDKITE_BUILD_NUMBER}" \
    .buildkite/scripts/update_ecr_image_tag.sh \
    uk.ac.wellcome/buildkite

ENV_TAG=catalogue-env.e2e \
  LATEST_TAG="wc-dot-org-build-plus-test-catalogue-build-${BUILDKITE_BUILD_NUMBER}" \
    .buildkite/scripts/update_ecr_image_tag.sh \
    uk.ac.wellcome/buildkite

ENV_TAG=identity-env.e2e \
  LATEST_TAG="wc-dot-org-build-plus-test-identity-build-${BUILDKITE_BUILD_NUMBER}" \
    .buildkite/scripts/update_ecr_image_tag.sh \
    uk.ac.wellcome/buildkite

CLUSTER="experience-frontend-e2e" .buildkite/scripts/deploy_ecs_services.sh \
  "content-17092020-e2e" \
  "catalogue-17092020-e2e" \
  "identity-18012021-e2e"
