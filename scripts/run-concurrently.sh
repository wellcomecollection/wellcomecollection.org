#!/usr/bin/env bash

set -o errexit
set -o nounset

echo "Starting the applications"

target=true

pushd identity/webapp
    PORT=3002 LOCAL_CONCURRENT_DEV_ENV=$target IDENTITY_HOST=http://localhost:3002 yarn start:dev &
    PROC_IDENTIFY=$!
popd

PORT=3001 LOCAL_CONCURRENT_DEV_ENV=$target IDENTITY_HOST=http://localhost:3002 yarn catalogue &
PROC_CATALOGUE=$!

PORT=3000 LOCAL_CONCURRENT_DEV_ENV=$target IDENTITY_HOST=http://localhost:3002 yarn content &
PROC_CONTENT=$!

# saves the process IDs into the variables above.
# passed them in to the array on wait, when you kill wait, you also kill the processes passed in

echo process IDs: identity=$PROC_IDENTIFY catalogue=$PROC_CATALOGUE content=$PROC_CONTENT
wait $PROC_IDENTIFY $PROC_CATALOGUE $PROC_CONTENT