#!/usr/bin/env bash

set -o errexit
# set -o nounset
set -o verbose
set -o xtrace

docker-compose run \
  -e CI=true \
  -e PLAYWRIGHT_BASE_URL=https://wellcomecollection.org \
  -e USE_STAGE_APIS="$USE_STAGE_APIS" \
  -e BUILDKITE_PARALLEL_JOB="$(( BUILDKITE_PARALLEL_JOB + 1 ))" \
  -e BUILDKITE_PARALLEL_JOB_COUNT="$BUILDKITE_PARALLEL_JOB_COUNT" \
  e2e yarn test
