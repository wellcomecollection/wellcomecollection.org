#!/usr/bin/env ts-node-script

import { deploy } from './deploy';
import { getS3Client } from './aws';

async function run() {
  const s3Client = await getS3Client();
  await deploy(s3Client);
}

run();
