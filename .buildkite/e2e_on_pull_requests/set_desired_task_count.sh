#!/usr/bin/env bash
# This script sets the desired task count of services in the e2e cluster.
#
# We only need the environment to be running when we're running tests
# against it; at all other times we can leave it scaled down.

set -o errexit
set -o nounset

DESIRED_COUNT="$1"

for service in content-17092020-e2e catalogue-17092020-e2e identity-18012021-e2e
do
  aws ecs update-service \
    --cluster experience-frontend-e2e \
    --service "$service"
    --desired-count "$DESIRED_COUNT"
done
