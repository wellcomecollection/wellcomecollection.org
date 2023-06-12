#!/usr/bin/env bash

set -o errexit
set -o nounset

if [[ "$(buildkite-agent meta-data get should-run-e2es)" == "yes" ]]
then
  buildkite-agent pipeline upload .buildkite/e2e_on_pull_requests/pipeline.e2e-pull-requests.yml
fi

if [[ "$(buildkite-agent meta-data get should-run-e2es)" == "no" ]]
then
  GITHUB_API_TOKEN=$(aws secretsmanager get-secret-value \
    --secret-id builds/github_wecobot/e2e_pull_request_labels \
    | jq -r .SecretString)

  curl -L -X POST \
    -H 'Accept: application/vnd.github+json' \
    -H "Authorization: Bearer $GITHUB_API_TOKEN" \
    -H 'X-GitHub-Api-Version: 2022-11-28' \
    "https://api.github.com/repos/wellcomecollection/wellcomecollection.org/issues/$BUILDKITE_PULL_REQUEST" \
    -d '{"labels": ["e2es not required"]}'
fi
