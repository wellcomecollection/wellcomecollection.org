#!/usr/bin/env bash
pushd server
  npm run fractal:build
popd

pushd cardigan
  aws s3 sync . s3://cardigan.wellcomecollection.org
popd
