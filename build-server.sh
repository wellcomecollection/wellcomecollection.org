#!/usr/bin/env bash

set -o errexit

VERSION=${1:-dev}

pushd server
  npm install --production
  npm run app:build
  # TODO: knowledge of the folder structure here?
  touch .dist/management/manifest.json
  echo "{ \"version\": \"${VERSION}\" }" > .dist/management/manifest.json
popd
