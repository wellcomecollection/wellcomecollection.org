#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o verbose

aws s3 sync humans.txt s3://i.wellcomecollection.org/humans.txt --dryrun
aws s3 sync robots.txt s3://i.wellcomecollection.org/robots.txt --dryrun

aws s3 sync fonts s3://i.wellcomecollection.org/assets/fonts --dryrun
aws s3 sync icons s3://i.wellcomecollection.org/assets/icons --dryrun
aws s3 sync images s3://i.wellcomecollection.org/assets/images --dryrun
