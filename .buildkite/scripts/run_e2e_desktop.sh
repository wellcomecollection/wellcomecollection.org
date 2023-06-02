#!/usr/bin/env bash

set -o errexit
# set -o nounset
set -o verbose

docker-compose run \
  --env CI=true \
  --env PLAYWRIGHT_BASE_URL=https://wellcomecollection.org \
  --env USE_STAGE_APIS="$USE_STAGE_APIS" \
  --env BUILDKITE_PARALLEL_JOB="$(( BUILDKITE_PARALLEL_JOB + 1 ))" \
  --env BUILDKITE_PARALLEL_JOB_COUNT="$BUILDKITE_PARALLEL_JOB_COUNT" \
  e2e yarn test
