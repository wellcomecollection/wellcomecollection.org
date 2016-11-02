#!/usr/bin/env bash

pushd server
npm install --loglevel win
popd

pushd client
npm install --loglevel win
npm run compile
popd
