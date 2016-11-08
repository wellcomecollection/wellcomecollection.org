#!/usr/bin/env bash

pushd server
npm install --production
popd

pushd client
npm install --production
npm run compile
popd
