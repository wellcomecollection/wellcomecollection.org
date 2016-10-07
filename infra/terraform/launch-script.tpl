#!/bin/bash
cd /home/ubuntu
aws s3 cp s3://${build_bucket}/builds/${build_branch}/${build_number}.tar ./app.tar
mkdir -p app
tar -xvf app.tar -C app
cd app/server

npm run start
