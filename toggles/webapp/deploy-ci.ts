#!/usr/bin/env ts-node-script

import { S3Client } from '@aws-sdk/client-s3';
import { region } from './config';
import { deploy } from './deploy';

async function run() {
  const s3Client = new S3Client({ region });
  await deploy(s3Client);
}

run();
