#!/usr/bin/env bash

set -o errexit

pushd client
  npm install --production
  npm run compile
popd
