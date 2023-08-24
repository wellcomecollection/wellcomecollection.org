#!/bin/bash

clean_flag=''

function print_help {
  echo this is the run concurrently script
  echo besides using the 'h' command as you have done, you can also use -c as a command to clean up the local directory and reinstall all dependencies before running the apps concurrently
}

while getopts 'ch' flag; do
  case "${flag}" in
  c) clean_flag="true" ;;
  h)
    print_help
    exit 1
    ;;
  esac
done

if [[ "$clean_flag" = "true" ]]; then
  echo cleaning up the directories
  find . -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \;
  find . -name '.next' -type d -prune -print -exec rm -rf '{}' \;
  find . -name '.server-data' -type d -prune -print -exec rm -rf '{}' \;
  echo done cleaning up directories
  echo installing the apps
  yarn
  pwd
  echo done installing apps
fi

echo running 'aws-azure-login --mode=gui'
echo if this fails, you will not be able to run the identity app, please communicate with team members
aws-azure-login --mode=gui

echo Starting the applications

target=true

PORT=3002 LOCAL_CONCURRENT_DEV_ENV=$target IDENTITY_HOST=http://localhost:3002 yarn identity &
P1=$!
PORT=3000 LOCAL_CONCURRENT_DEV_ENV=$target IDENTITY_HOST=http://localhost:3002 yarn content &
P2=$!

# saves the process IDs into the variables above.
# passed them in to the array on wait, when you kill wait, you also kill the processes passed in

echo process IDs: $P1 $P2
wait $P1 $P2
