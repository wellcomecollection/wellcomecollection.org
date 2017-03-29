#!/usr/bin/env bash

set -e
pushd $1
  npm test
popd
