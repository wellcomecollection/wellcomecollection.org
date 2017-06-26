#!/usr/bin/env bash

set -o errexit

pushd cardigan
  npm run app:build

  pushd .dist
    aws s3 sync . s3://cardigan.wellcomecollection.org
  popd
popd
