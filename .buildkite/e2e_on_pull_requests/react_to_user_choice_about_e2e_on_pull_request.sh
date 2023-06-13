#!/usr/bin/env bash
# This script runs after the user has picked whether they want
# to run e2e tests in the Buildkite UI.
#
# If they select "yes", it adds new steps to Buildkite to run the e2es.
#
# If they select "no, never", it uses the GitHub API to add the "skip e2es"
# label to the pull request.
#
# If they select "not now, maybe later", it just exits without doing
# anything else.

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
