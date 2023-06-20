#!/usr/bin/env bash

set -o errexit
set -o nounset

for app in content catalogue identity
do
  ENV_TAG="$app-env.e2e" \
    LATEST_TAG="wc-dot-org-build-plus-test-$app-build-${BUILDKITE_BUILD_NUMBER}" \
      .buildkite/scripts/update_ecr_image_tag.sh \
      uk.ac.wellcome/buildkite
done

CLUSTER="experience-frontend-e2e" .buildkite/scripts/deploy_ecs_services.sh \
  "content-17092020-e2e" \
  "catalogue-17092020-e2e" \
  "identity-18012021-e2e"
