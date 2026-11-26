#!/usr/bin/env bash
<<EOF
Deploy the beta test CloudFront Functions (RFC 094) to one environment.

    deploy_beta_test_functions.sh stage|prod

Terraform creates the functions and attaches them (cache/beta_tests.tf); this
script owns their code. For each function it uploads the code to the
DEVELOPMENT stage, runs it against the sample events in
cache/cloudfront_functions/test-events, and publishes it to LIVE only if every
event runs without an error. CloudFront will publish code that fails at
runtime, so the test step is what stops a broken function reaching visitors.

The code carries a version, the git hash of cache/cloudfront_functions, which
the viewer-response function returns in x-wc-beta-tests-version. A function
whose LIVE code already has this version is left alone, so deploys that don't
change the functions don't republish them.
EOF

set -o errexit
set -o nounset
set -o pipefail

ENVIRONMENT="$1"
ROOT="$(git rev-parse --show-toplevel)"
FUNCTIONS_DIR="$ROOT/cache/cloudfront_functions"
VERSION="$(git rev-parse --short=12 HEAD:cache/cloudfront_functions)"

case "$ENVIRONMENT" in
  stage) COOKIE_DOMAIN="" ;;
  prod) COOKIE_DOMAIN=".wellcomecollection.org" ;;
  *)
    echo "No beta test functions for $ENVIRONMENT, skipping"
    exit 0
    ;;
esac

WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

deploy_function() {
  local kind="$1"
  local name="beta-tests-$kind-$ENVIRONMENT"
  local code="$WORK_DIR/$name.js"

  sed \
    -e "s/__VERSION__/$VERSION/g" \
    -e "s/__COOKIE_DOMAIN__/$COOKIE_DOMAIN/g" \
    "$FUNCTIONS_DIR/beta-tests-$kind.js" > "$code"

  # Terraform creates the function, so until it has been applied there is
  # nothing to deploy to
  if ! aws cloudfront describe-function --name "$name" --stage LIVE >/dev/null 2>&1; then
    echo "$name doesn't exist yet (apply cache/ first), skipping"
    return
  fi

  aws cloudfront get-function --name "$name" --stage LIVE "$WORK_DIR/live.js" >/dev/null
  if grep -q "var VERSION = '$VERSION';" "$WORK_DIR/live.js"; then
    echo "$name is already at $VERSION"
    return
  fi

  # Keep the function's config, including its KeyValueStore, as Terraform set it
  aws cloudfront describe-function --name "$name" --stage DEVELOPMENT \
    --query 'FunctionSummary.FunctionConfig' --output json > "$WORK_DIR/config.json"
  local etag
  etag="$(aws cloudfront describe-function --name "$name" --stage DEVELOPMENT --query ETag --output text)"

  echo "Uploading $name at $VERSION"
  etag="$(aws cloudfront update-function \
    --name "$name" \
    --if-match "$etag" \
    --function-config "file://$WORK_DIR/config.json" \
    --function-code "fileb://$code" \
    --query ETag --output text)"

  local event error
  for event in "$FUNCTIONS_DIR"/test-events/"$kind"-*.json; do
    error="$(aws cloudfront test-function \
      --name "$name" \
      --if-match "$etag" \
      --stage DEVELOPMENT \
      --event-object "fileb://$event" \
      --query 'TestResult.FunctionErrorMessage' --output text)"
    if [[ -n "$error" && "$error" != "None" ]]; then
      echo "$name failed on $(basename "$event"): $error"
      exit 1
    fi
    echo "$name passed $(basename "$event")"
  done

  aws cloudfront publish-function --name "$name" --if-match "$etag" >/dev/null
  echo "Published $name at $VERSION"
}

deploy_function request
deploy_function response
