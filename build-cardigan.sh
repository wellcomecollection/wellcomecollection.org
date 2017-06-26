#!/usr/bin/env bash

set -o errexit

pushd server
  npm run fractal:build
popd

pushd cardigan-dist
  aws s3 sync . s3://cardigan.wellcomecollection.org
popd
