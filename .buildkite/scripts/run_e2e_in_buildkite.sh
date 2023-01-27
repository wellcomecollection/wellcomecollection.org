#!/usr/bin/env bash

set -o errexit
set -o nounset

ROOT=$(git rev-parse --show-toplevel)

CREDENTIALS=$(
  aws secretsmanager get-secret-value \
    --secret-id=identity/stage/local_dev_client/credentials |
  jq -r .SecretString
)

docker run --rm --detach \
  --volume "$ROOT:$ROOT" \
  --workdir "$ROOT" \
  --env CREDENTIALS \
  --publish 3000:3000 \
    public.ecr.aws/docker/library/node:14-slim \
      ./run_all_e2e.sh

# Wait ~12 minutes for the containers to start, otherwise stop
for i in {1..150}
do
  curl http://localhost:3000 >/dev/null 2>&1 && rc=$? || rc=$?
  if (( rc == 0 ))
  then
    echo "Docker container has started!"
    break
  else
    echo "Waiting another 15 seconds for Docker container..."
    sleep 15
  fi
done

docker run --tty \
  --env CI=true \
  --env PLAYWRIGHT_BASE_URL=http://localhost:3000 \
  --network host \
  130871440101.dkr.ecr.eu-west-1.amazonaws.com/weco/playwright yarn test
