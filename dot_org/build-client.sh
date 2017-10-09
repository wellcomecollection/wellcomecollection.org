#!/usr/bin/env bash

set -o errexit

pushd client
  npm install
  npm run compile
popd
