#!/usr/bin/env bash

set -o errexit
set -o nounset

yarn
echo "done with yarn"
yarn run-concurrently
