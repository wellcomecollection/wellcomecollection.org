#!/usr/bin/env bash

set -o errexit

curl https://api.speedtracker.org/v1/test/wellcometrust/speedtracker/master/article?key=$SPEEDTRACKER_KEY
curl https://api.speedtracker.org/v1/test/wellcometrust/speedtracker/master/exhibition?key=$SPEEDTRACKER_KEY
curl https://api.speedtracker.org/v1/test/wellcometrust/speedtracker/master/stories?key=$SPEEDTRACKER_KEY
curl https://api.speedtracker.org/v1/test/wellcometrust/speedtracker/master/work?key=$SPEEDTRACKER_KEY
curl https://api.speedtracker.org/v1/test/wellcometrust/speedtracker/master/works?key=$SPEEDTRACKER_KEY
