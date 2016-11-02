#!/usr/bin/env bash

pushd server
npm install --loglevel info
popd

pushd client
npm install --loglevel info
npm run compile
popd
