import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { key, region } from './config';
import {
  getCredentials,
  getS3Client,
  getTogglesObject,
  putTogglesObject,
} from './aws';
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';

const argv = yargs(hideBin(process.argv)).parseSync();

async function run() {
  const s3Client = await getS3Client();
  const remoteToggles = await getTogglesObject(s3Client);

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

  const { $metadata: putObjectResponseMetadata } = await putTogglesObject(
    s3Client,
    togglesAndTests
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
      CallerReference: `TogglesInvalidationCallerReference${Date.now()}`,
    },
  });
  const response = await client.send(command);
  console.info(response);
}

run();
