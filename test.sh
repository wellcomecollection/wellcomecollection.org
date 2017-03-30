#!/usr/bin/env bash

set -o errexit
pushd $1
  npm test
popd
