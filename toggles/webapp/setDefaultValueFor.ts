import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { key, region } from './config';
import { getTogglesObject, putTogglesObject } from './s3-utils';
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';
import { S3Client } from '@aws-sdk/client-s3';
import { getCreds } from '@weco/ts-aws/sts';

const argv = yargs(hideBin(process.argv)).parseSync();

async function run() {
  const s3Client = new S3Client({ region });
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
  const credentials = await getCreds('experience', 'admin');
  const client = new CloudFrontClient({ region, credentials });
  const command = new CreateInvalidationCommand({
    DistributionId: 'E34PPJX23D6HKG',
    InvalidationBatch: {
      Paths: { Items: [`/${key}.json`], Quantity: 1 },
      CallerReference: `TogglesInvalidationCallerReference${Date.now()}`,
    },
  });
  const response = await client.send(command);
  console.info(response);
}

run();
