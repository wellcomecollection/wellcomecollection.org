import { PutObjectCommand } from '@aws-sdk/client-s3';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fetch from 'node-fetch';
import { TogglesResp } from '.';
import { bucket, key, region } from './config';
import { getCredentials, getS3Client } from './aws';
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';

const argv = yargs(hideBin(process.argv)).parseSync();

async function getRemoteToggles(): Promise<TogglesResp> {
  const response = await fetch(
    'https://toggles.wellcomecollection.org/toggles.json'
  );
  const data = await response.json();
  return data as any as TogglesResp;
}

async function run() {
  const remoteToggles = await getRemoteToggles();

  const toggles = remoteToggles.toggles.map(toggle => {
    const arg = argv[toggle.id];
    if (arg && (arg === 'true' || arg === 'false')) {
      const defaultValue = arg === 'true';
      return {
        ...toggle,
        defaultValue,
      };
    }
    return toggle;
  });

  const togglesAndTests = {
    toggles,
    tests: remoteToggles.tests,
  };

  const s3Client = await getS3Client();

  const putObjectCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: `test-${key}`,
    Body: JSON.stringify(togglesAndTests),
    ACL: 'public-read',
    ContentType: 'application/json',
  });

  const { $metadata: putObjectResponseMetadata } = await s3Client.send(
    putObjectCommand
  );

  if (putObjectResponseMetadata.httpStatusCode === 200) {
    console.info(`Put toggles in S3 successfully`);
  } else {
    throw new Error(`Error putting toggles in S3 ${putObjectResponseMetadata}`);
  }

  // create an invalidation on the object
  const credentials = await getCredentials(
    'arn:aws:iam::130871440101:role/experience-admin'
  );
  const client = new CloudFrontClient({ region, credentials });
  const command = new CreateInvalidationCommand({
    // We just know this
    DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
    InvalidationBatch: {
      Paths: { Items: [`/test-${key}.json`], Quantity: 1 },
      CallerReference: 'TogglesInvalidationCallerReference',
    },
  });
  const response = await client.send(command);
  console.info(response);
}

run();
console.info(argv);
