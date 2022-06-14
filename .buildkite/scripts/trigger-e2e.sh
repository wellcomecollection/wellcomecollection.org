#!/usr/bin/env bash
set -eo pipefail

ENVIRONMENT_URL=

if [[ "${BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT}" == "prod" ]]; then
   ENVIRONMENT_URL="https://wellcomecollection.org"
elif [[ "${BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT}" == "stage" ]]; then
   ENVIRONMENT_URL="https://www-stage.wellcomecollection.org"
fi

buildkite-agent meta-data set "github_deployment_status:environment_url" $ENVIRONMENT_URL

# https://buildkite.com/docs/pipelines/block-step#passing-block-step-data-to-other-steps-passing-meta-data-to-trigger-steps
TRIGGER_STEP="steps:
  - trigger: \"experience-e2e\"
    label: \"e2e test\"
    build:
      message: \"Deployment to ${BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT}\"
      commit: ${BUILDKITE_COMMIT}
      env:
        DEPLOYMENT_ENVIRONMENT: ${BUILDKITE_GITHUB_DEPLOYMENT_ENVIRONMENT}
        PLAYWRIGHT_BASE_URL: ${ENVIRONMENT_URL}
"

echo "$TRIGGER_STEP" | buildkite-agent pipeline upload
