#!/usr/bin/env bash
# Because we want to run yarn twice (once in the root, once in 'cardigan'),
# we run them both in this bash script as a single layer in the Docker image.
#
# This is meant to make building the Cardigan image faster -- we only have to
# fetch the npm cache once, vs running it in multiple layers and having to
# re-fetch each time.
#
# Conceptually these are equivalent to separate RUN steps in the Dockerfile,
# but this makes CI go faster.
#
# TODO: Do we even need the setupCommon step, or can we bin the first step
# and collapse this back into the Dockerfile?

set -o errexit
set -o nounset

yarn setupCommon

cd cardigan
yarn install
yarn build

yarn cache clean
