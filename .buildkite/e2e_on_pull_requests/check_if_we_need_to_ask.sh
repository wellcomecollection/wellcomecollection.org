#!/usr/bin/env bash

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

if (( HAS_SKIP_E2E_LABEL == 0 ))
then
  exit 0
fi

buildkite-agent pipeline upload << EOF
- wait

- input: "Do you want to run end-to-end tests on this pull request?"
  key: "ask-user-if-should-run-e2es"
  fields:
    - select: "Run e2es?"
      key: "should-run-e2es"
      required: false
      options:
        - label: "Yes, run e2e tests now"
          value: "yes"
        - label: "Not now, maybe later"
          value: "maybe-later"
        - label: "No, not needed for this PR"
          value: "no"

- label: "end-to-end tests"
  command: ".buildkite/scripts/react_to_user_choice_about_e2e_on_pull_request.sh"
  depends_on: "ask-user-if-should-run-e2es"

  agents:
    queue: nano
EOF
