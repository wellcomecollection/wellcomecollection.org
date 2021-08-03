#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT_URL=

if [[ "${BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT}" == "prod" ]]; then
   ENVIRONMENT_URL="https://wellcomecollection.org"
elif [[ "${BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT}" == "stage"]]; then
   ENVIRONMENT_URL="https://www-stage.wellcomecollection.org"
fi

buildkite-agent meta-data set "github_deployment_status:environment_url" $ENVIRONMENT_URL

# https://buildkite.com/docs/pipelines/block-step#passing-block-step-data-to-other-steps-passing-meta-data-to-trigger-steps
TRIGGER_STEP="steps:
  - trigger: \"experience-e2e-universal\"
    label: \"e2e test\"
    build:
      message: \"${BUILDKITE_MESSAGE}\"
      commit: \"${BUILDKITE_COMMIT}\"
      branch: \"${BUILDKITE_BRANCH}\"
      env:
        BUILDKITE_PULL_REQUEST: \"${BUILDKITE_PULL_REQUEST}\"
        BUILDKITE_PULL_REQUEST_BASE_BRANCH: \"${BUILDKITE_PULL_REQUEST_BASE_BRANCH}\"
        BUILDKITE_PULL_REQUEST_REPO: \"${BUILDKITE_PULL_REQUEST_REPO}\"
        BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT: \"${BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT}\"
        PLAYWRIGHT_BASE_URL: \"${ENVIRONMENT_URL}\"
"

echo $TRIGGER_STEP | buildkite-agent pipeline upload
