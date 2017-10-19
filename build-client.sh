#!/usr/bin/env bash

set -o errexit

pushd client
  npm run compile
popd
