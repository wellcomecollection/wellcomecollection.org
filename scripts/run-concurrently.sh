#!/bin/bash

echo cleaning up the directories

find . -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \;
find . -name '.next' -type d -prune -print -exec rm -rf '{}' \;

echo done cleaning up directories

echo installing each app

echo installing catalogue
cd ./catalogue/webapp
pwd
yarn
echo catalogue installed

echo installing content
cd ../../content/webapp
pwd
yarn
echo content installed

echo installing identity
cd ../../identity/webapp
pwd
yarn
echo identity installed

cd ../../
pwd

echo done installing apps

echo running 'aws-azure-login --no-prompt'
echo if this fails, you will not be able to run the identity app, please communicate with team members
aws-azure-login --no-prompt

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