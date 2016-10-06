#!/usr/bin/env bash

BUILD_NUMBER=$1

pushd server
npm install
popd

pushd client
npm install
npm run compile
popd

mkdir -p build
tar -cvf ./build/$BUILD_NUMBER.tar dist server
