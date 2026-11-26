#!/usr/bin/env bash
<<EOF
Check the beta test functions are live and assigning visitors on stage.

    check_beta_test_functions.sh https://www-stage.wellcomecollection.org

Waits until responses carry the version that deploy_beta_test_functions.sh
published, since a newly published function takes a few minutes to reach
every edge location. It then checks that a visitor who has accepted analytics
cookies is assigned to the canary test in the stage KeyValueStore, and that a
visitor who hasn't is not.

The functions catch their own errors and serve the page unchanged, so a broken
function passes the end-to-end tests. This check is what notices.
EOF

set -o errexit
set -o nounset
set -o pipefail

BASE_URL="$1"
VERSION="$(git rev-parse --short=12 HEAD:cache/cloudfront_functions)"
CONSENTED='CookieControl=%7B%22optionalCookies%22%3A%7B%22analytics%22%3A%22accepted%22%7D%7D'
TIMEOUT_SECONDS=900

# The functions run on cached responses too, so any page will do
headers() {
  curl --silent --show-error --output /dev/null --dump-header - \
    "$@" "$BASE_URL/works"
}

started="$(date +%s)"
until headers | grep -qi "^x-wc-beta-tests-version: $VERSION"; do
  if (( $(date +%s) - started > TIMEOUT_SECONDS )); then
    echo "Responses from $BASE_URL never showed beta test functions at $VERSION"
    exit 1
  fi
  echo "Waiting for $VERSION to reach $BASE_URL"
  sleep 20
done
echo "Beta test functions at $VERSION are live on $BASE_URL"

if ! headers --cookie "$CONSENTED" | grep -qi '^set-cookie: wc_ab=betaTestsCanary:1:'; then
  echo "A consenting visitor wasn't assigned to the canary test"
  exit 1
fi

if headers | grep -qi '^set-cookie: wc_ab'; then
  echo "A visitor without consent was given a beta test cookie"
  exit 1
fi

echo "Beta test assignment is working on $BASE_URL"
