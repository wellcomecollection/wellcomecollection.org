#!/usr/bin/env bash
pushd server
  npm install --production
  npm run app:build
popd
