#!/usr/bin/env bash

set -o errexit

curl https://api.speedtracker.org/v1/test/wellcometrust/speedtracker/main/article?key=$SPEEDTRACKER_KEY
curl https://api.speedtracker.org/v1/test/wellcometrust/speedtracker/main/exhibition?key=$SPEEDTRACKER_KEY
curl https://api.speedtracker.org/v1/test/wellcometrust/speedtracker/main/stories?key=$SPEEDTRACKER_KEY
curl https://api.speedtracker.org/v1/test/wellcometrust/speedtracker/main/work?key=$SPEEDTRACKER_KEY
curl https://api.speedtracker.org/v1/test/wellcometrust/speedtracker/main/works?key=$SPEEDTRACKER_KEY
