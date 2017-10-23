#!/usr/bin/env bash

set -o errexit
set -o nounset

npx eslint -c ./.eslintrc.json ../server ../client

exit 0
