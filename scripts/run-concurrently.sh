#!/bin/bash

echo Starting the applications

target=true

PORT=3002 LOCAL_CONCURRENT_DEV_ENV=$target IDENTITY_HOST=http://localhost:3002 yarn identity &
P1=$!
PORT=3001 LOCAL_CONCURRENT_DEV_ENV=$target IDENTITY_HOST=http://localhost:3002 yarn catalogue &
P2=$!
PORT=3000 LOCAL_CONCURRENT_DEV_ENV=$target IDENTITY_HOST=http://localhost:3002 yarn content &
P3=$!

# saves the process IDs into the variables above.
# passed them in to the array on wait, when you kill wait, you also kill the processes passed in

echo process IDs: $P1 $P2 $P3
wait $P1 $P2 $P3