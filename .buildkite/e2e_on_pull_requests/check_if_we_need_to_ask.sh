#!/usr/bin/env bash
# This script checks if we need to ask the user about running e2es.
#
# It uses the GitHub API to look for an "e2es not required" label.
#
# If it finds one, then the user has already opted to skip e2es -- so
# we don't need to ask again.
#
# If it doesn't find one, it adds two new steps to Buildkite:
# one to ask the user whether to run end-to-end tests on their PR,
# and one to react to their choice.

set -o errexit
set -o nounset

GITHUB_API_TOKEN=$(aws secretsmanager get-secret-value \
  --secret-id builds/github_wecobot/e2e_pull_request_labels \
  | jq -r .SecretString)

HAS_SKIP_E2E_LABEL=$(
  curl -L \
    -H 'Accept: application/vnd.github+json' \
    -H "Authorization: Bearer $GITHUB_API_TOKEN" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "https://api.github.com/repos/wellcomecollection/wellcomecollection.org/issues/$BUILDKITE_PULL_REQUEST/labels" \
    | jq '. | map(select(.name == "e2es not required")) | length'
)

if ((HAS_SKIP_E2E_LABEL == 1))
then
  exit 0
fi

buildkite-agent pipeline upload <<EOF
- wait

- input: "Do you want to run end-to-end tests on this pull request?"
  key: "ask-user-if-should-run-e2es"
  fields:
    - select: "Run e2es?"
      key: "should-run-e2es"
      options:
        - label: "Yes, run e2e tests now"
          value: "yes"
        - label: "Not now, maybe later"
          value: "maybe-later"
        - label: "No, not needed for this PR"
          value: "no"

- label: "Add steps for e2e tests (if necessary)"
  command: ".buildkite/e2e_on_pull_requests/react_to_user_choice_about_e2e_on_pull_request.sh"
  depends_on: "ask-user-if-should-run-e2es"

  agents:
    queue: nano
EOF
