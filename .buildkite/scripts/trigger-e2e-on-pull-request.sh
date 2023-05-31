#!/usr/bin/env bash

set -o errexit
set -o nounset

ENVIRONMENT_URL="https://www-e2e.wellcomecollection.org"

# https://buildkite.com/docs/pipelines/block-step#passing-block-step-data-to-other-steps-passing-meta-data-to-trigger-steps
TRIGGER_STEP="steps:
  - trigger: \"experience-e2e\"
    label: \"e2e test\"
    build:
      message: \"e2e tests on pull request ${BUILDKITE_PULL_REQUEST}\"
      commit: ${BUILDKITE_COMMIT}
      env:
        DEPLOYMENT_ENVIRONMENT: e2e
        PLAYWRIGHT_BASE_URL: ${ENVIRONMENT_URL}
"

echo "$TRIGGER_STEP" | buildkite-agent pipeline upload
