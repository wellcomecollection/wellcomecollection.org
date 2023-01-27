#!/usr/bin/env bash

set -o errexit
set -o nounset

ROOT=$(git rev-parse --show-toplevel)

docker run --rm \
  --volume "$ROOT:$ROOT" \
  --workdir "$ROOT" \
  --publish 3000:3000 \
    public.ecr.aws/docker/library/node:14-slim \
      ./run_all_e2e.sh
