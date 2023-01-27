#!/usr/bin/env bash

set -o errexit
set -o nounset

ROOT=$(git rev-parse --show-toplevel)

CREDENTIALS=$(aws secretsmanager get-secret-value --secret-id=identity/stage/local_dev_client/credentials)

docker run --rm \
  --volume "$ROOT:$ROOT" \
  --workdir "$ROOT" \
  --env CREDENTIALS \
  --publish 3000:3000 \
    public.ecr.aws/docker/library/node:14-slim \
      ./run_all_e2e.sh
