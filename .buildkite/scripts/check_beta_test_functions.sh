#!/usr/bin/env bash
<<DOC
Check the beta test functions are live and assigning visitors on stage.

    check_beta_test_functions.sh https://www-stage.wellcomecollection.org

Waits until responses carry the version that deploy_beta_test_functions.sh
published for both functions, since a newly published function takes a few
minutes to reach every edge location. It then checks that a visitor who has
accepted analytics cookies is assigned to the canary test in the stage
KeyValueStore, and that a visitor who hasn't is not.

The functions catch their own errors and serve pages unchanged, so the
end-to-end tests still pass when a function is broken, and this check fails.
DOC

set -o errexit
set -o nounset
set -o pipefail

BASE_URL="$1"
CONSENTED='CookieControl=%7B%22optionalCookies%22%3A%7B%22analytics%22%3A%22accepted%22%7D%7D'
TIMEOUT_SECONDS=900

# Until cache/ has been applied there are no functions to check
if [[ "$(buildkite-agent meta-data get beta-test-functions-exist --default false)" != "true" ]]; then
  echo "The beta test functions don't exist yet, skipping"
  exit 0
fi
VERSION="$(buildkite-agent meta-data get beta-test-functions-version)"

# The functions run on cached responses too, so any page will do. The headers
# are captured whole before matching, so grep can't cut curl off part-way.
headers() {
  curl --silent --show-error --output /dev/null --dump-header - \
    "$@" "$BASE_URL/works"
}

# Each edge picks up the two functions separately, so both versions have to
# be on the same response
both_live() {
  grep -qi "^x-wc-beta-tests-version: $VERSION" <<< "$1" &&
    grep -qi "^x-wc-beta-tests-request-version: $VERSION" <<< "$1"
}

started="$(date +%s)"
until both_live "$(headers)"; do
  if (( $(date +%s) - started > TIMEOUT_SECONDS )); then
    echo "Responses from $BASE_URL never showed beta test functions at $VERSION"
    exit 1
  fi
  echo "Waiting for $VERSION to reach $BASE_URL"
  sleep 20
done
echo "Beta test functions at $VERSION are live on $BASE_URL"

consented_headers="$(headers --cookie "$CONSENTED")"
if ! both_live "$consented_headers"; then
  echo "The consenting visitor's response didn't come from both functions at $VERSION"
  exit 1
fi
if ! grep -qiE '^set-cookie: wc_ab=([^;]*\|)?betaTestsCanary:' <<< "$consented_headers"; then
  echo "A consenting visitor wasn't assigned to the canary test"
  exit 1
fi

if grep -qi '^set-cookie: wc_ab' <<< "$(headers)"; then
  echo "A visitor without consent was given a beta test cookie"
  exit 1
fi

echo "Beta test assignment is working on $BASE_URL"
