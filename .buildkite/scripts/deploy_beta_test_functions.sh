#!/usr/bin/env bash
<<EOF
Deploys the beta test CloudFront Functions to stage or prod:

    deploy_beta_test_functions.sh stage|prod

Terraform creates the functions; this script updates their code. It takes
the JavaScript built on main from S3, tests it against the events in
cache/edge_lambdas/cloudfront_functions/test-events, and publishes it if
every event passes. A function already at this version is left alone.
EOF

set -o errexit
set -o nounset
set -o pipefail

ENVIRONMENT="$1"
ROOT="$(git rev-parse --show-toplevel)"
FUNCTIONS_DIR="$ROOT/cache/edge_lambdas/cloudfront_functions"
VERSION="$(git rev-parse --short=12 HEAD:cache/edge_lambdas/cloudfront_functions)"

# Host-only on stage, so stage never overwrites a visitor's prod cookies
case "$ENVIRONMENT" in
  stage) COOKIE_DOMAIN="" ;;
  prod) COOKIE_DOMAIN=".wellcomecollection.org" ;;
  *)
    echo "No beta test functions for $ENVIRONMENT, skipping"
    exit 0
    ;;
esac

# Compute utilisation is a percentage of the time a function is allowed
MAX_COMPUTE=70

WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

deploy_function() {
  local kind="$1"
  local name="beta-tests-$kind-$ENVIRONMENT"
  local code="$WORK_DIR/$name.js"

  # Terraform creates the function, so until it has been applied there is
  # nothing to deploy to. Any other error fails the deploy.
  local describe_error
  if ! describe_error="$(aws cloudfront describe-function --name "$name" --stage LIVE 2>&1 >/dev/null)"; then
    if [[ "$describe_error" == *NoSuchFunctionExists* ]]; then
      echo "$name doesn't exist yet (apply cache/ first), skipping"
      return
    fi
    echo "$describe_error"
    exit 1
  fi
  FUNCTIONS_EXIST=true

  aws cloudfront get-function --name "$name" --stage LIVE "$WORK_DIR/live.js" >/dev/null
  if grep -q "VERSION = '$VERSION';" "$WORK_DIR/live.js"; then
    echo "$name is already at $VERSION"
    return
  fi

  # Built on main by cache/edge_lambdas/deploy-functions.js
  aws s3 cp --quiet "s3://weco-lambdas/cloudfront_functions/$VERSION/beta-tests-$kind.js" "$WORK_DIR/built.js"
  sed \
    -e "s/__VERSION__/$VERSION/g" \
    -e "s/__COOKIE_DOMAIN__/$COOKIE_DOMAIN/g" \
    "$WORK_DIR/built.js" > "$code"

  # Keep the function's config, including its KeyValueStore, as Terraform set it
  aws cloudfront describe-function --name "$name" --stage DEVELOPMENT \
    --query 'FunctionSummary.FunctionConfig' --output json > "$WORK_DIR/config.json"
  local etag
  etag="$(aws cloudfront describe-function --name "$name" --stage DEVELOPMENT --query ETag --output text)"

  echo "Uploading $name at $VERSION"
  etag="$(upload "$name" "$etag" "$code")"

  local event result error compute
  for event in "$FUNCTIONS_DIR"/test-events/"$kind"-*.json; do
    result="$(aws cloudfront test-function \
      --name "$name" \
      --if-match "$etag" \
      --stage DEVELOPMENT \
      --event-object "fileb://$event" \
      --query 'TestResult.[FunctionErrorMessage, ComputeUtilization]' --output text)"
    IFS=$'\t' read -r error compute <<< "$result"
    if [[ -n "$error" && "$error" != "None" ]]; then
      fail "$name" "$etag" "failed on $(basename "$event"): $error"
    fi
    # Running out of compute is the one failure the function can't catch
    if [[ ! "$compute" =~ ^[0-9]+$ ]] || (( compute > MAX_COMPUTE )); then
      fail "$name" "$etag" "used $compute% compute on $(basename "$event"), over $MAX_COMPUTE%"
    fi
    echo "$name passed $(basename "$event") using $compute% compute"
  done

  aws cloudfront publish-function --name "$name" --if-match "$etag" >/dev/null
  echo "Published $name at $VERSION"
}

upload() {
  aws cloudfront update-function \
    --name "$1" \
    --if-match "$2" \
    --function-config "file://$WORK_DIR/config.json" \
    --function-code "fileb://$3" \
    --query ETag --output text
}

# Puts the LIVE code back in DEVELOPMENT, so nothing that failed here can be
# published later by another route
fail() {
  local name="$1" etag="$2" reason="$3"
  echo "$name $reason"
  upload "$name" "$etag" "$WORK_DIR/live.js" >/dev/null
  echo "Restored the LIVE code to $name's DEVELOPMENT stage"
  exit 1
}

FUNCTIONS_EXIST=false
deploy_function request
deploy_function response

# The stage check skips when there was nothing to deploy to
if command -v buildkite-agent >/dev/null; then
  buildkite-agent meta-data set "beta-test-functions-exist" "$FUNCTIONS_EXIST"
fi
