import { S3Client } from '@aws-sdk/client-s3';

import { region } from '@weco/toggles/config';
import { setDefaultValueFor } from '@weco/toggles/setDefaultValueFor';
import { getCreds } from '@weco/ts-aws';

export const isCi = process.env.CI === 'true';

async function run() {
  const credentials = isCi
    ? undefined
    : await getCreds('experience', 'developer');

  const s3Client = new S3Client({
    region,
    credentials,
  });

  await setDefaultValueFor(s3Client);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
