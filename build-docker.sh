#!/usr/bin/env bash

pushd server
npm install
popd

pushd client
npm install
npm run compile
popd

docker-compose up --build
