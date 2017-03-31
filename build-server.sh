#!/usr/bin/env bash

set -o errexit

pushd server
  npm install --production
  npm run app:build
popd
