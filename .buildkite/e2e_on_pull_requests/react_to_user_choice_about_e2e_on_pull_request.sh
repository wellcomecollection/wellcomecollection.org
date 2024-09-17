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
