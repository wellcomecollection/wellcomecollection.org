#!/usr/bin/env bash

set -o errexit

pushd client
  yarn install
  yarn run compile
popd
